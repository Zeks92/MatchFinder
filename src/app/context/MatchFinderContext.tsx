"use client";

import React, { createContext, useReducer, useContext, useState } from "react";
import {
  SportOption,
  MatchFinderState,
  MatchFinderAction,
  MatchFinderContextProps,
  AvailableFilters,
  ScheduleEvent,
} from "../models/models";
import axios from "axios";
import { initialState, initialSportOptions } from "../utils/data/constants";

const matchFinderReducer = (
  state: MatchFinderState,
  action: MatchFinderAction
): MatchFinderState => {
  switch (action.type) {
    case "SET_SELECTED_SPORTS":
      return { ...state, selectedSports: action.payload };
    case "SET_SELECTED_CATEGORIES":
      return { ...state, selectedCategories: action.payload };
    case "SET_SELECTED_COMPETITIONS":
      return { ...state, selectedCompetitions: action.payload };
    case "SET_AVAILABLE_FILTERS":
      return { ...state, availableFilters: action.payload };
    case "SET_ALL_SCHEDULED_EVENTS":
      return { ...state, allScheduledEvents: action.payload };
    default:
      return state;
  }
};

const MatchFinderContext = createContext<MatchFinderContextProps | undefined>(
  undefined
);

export const MatchFinderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(matchFinderReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSportData = async (sports: SportOption[]) => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/schedule", { sports });

      const { schedules, errors, availableFilters } = response.data;

      if (errors && errors.length > 0) {
        console.warn("Errors during fetching:", errors);
      }

      if (schedules && schedules.length > 0) {
        dispatch({
          type: "SET_AVAILABLE_FILTERS",
          payload: availableFilters as AvailableFilters,
        });
        dispatch({
          type: "SET_ALL_SCHEDULED_EVENTS",
          payload: schedules as ScheduleEvent[],
        });
      } else {
        dispatch({
          type: "SET_AVAILABLE_FILTERS",
          payload: { categories: [], competitions: [] },
        });
        dispatch({ type: "SET_ALL_SCHEDULED_EVENTS", payload: [] });
      }
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MatchFinderContext.Provider
      value={{ state, dispatch, fetchSportData, isLoading }}
    >
      {children}
    </MatchFinderContext.Provider>
  );
};

export const useMatchFinder = () => {
  const context = useContext(MatchFinderContext);
  if (context === undefined) {
    throw new Error("useMatchFinder must be used within a MatchFinderProvider");
  }
  return context;
};

export const getFilteredEvents = (state: MatchFinderState): ScheduleEvent[] => {
  const { allScheduledEvents, selectedCategories, selectedCompetitions } =
    state;
  if (selectedCategories.length === 0 && selectedCompetitions.length === 0) {
    return allScheduledEvents;
  }
  return allScheduledEvents.filter((event) => {
    const category = event.sport_event.sport_event_context.category?.name;
    const competition = event.sport_event.sport_event_context.competition?.name;
    const isCategoryMatch =
      selectedCategories.length === 0 ||
      (category && selectedCategories.includes(category));
    const isCompetitionMatch =
      selectedCompetitions.length === 0 ||
      (competition && selectedCompetitions.includes(competition));

    let match: any = true;

    if (selectedCategories.length > 0) {
      match = match && isCategoryMatch;
    }

    if (selectedCompetitions.length > 0) {
      match = match && isCompetitionMatch;
    }

    return match;
  });
};

export { initialSportOptions };
