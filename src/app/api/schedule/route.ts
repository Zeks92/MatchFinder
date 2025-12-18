import { NextResponse, type NextRequest } from "next/server";
import axios from "axios";
import { SportOption } from "@/app/models/models";
import { initialSportOptions } from "@/app/utils/data/constants";

const scheduleCache: Record<string, any> = {};

export async function POST(request: NextRequest) {
  const API_KEY = process.env.SPORTRADAR_API_KEY;
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Server API key not configured." },
      { status: 500 }
    );
  }

  const { sports } = (await request.json()) as { sports: SportOption[] };
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const allSchedules: any[] = [];
  const uniqueCategories = new Set<string>();
  const uniqueCompetitions = new Set<string>();
  const errors: string[] = [];

  for (const sport of sports) {
    const config = initialSportOptions.find((s) => s.id === sport.id) || {
      endpoint: "soccer",
      version: "v4",
      file: "schedules.json",
    };
    const cacheKey = `${sport.endpoint}_${today}`;
    let rawScheduleData: any[] = [];

    if (scheduleCache[cacheKey]) {
      rawScheduleData = scheduleCache[cacheKey];
    } else {
      
      const url = `https://api.sportradar.com/${config.endpoint}/production/${config.version}/en/schedules/${today}/${config.file}`;
      try {
        const response = await axios.get(url, {
          params: {
            api_key: API_KEY,
            limit: 500,
          },
        });

        rawScheduleData =
          response.data.schedules || response.data.summaries || [];
        scheduleCache[cacheKey] = rawScheduleData;
      } catch (error: any) {
        if (error.response?.status === 403) {
          errors.push(
            `Access denied for ${sport.name}. Trial key might be expired or not assigned to this category.`
          );
        } else {
          errors.push(`Error fetching ${sport.name}.`);
        }
        continue;
      }
    }

    const validMatches = rawScheduleData.filter((item: any) => {
      if (!item?.sport_event || !item?.sport_event_status) return false;
      const matchStatus = item.sport_event_status?.match_status;
      const startTime = new Date(item.sport_event.start_time);

      const isStatusValid =
        matchStatus !== "ended" && matchStatus !== "postponed";

      const threeHoursAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
      const isStillRelevant = startTime > threeHoursAgo;

      return isStatusValid && isStillRelevant;
    });
    validMatches.forEach((scheduleItem: any) => {
      const context = scheduleItem.sport_event.sport_event_context;

      if (context.category?.name) {
        uniqueCategories.add(context.category.name);
      }
      if (context.competition?.name) {
        uniqueCompetitions.add(context.competition.name);
      }

      allSchedules.push(scheduleItem);
    });
  }

  return NextResponse.json({
    schedules: allSchedules,
    availableFilters: {
      categories: Array.from(uniqueCategories).sort(),
      competitions: Array.from(uniqueCompetitions).sort(),
    },
    errors: errors,
  });
}
