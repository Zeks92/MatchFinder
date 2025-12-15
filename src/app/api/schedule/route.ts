import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';
import { SportOption } from '@/app/models/models';

const scheduleCache: Record<string, any> = {}; 

export async function POST(request: NextRequest) {
  const API_KEY = process.env.SPORTRADAR_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: 'Server API key not configured.' }, { status: 500 });
  }

  const { sports } = await request.json() as { sports: SportOption[] };
  const today = new Date().toISOString().split('T')[0];
  const allSchedules: any[] = [];
  const uniqueCategories = new Set<string>();
  const uniqueCompetitions = new Set<string>();
  const errors: string[] = [];

  for (const sport of sports) {
    const cacheKey = `${sport.endpoint}_${today}`;
    let scheduleData: any[] = [];
    if (scheduleCache[cacheKey]) {
      scheduleData = scheduleCache[cacheKey];
    } else {
      const url = `https://api.sportradar.com/${sport.endpoint}/production/v4/en/schedules/${today}/schedules.json`;

      try {
        const response = await axios.get(url, {
          params: {
            api_key: API_KEY,
            limit: 20
          },
        });

        scheduleData = response.data.schedules || [];
        scheduleCache[cacheKey] = scheduleData;
      } catch (error) {
        console.error(`Error fetching data for ${sport.name}:`, error);
      }
    }
    
    scheduleData.forEach((scheduleItem: any) => {
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