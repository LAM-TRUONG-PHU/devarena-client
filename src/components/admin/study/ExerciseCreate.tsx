"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stepper } from "../Stepper";
import TestcaseForm from "../TestcaseForm";
import { CodingExerciseForm } from "../CodingExerciseForm";

const steps = ["Basic Info", "Instructions", "Equipment"];

export function ExerciseCreate() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    instructions: "",
    equipment: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <CodingExerciseForm language="java"></CodingExerciseForm>
          </>
        );
      case 1:
        return (
          <TestcaseForm/>
        );
      case 2:
        return (
          <div className="mb-4">
            <Label htmlFor="equipment">Equipment</Label>
            <Input
              id="equipment"
              name="equipment"
              value={formData.equipment}
              onChange={handleInputChange}
              placeholder="Enter required equipment"
            />
          </div>
        );
   
      default:
        return null;
    }
  };

  return (
    <div>
      <Stepper steps={steps} currentStep={currentStep} />
      {/* <form onSubmit={handleSubmit}></form> */}
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
