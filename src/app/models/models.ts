import { EmotionCache } from "@emotion/react";

export interface Step2SportSelectProps {
    onValidate: (isValid: boolean) => void;
    onNext: () => void;
}

export interface Step3RefineSearchProps {
    onValidate: (isValid: boolean) => void;
    onNext: () => void;
    onBack: () => void;
}

export interface Step4ResultsProps {
    onBack: () => void;
    onReset: () => void;
}
export interface SportOption {
  id: string;
  name: string;
  endpoint: string;
  version: string;
  file: string;
}
export interface MatchFinderState {
  selectedSports: SportOption[];
  selectedCategories: string[];
  selectedCompetitions: string[];
  availableFilters: AvailableFilters;
  allScheduledEvents: ScheduleEvent[];
}
export interface MatchFinderContextProps {
  state: MatchFinderState;
  dispatch: React.Dispatch<MatchFinderAction>;
  fetchSportData: (sports: SportOption[]) => Promise<void>;
  isLoading: boolean;
}

export type MatchFinderAction =
  | { type: 'SET_SELECTED_SPORTS'; payload: SportOption[] }
  | { type: 'SET_SELECTED_CATEGORIES'; payload: string[] }
  | { type: 'SET_SELECTED_COMPETITIONS'; payload: string[] }
  | { type: 'SET_AVAILABLE_FILTERS'; payload: AvailableFilters }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ALL_SCHEDULED_EVENTS'; payload: ScheduleEvent[] };

  export interface AvailableFilters {
  categories: string[];
  competitions: string[];
}

export interface ScheduleEvent {
  sport_event: {
    id: string;
    start_time: string;
    competitors: { name: string; qualifier: string; }[];
    sport_event_context: {
      category: { name: string };
      competition: { name: string };
      sport: { name: string };
    };
  };
}

export interface EmotionCacheProviderProps {
  options: any;
  CacheProvider?: (props: { value: EmotionCache; children: React.ReactNode }) => React.JSX.Element | null;
  children: React.ReactNode;
}