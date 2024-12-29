"use client";
import { Stepper } from "@/components/admin/Stepper";
import { CodingExerciseForm } from "@/components/admin/study/CodingExerciseForm";
import TestcaseForm from "@/components/admin/study/TestcaseForm";
import VariableNameForm from "@/components/admin/study/VariableNameForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCurrentStep } from "@/redux/slices/admin/StudyFormSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const steps = ["Basic Info", "Instructions", "Equipment"];

export const formSchema = z.object({
    title: z.string().min(1, {
        message: "required",
    }),
    // content: z.string().min(1, {
    //     message: "required",
    // }),
    difficulty: z.string().min(1, {
        message: "required",
    }),
    tags: z.array(z.string()),
});

export default function CreateExercisePage() {
    const dispatch = useAppDispatch();
    const { currentStep, totalStep } = useAppSelector((state) => state.studyForm);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            // content: "",
            difficulty: "",
            tags: [],
        },
    });

    const handleNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        dispatch(setCurrentStep(currentStep + 1));
    };

    const handlePrevious = () => {
        dispatch(setCurrentStep(currentStep - 1));
    };
    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log("Form Data:", data);
    }

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
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto gap-3  max-w-3xl">
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
                        <Button type="submit">Submit</Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={(e) => {
                                handleNext(e);
                            }}
                        >
                            Next
                        </Button>
                    )}
                </form>
            </Form>
        </div>
    );
}
