"use client";
import { Stepper } from "@/components/admin/Stepper";
import { CodingExerciseForm } from "@/components/admin/study/CodingExerciseForm";
import DefaultCodeForm from "@/components/admin/study/DefaultCodeForm";
import SolutionCodeForm from "@/components/admin/study/SolutionCodeForm";
import TestcaseForm from "@/components/admin/study/TestcaseForm";
import VariableNameForm from "@/components/admin/study/VariableNameForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { toast, useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCurrentStep } from "@/redux/slices/admin/StudyFormSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoadingSpinner } from "@/components/loading";

const steps = [
    "Basic Info",
    "Instructions",
    "Equipment",
    "Default",
    "Solution",
];

export type TExerciseStudy = {
    title: string;
    content: string;
    difficulty: string;
    tags: string[];
    testcases: {
        input: Record<string, any>;
        hidden: boolean;
        output?: any;
    }[];
    defaultCode: string;
    solution: string;
    courseId: string;
    score: number;
};

export const formSchema = z.object({
    title: z.string().min(1, {
        message: "required",
    }),
    content: z.string().min(1, {
        message: "required",
    }),
    difficulty: z.string().min(1, {
        message: "required",
    }),
    tags: z.array(z.string()),
    testcases: z.array(
        z.object({
            input: z.record(z.any()),
            output: z.any(),
            hidden: z.boolean(),
        })
    ),
    defaultCode: z.string().min(1, {
        message: "required",
    }),
    solution: z.string().min(1, {
        message: "required",
    }),
    courseId: z.string().min(1, {
        message: "required",
    }),
    score: z.number().min(1, { message: "required" }),
});

export default function CreateExercisePage() {
    const [isSubmitting, setIsSubmitting] = useState(false); // State for button loading
    const dispatch = useAppDispatch();
    const { currentStep, totalStep } = useAppSelector((state) => state.studyForm);
    const axiosPrivate = usePrivate();
    const searchParams = useSearchParams();
    const courseId = searchParams.get("id");
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            difficulty: "",
            tags: [],
            testcases: [
                {
                    input: {},
                    output: "",
                    hidden: false,
                },
            ],
            defaultCode: "",
            solution: "",
            courseId: courseId || "",
            score: 0,
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
        setIsSubmitting(true); // Set loading state to true
        try {
            const response = await axiosPrivate.post("/study", data);
            router.push("/admin/study");
        } catch (e: any) {
            toast({
                title: "Error",
                description: e.response?.data?.message || "Something went wrong",
                variant: "error",
            });
        } finally {
            setIsSubmitting(false); // Reset loading state
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <CodingExerciseForm form={form} />;
            case 1:
                return <VariableNameForm form={form} />;
            case 2:
                return <TestcaseForm form={form} />;
            case 3:
                return <DefaultCodeForm form={form} />;
            case 4:
                return <SolutionCodeForm form={form} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <Stepper steps={steps} currentStep={currentStep} />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mx-auto max-w-3xl min-h-screen"
                >
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="flex justify-between w-full max-w-md">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentStep === 0 || isSubmitting}
                            >
                                Previous
                            </Button>
                            {currentStep === steps.length - 1 ? (
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? <LoadingSpinner />
                                        : "Submit"}
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={(e) => {
                                        handleNext(e);
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                    {renderStepContent()}
                </form>
            </Form>
        </div>
    );
}
