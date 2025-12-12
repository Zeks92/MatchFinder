"use client";

import React, { useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Button, TextField } from "@mui/material";
import {
  initialSportOptions,
  useMatchFinder,
} from "@/app/context/MatchFinderContext";
import { SportOption } from "@/app/models/models";
import { Step2SportSelectProps } from "@/app/models/models";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const Step2SportSelect: React.FC<Step2SportSelectProps> = ({
  onValidate,
  onNext,
}) => {
  const { state, dispatch, fetchSportData, isLoading } = useMatchFinder();
  const { selectedSports } = state;
  const handleChange = (
    event: React.SyntheticEvent,
    newValue: SportOption[]
  ) => {
    dispatch({ type: "SET_SELECTED_SPORTS", payload: newValue });
    onValidate(newValue.length > 0);
  };

  const handleNextStep = useCallback(() => {
    fetchSportData(selectedSports);
    onNext();
  }, [selectedSports, fetchSportData, onNext]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Select Your Sports
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Choose one or more sports you are interested in today. We will fetch the
        daily schedule for these categories.
      </Typography>

      <Autocomplete
        multiple
        id="sport-select-autocomplete"
        value={selectedSports}
        options={initialSportOptions}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={handleChange}
        renderOption={(props, option, { selected }) => (
          <li {...props} key={option.id}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.name}
              {...getTagProps({ index })}
              key={option.id}
              sx={{ textTransform: "uppercase" }}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Sports"
            placeholder="Search and Select Sports"
          />
        )}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          pt: 2,
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={handleNextStep}
          variant="contained"
          color="primary"
          disabled={selectedSports.length === 0 || isLoading}
        >
          {isLoading ? "Fetching Data..." : "Next"}
        </Button>
      </Box>
    </Box>
  );
};
