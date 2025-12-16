"use client";

import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import {
  useMatchFinder,
  getFilteredEvents,
} from "@/app/context/MatchFinderContext";
import { ScheduleEvent, Step4ResultsProps } from "@/app/models/models";
import { formatTime } from "@/app/utils/helpers/formatTime";

export const Step4Results: React.FC<Step4ResultsProps> = ({
  onBack,
  onReset,
}) => {
  const { state } = useMatchFinder();
  const filteredEvents = useMemo(() => getFilteredEvents(state), [state]);
  const filtersUsed = [
    ...state.selectedCategories,
    ...state.selectedCompetitions,
  ];
  const totalResults = filteredEvents.length;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Daily Matches ({totalResults})
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {totalResults > 0
          ? `Results filtered by: ${filtersUsed.join(", ")}`
          : `No results found for your selected criteria.`}
      </Typography>

      <Paper
        elevation={1}
        sx={{ maxHeight: 500, overflowY: "auto", p: 1, mb: 4 }}
      >
        {totalResults === 0 ? (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography variant="h6" color="error.main">
              No matches fit your selected Country/League criteria today.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredEvents.map((event: ScheduleEvent, index: any) => {
              const homeTeam = event.sport_event.competitors.find(
                (c) => c.qualifier === "home"
              );
              const awayTeam = event.sport_event.competitors.find(
                (c) => c.qualifier === "away"
              );

              const category =
                event.sport_event.sport_event_context.category?.name || "N/A";
              const competition =
                event.sport_event.sport_event_context.competition?.name ||
                "N/A";

              return (
                <React.Fragment key={event.sport_event.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`${homeTeam?.name || "Unknown"} vs ${
                        awayTeam?.name || "Unknown"
                      }`}
                      secondary={
                        <Box component="span" sx={{ display: "block" }}>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {formatTime(event.sport_event.start_time)}
                          </Typography>
                          {" - "}
                          {competition} ({category})
                        </Box>
                      }
                      primaryTypographyProps={{
                        variant: "subtitle1",
                        fontWeight: "bold",
                      }}
                    />
                  </ListItem>
                  {index < totalResults - 1 && <Divider component="li" />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Paper>

      {/* Kontrole (Back/Start Over) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          pt: 2,
          justifyContent: "space-between",
        }}
      >
        <Button onClick={onBack} variant="outlined" color="inherit">
          Refine Filters
        </Button>

        <Button onClick={onReset} variant="contained" color="primary">
          Start Over
        </Button>
      </Box>
    </Box>
  );
};
