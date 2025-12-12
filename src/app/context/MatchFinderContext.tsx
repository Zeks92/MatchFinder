'use client';

import React, { createContext, useReducer, useContext, useState } from 'react';
import { SportOption, MatchFinderState, MatchFinderAction, MatchFinderContextProps } from '../models/models';

const initialSportOptions: SportOption[] = [
  { id: '1', name: 'Football', endpoint: 'soccer' },
  { id: '2', name: 'Basketball', endpoint: 'basketball' },
  { id: '3', name: 'Tennis', endpoint: 'tennis' }, 
  { id: '4', name: 'Ice Hockey', endpoint: 'icehockey' },
];

const initialState: MatchFinderState = {
  selectedSports: [],
  selectedCategories: [],
  selectedCompetitions: [],
};

const matchFinderReducer = (state: MatchFinderState, action: MatchFinderAction): MatchFinderState => {
  switch (action.type) {
    case 'SET_SELECTED_SPORTS':
      return { ...state, selectedSports: action.payload };
    case 'SET_SELECTED_CATEGORIES':
      return { ...state, selectedCategories: action.payload };
    case 'SET_SELECTED_COMPETITIONS':
      return { ...state, selectedCompetitions: action.payload };
    default:
      return state;
  }
};

const MatchFinderContext = createContext<MatchFinderContextProps | undefined>(undefined);

export const MatchFinderProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(matchFinderReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const fetchSportData = async (sports: SportOption[]) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    setIsLoading(false);
  };

  return (
    <MatchFinderContext.Provider value={{ state, dispatch, fetchSportData, isLoading }}>
      {children}
    </MatchFinderContext.Provider>
  );
};

export const useMatchFinder = () => {
  const context = useContext(MatchFinderContext);
  if (context === undefined) {
    throw new Error('useMatchFinder must be used within a MatchFinderProvider');
  }
  return context;
};

export { initialSportOptions };