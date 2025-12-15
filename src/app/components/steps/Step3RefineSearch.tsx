'use client';

import React, { useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useMatchFinder } from '@/app/context/MatchFinderContext';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { Step3RefineSearchProps } from '@/app/models/models';
import { MAX_SELECTIONS, AGGREGATION_THRESHOLD } from '@/app/utils/data/constants';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


export const Step3RefineSearch: React.FC<Step3RefineSearchProps> = ({ onValidate, onNext, onBack }) => {
  const { state, dispatch, isLoading } = useMatchFinder();
  const { availableFilters, selectedCategories, selectedCompetitions } = state;
  const hasAvailableFilters = availableFilters.categories.length > 0;
  React.useEffect(() => {
    onValidate(selectedCategories.length > 0 || selectedCompetitions.length > 0);
  }, [selectedCategories, selectedCompetitions, onValidate]);

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: string[]) => {
    if (newValue.length > MAX_SELECTIONS) {
        return; 
    }
    dispatch({ type: 'SET_SELECTED_CATEGORIES', payload: newValue });
  };
  
  const handleCompetitionChange = (event: React.SyntheticEvent, newValue: string[]) => {
    if (newValue.length > MAX_SELECTIONS) {
        return; 
    }
    dispatch({ type: 'SET_SELECTED_COMPETITIONS', payload: newValue });
  };

  const renderAggregatedTags = useCallback((
    tagValue: string[], 
    getTagProps: (options: { index: number }) => any
  ) => {
    const totalSelected = tagValue.length;
    
    if (totalSelected === 0) return null;
    if (totalSelected <= AGGREGATION_THRESHOLD) {
      return tagValue.map((option, index) => (
        <Chip
          variant="outlined"
          label={option}
          {...getTagProps({ index })}
          key={option}
          size="small"
        />
      ));
    }

    const aggregatedCount = totalSelected - AGGREGATION_THRESHOLD;
    const remainingOptions = tagValue.slice(AGGREGATION_THRESHOLD);
    
    const visibleTags = tagValue.slice(0, AGGREGATION_THRESHOLD).map((option, index) => (
        <Chip
          variant="outlined"
          label={option}
          {...getTagProps({ index })}
          key={option}
          size="small"
        />
    ));
    
    const moreChip = (
        <Tooltip
            key="more-chip"
            title={
                <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>{aggregatedCount} More Selected:</Typography>
                    {remainingOptions.map((name, idx) => (
                        <Typography key={idx} variant="body2" sx={{ my: 0.5 }}>- {name}</Typography>
                    ))}
                </Box>
            }
            placement="top"
        >
            <Chip
                variant="filled"
                label={`+${aggregatedCount} More`}
                {...getTagProps({ index: AGGREGATION_THRESHOLD })} 
                size="small"
                color="info"
            />
        </Tooltip>
    );

    return [...visibleTags, moreChip];

  }, [AGGREGATION_THRESHOLD]);

  const handleSelectAll = (options: string[], selected: string[], setter: (newValue: string[]) => void) => {
    if (selected.length === options.length) {
      setter([]);
    } else {
      setter(options.slice(0, MAX_SELECTIONS)); 
    }
  };

  let content = null;

  if (isLoading) {
    content = (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress color="primary" size={50} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Processing schedules, please wait...
        </Typography>
      </Box>
    );
    
  } else if (!hasAvailableFilters) {
    content = (
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="h6" color="warning.main">
          No active schedules found for your selection today. Please go back and choose different sports.
        </Typography>
      </Box>
    );

  } else {
    content = (
                <Box>
          <Autocomplete
            multiple
            id="category-select-autocomplete"
            value={selectedCategories}
            options={availableFilters.categories}
            getOptionLabel={(option) => option}
            onChange={handleCategoryChange}
            disableCloseOnSelect
            renderTags={renderAggregatedTags}

            renderOption={(props, option, { selected }) => (
              <li {...props} key={option}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                {option}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Filter by Countries/Categories (Max 5)" placeholder="e.g., International, Spain, Germany" />
            )}
            sx={{ mb: 4 }}
          />

          <Autocomplete
            multiple
            id="competition-select-autocomplete"
            value={selectedCompetitions}
            options={availableFilters.competitions}
            getOptionLabel={(option) => option}
            onChange={handleCompetitionChange}
            disableCloseOnSelect
            renderTags={renderAggregatedTags}

            renderOption={(props, option, { selected }) => (
              <li {...props} key={option}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                {option}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Filter by Leagues/Competitions (Max 5)" placeholder="e.g., Champions League, Premier League, Superliga" />
            )}
          />
        </Box>
    )
  }



  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Refine Your Search
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Based on today's schedule for your selected sports, choose up to {MAX_SELECTIONS} categories or competitions to focus on.
      </Typography>

        {content}

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'flex-end' }}>
            <Button 
            onClick={onBack}
            variant="outlined" 
            color="inherit"
          >
            Back
          </Button>
          <Button 
            onClick={onNext} 
            variant="contained" 
            color="primary"
            disabled={!hasAvailableFilters || (selectedCategories.length === 0 && selectedCompetitions.length === 0)}
          >
            Next
          </Button>
      </Box>
      
    </Box>
  );
};