import { SportOption, MatchFinderState } from "@/app/models/models";

export const MAX_SELECTIONS = 5; 
export const AGGREGATION_THRESHOLD = 3; 
export const initialSportOptions: SportOption[] = [
  { id: '1', name: 'Football', endpoint: 'soccer' },
  { id: '2', name: 'Basketball', endpoint: 'basketball' },
  { id: '3', name: 'Tennis', endpoint: 'tennis' }, 
  { id: '4', name: 'Ice Hockey', endpoint: 'icehockey' },
];

export const initialState: MatchFinderState = {
  selectedSports: [],
  selectedCategories: [],
  selectedCompetitions: [],
  availableFilters: {
    categories: [],
    competitions: [],
  }
};
export const steps = [
  "Welcome Aboard",
  "Select Sports",
  "Refine Search",
  "Get Matches!",
];