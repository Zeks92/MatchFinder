"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Step1Welcome } from "./steps/Step1Welcome";
import { Step2SportSelect } from "./steps/Step2SportSelect";
import { Step3RefineSearch } from "./steps/Step3RefineSearch";
import { steps } from "../utils/data/constants";

const Step4Results = () => <Box sx={{ p: 3 }}>Step 4 Content Placeholder</Box>;

export default function MatchFinderStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [isStepValid, setIsStepValid] = useState(false);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setIsStepValid(false);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleValidationChange = (isValid: boolean) => {
    setIsStepValid(isValid);
  };

  const isStepOptional = (step: number) => {
    return false;
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getStepContent = (step: number, handleNext: () => void) => {
    switch (step) {
      case 0:
        return <Step1Welcome onNext={handleNext} />;
      case 1:
        return (
          <Step2SportSelect
            onValidate={handleValidationChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Step3RefineSearch
            onValidate={handleValidationChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return <Step4Results />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ pt: 3, pb: 5 }}>
        {steps.map((label, index) => {
          const stepProps: { optional?: boolean } = {};
          if (isStepOptional(index)) {
            stepProps.optional = true;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <Paper square elevation={0} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">
            All steps completed - your results are ready!
          </Typography>
          <Button onClick={handleReset} sx={{ mt: 3 }}>
            Start Over
          </Button>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: { xs: 2, md: 5 }, minHeight: 400 }}>
          {getStepContent(activeStep, handleNext)}

          {activeStep === 0 && null}

          {activeStep === steps.length - 1 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                pt: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={handleBack} disabled={activeStep === 0}>
                Back
              </Button>
              <Button
                onClick={handleNext}
                variant="contained"
                color="primary"
                sx={{ ml: 1 }}
              >
                Finish
              </Button>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}
