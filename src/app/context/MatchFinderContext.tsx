'use client';

import React, { createContext, useReducer, useContext, useState } from 'react';
import { SportOption, MatchFinderState, MatchFinderAction, MatchFinderContextProps, AvailableFilters } from '../models/models';
import axios from 'axios';

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
  availableFilters: {
    categories: [],
    competitions: [],
  }
};

const matchFinderReducer = (state: MatchFinderState, action: MatchFinderAction): MatchFinderState => {
  switch (action.type) {
    case 'SET_SELECTED_SPORTS':
      return { ...state, selectedSports: action.payload };
    case 'SET_SELECTED_CATEGORIES':
      return { ...state, selectedCategories: action.payload };
    case 'SET_SELECTED_COMPETITIONS':
      return { ...state, selectedCompetitions: action.payload };
    case 'SET_AVAILABLE_FILTERS':
      return { ...state, availableFilters: action.payload };
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
    
    try {
      const response = await axios.post('/api/schedule', { sports });
      
      const { schedules, errors, availableFilters } = response.data;
      
      if (errors && errors.length > 0) {
        console.warn('Errors during fetching:', errors);
      }
      
      if (schedules && schedules.length > 0) {
        dispatch({ type: 'SET_AVAILABLE_FILTERS', payload: availableFilters as AvailableFilters });
      } else {
        dispatch({ type: 'SET_AVAILABLE_FILTERS', payload: { categories: [], competitions: [] } });
      }

    } catch (error) {
      console.error('API call failed:', error);
    } finally {
      setIsLoading(false);
    }
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