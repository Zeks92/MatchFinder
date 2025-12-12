export interface Step2SportSelectProps {
    onValidate: (isValid: boolean) => void;
    onNext: () => void;
}
export interface SportOption {
  id: string;
  name: string;
  endpoint: string;
}

export interface MatchFinderState {
  selectedSports: SportOption[];
  selectedCategories: string[];
  selectedCompetitions: string[];
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
  | { type: 'SET_LOADING'; payload: boolean };