import { SportOption, MatchFinderState } from "@/app/models/models";

export const MAX_SELECTIONS = 5; 
export const AGGREGATION_THRESHOLD = 3; 
export const initialSportOptions: SportOption[] = [
  { id: '1', name: 'Football', endpoint: 'soccer', version: 'v4', file: 'schedules.json' },
  { id: '2', name: 'Basketball', endpoint: 'basketball', version: 'v2', file: 'summaries.json'},
  { id: '3', name: 'Tennis', endpoint: 'tennis', version: 'v3', file: 'summaries.json' }
];

export const initialState: MatchFinderState = {
  selectedSports: [],
  selectedCategories: [],
  selectedCompetitions: [],
  availableFilters: {
    categories: [],
    competitions: [],
  },
  allScheduledEvents: [],
};
export const steps = [
  "Welcome Aboard",
  "Select Sports",
  "Refine Search",
  "Get Matches!",
];