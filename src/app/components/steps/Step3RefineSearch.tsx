"use client";

import React, { useCallback, useMemo, useEffect } from "react";
import { 
  Box, Typography, Button, Chip, TextField, Autocomplete, 
  Checkbox, Tooltip, CircularProgress 
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useMatchFinder } from "@/app/context/MatchFinderContext";
import { Step3RefineSearchProps } from "@/app/models/models";
import { MAX_SELECTIONS, AGGREGATION_THRESHOLD } from "@/app/utils/data/constants";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const Step3RefineSearch: React.FC<Step3RefineSearchProps> = ({
  onValidate,
  onNext,
  onBack,
}) => {
  const { state, dispatch, isLoading } = useMatchFinder();
  const { 
    availableFilters, 
    selectedCategories, 
    selectedCompetitions, 
    allScheduledEvents 
  } = state;

  const hasAvailableFilters = availableFilters.categories.length > 0;
  const filteredCompetitionsOptions = useMemo(() => {
    if (selectedCategories.length === 0) {
      return availableFilters.competitions;
    }
    const validLeagues = new Set<string>();
    allScheduledEvents.forEach((event) => {
      const categoryName = event.sport_event.sport_event_context.category?.name;
      const competitionName = event.sport_event.sport_event_context.competition?.name;

      if (categoryName && selectedCategories.includes(categoryName) && competitionName) {
        validLeagues.add(competitionName);
      }
    });

    return Array.from(validLeagues).sort();
  }, [selectedCategories, availableFilters.competitions, allScheduledEvents]);

  useEffect(() => {
    if (selectedCategories.length > 0 && selectedCompetitions.length > 0) {
      const stillValidCompetitions = selectedCompetitions.filter(comp => 
        filteredCompetitionsOptions.includes(comp)
      );
      if (stillValidCompetitions.length !== selectedCompetitions.length) {
        dispatch({ type: "SET_SELECTED_COMPETITIONS", payload: stillValidCompetitions });
      }
    }
  }, [selectedCategories, filteredCompetitionsOptions, selectedCompetitions, dispatch]);

  useEffect(() => {
    onValidate(selectedCategories.length > 0 || selectedCompetitions.length > 0);
  }, [selectedCategories, selectedCompetitions, onValidate]);

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: string[]) => {
    if (newValue.length > MAX_SELECTIONS) return;
    dispatch({ type: "SET_SELECTED_CATEGORIES", payload: newValue });
  };

  const handleCompetitionChange = (event: React.SyntheticEvent, newValue: string[]) => {
    if (newValue.length > MAX_SELECTIONS) return;
    dispatch({ type: "SET_SELECTED_COMPETITIONS", payload: newValue });
  };

  const renderAggregatedTags = useCallback(
  (tagValue: string[], getTagProps: (options: { index: number }) => any) => {
    const totalSelected = tagValue.length;
    if (totalSelected === 0) return null;

    if (totalSelected <= AGGREGATION_THRESHOLD) {
      return tagValue.map((option, index) => {
        const { key, ...tagProps } = getTagProps({ index });
        return (
          <Chip
            key={key}
            variant="outlined"
            label={option}
            {...tagProps}
            size="small"
          />
        );
      });
    }

    const visibleTags = tagValue.slice(0, AGGREGATION_THRESHOLD).map((option, index) => {
      const { key, ...tagProps } = getTagProps({ index });
      return (
        <Chip
          key={key}
          variant="outlined"
          label={option}
          {...tagProps}
          size="small"
        />
      );
    });

    const aggregatedCount = totalSelected - AGGREGATION_THRESHOLD;
    const remainingOptions = tagValue.slice(AGGREGATION_THRESHOLD);
    const { key: moreKey, ...moreTagProps } = getTagProps({ index: AGGREGATION_THRESHOLD });

    const moreChip = (
      <Tooltip
        key="more-chip-tooltip"
        title={
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {aggregatedCount} More Selected:
            </Typography>
            {remainingOptions.map((name, idx) => (
              <Typography key={idx} variant="body2" sx={{ my: 0.5 }}>
                - {name}
              </Typography>
            ))}
          </Box>
        }
        placement="top"
      >
        <Chip
          key={moreKey}
          variant="filled"
          label={`+${aggregatedCount} More`}
          {...moreTagProps}
          size="small"
          color="info"
        />
      </Tooltip>
    );

    return [...visibleTags, moreChip];
  },
  [AGGREGATION_THRESHOLD]
);

  if (isLoading) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress color="primary" size={50} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">Processing schedules...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Refine Your Search</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Choose up to {MAX_SELECTIONS} categories or competitions.
      </Typography>

      {!hasAvailableFilters ? (
        <Typography variant="h6" color="warning.main" sx={{ textAlign: "center", py: 5 }}>
          No active schedules found. Please go back and choose different sports.
        </Typography>
      ) : (
        <Box>
          <Autocomplete
            multiple
            id="category-select"
            value={selectedCategories}
            options={availableFilters.categories}
            onChange={handleCategoryChange}
            disableCloseOnSelect
            renderTags={renderAggregatedTags}
            renderOption={(props, option, { selected }) => {
              const { key, ...restProps } = props as { key?: React.Key } & typeof props;
              return (
                <li key={option} {...restProps}>
                  <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                  {option}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label="Filter by Countries/Categories" placeholder="Search countries..." />
            )}
            sx={{ mb: 4 }}
          />

          <Autocomplete
            multiple
            id="competition-select"
            value={selectedCompetitions}
            options={filteredCompetitionsOptions}
            onChange={handleCompetitionChange}
            disableCloseOnSelect
            renderTags={renderAggregatedTags}
            renderOption={(props, option, { selected }) => {
              const { key, ...restProps } = props as { key?: React.Key } & typeof props;
              return (
                <li key={option} {...restProps}>
                  <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                  {option}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label="Filter by Leagues/Competitions" placeholder="Search leagues..." />
            )}
          />
        </Box>
      )}

      <Box sx={{ display: "flex", pt: 4, justifyContent: "flex-end", gap: 2 }}>
        <Button onClick={onBack} variant="outlined" color="inherit">Back</Button>
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