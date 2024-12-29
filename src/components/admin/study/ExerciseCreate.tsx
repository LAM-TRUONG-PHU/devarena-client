"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCurrentStep } from "@/redux/slices/admin/StudyFormSlice";
import { Stepper } from "../Stepper";
import { CodingExerciseForm } from "./CodingExerciseForm";
import TestcaseForm from "./TestcaseForm";
import VariableNameForm from "./VariableNameForm";
import { useForm } from "react-hook-form";

const steps = ["Basic Info", "Instructions", "Equipment"];

export function ExerciseCreate() {
    const dispatch = useAppDispatch();
    const { currentStep, totalStep } = useAppSelector((state) => state.studyForm);
    const form = useForm();

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
                        <CodingExerciseForm form={form} />
                    </>
                );
            case 1:
                return <VariableNameForm />;
            case 2:
                return <TestcaseForm></TestcaseForm>;
            default:
                return null;
        }
    };

    return (
        <div>
            <Stepper steps={steps} currentStep={currentStep} />
            {renderStepContent()}
            <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
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
