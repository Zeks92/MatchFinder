"use client";

import { Box, Typography, Divider, Button } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";

export const Step1Welcome = ({ onNext }: { onNext: () => void }) => {
  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h3" component="h1" gutterBottom color="primary">
        Welcome to MatchFinder!
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        Your personalized guide to the day's best sports action.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body1" sx={{ mb: 4, px: { xs: 1, md: 8 } }}>
        Tired of endless scrolling to find out what's on? We get it. MatchFinder
        cuts through the noise. Simply tell us which sports and leagues you care
        about, and our system will instantly fetch **only the most relevant
        games happening today**. No more searching, just watching. Let's find
        your perfect match!
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={onNext}
        endIcon={<SportsSoccerIcon />}
        sx={{
          mt: 2,
          py: 1.5,
          fontSize: "1.1rem",
          borderRadius: 8,
        }}
      >
        Let's Get Started!
      </Button>
    </Box>
  );
};