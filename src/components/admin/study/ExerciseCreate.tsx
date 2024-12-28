"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stepper } from "../Stepper";
import { CodingExerciseForm } from "./CodingExerciseForm";
import { setCurrentStep } from "@/redux/slices/admin/StudyFormSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import VariableNameForm from "./VariableNameForm";
import TestcaseForm from "./TestcaseForm";

const steps = ["Basic Info", "Instructions", "Equipment"];

export function ExerciseCreate() {
  const dispatch = useAppDispatch();
  const { currentStep, totalStep } = useAppSelector((state) => state.studyForm);

  const handleNext = () => {
    dispatch(setCurrentStep(currentStep + 1));
  };

  const handlePrevious = () => {
    dispatch(setCurrentStep(currentStep - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <CodingExerciseForm language="java" />
          </>
        );
      case 1:
        return <VariableNameForm />;
      case 2:
        return (
          <TestcaseForm>
          </TestcaseForm>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Stepper steps={steps} currentStep={currentStep} />
      {renderStepContent()}
      <Button
        type="button"
        variant="outline"
        onClick={handlePrevious}
        disabled={currentStep === 0}
      >
        Previous
      </Button>
      {currentStep === steps.length - 1 ? (
        <Button type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      ) : (
        <Button type="button" onClick={handleNext}>
          Next
        </Button>
      )}
    </div>
  );
}
