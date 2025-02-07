"use client";
import { Stepper } from "@/components/admin/Stepper";
import { CodingExerciseForm } from "@/components/admin/algorithm/CodingExerciseForm";
import DefaultCodeForm from "@/components/admin/algorithm/DefaultCodeForm";
import SolutionCodeForm from "@/components/admin/algorithm/SolutionCodeForm";
import TestcaseForm from "@/components/admin/algorithm/TestcaseForm";
import VariableNameForm from "@/components/admin/algorithm/VariableNameForm";
import { LoadingSpinner } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addExercise, fetchAlgoExercise, fetchExercise, setAlgoExercise, setCodeEntries, setVariableNameAlgorithm, updateExercise } from "@/redux/slices/admin/exerciseStudySlice";
import { setCurrentStep, setVariableCount, setVariableName } from "@/redux/slices/admin/StudyFormSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { languages } from "prismjs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const steps = ["Basic Info", "Instructions", "Equipment", "Default", "Solution"];

export type TExerciseAlgo = {
    title: string;
    content: string;
    difficulty: string;
    tags: string[];
    testcases: {
        input: Record<string, any>[];
        hidden: boolean;
        outputExpected?: any;
    }[];
    defaultCode: {
        code: string;
        language: string;
    }[];
    solutions: {
        code: string;
        language: string;
    }[];
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
            input: z.array(
                z.record(z.any())
            ),
            outputExpected: z.any(),
            hidden: z.boolean(),
        })
    ),
    defaultCode: z.array(
        z.object({
            code: z.string().min(1, {
                message: "required",
            }),
            language: z.string().min(1, {
                message: "required",
            }),
        })
    ),
    solutions: z.array(
        z.object({
            code: z.string().min(1, {
                message: "required",
            }),
            language: z.string().min(1, {
                message: "required",
            }),
        })
    ),
    score: z.number().min(1, { message: "required" }),
});



export default function DetailExercisePage() {
    const [isSubmitting, setIsSubmitting] = useState(false); // State for button loading
    const dispatch = useAppDispatch();
    const { currentStep, totalStep } = useAppSelector((state) => state.studyForm);
    const axiosPrivate = usePrivate();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const { algoExercise } = useAppSelector((state) => state.exercises);



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            difficulty: "",
            tags: [],
            testcases: [
                {
                    input: [],
                    outputExpected: "",
                    hidden: false,
                },
            ],
            defaultCode: [
                {
                    code: "",
                    language: "",
                },
            ],
            solutions: [
                {
                    code: "",
                    language: "",
                },
            ],
            score: 0,
        },
    });


    useEffect(() => {
        if (segments[segments.length - 1] !== "exercise") {
            dispatch(fetchAlgoExercise({ axiosInstance: axiosPrivate, id: searchParams.get("id")! }))
            dispatch(setCurrentStep(0));
        } else {
            dispatch(setCodeEntries([]));
            dispatch(setAlgoExercise({}));

        }

    }, [searchParams, pathname]);


    useEffect(() => {
        console.log("algoExercise", algoExercise);

        if (!algoExercise.variableName) {
            const inputLength = algoExercise?.testcases?.[0]?.input?.length;
            dispatch(setVariableCount(inputLength || 0));

            const variableNames = algoExercise?.testcases?.[0]?.input?.map((input: any) => Object.keys(input)[0] || "") || [];
            dispatch(setVariableNameAlgorithm(variableNames));
        }
        if (algoExercise && Object.keys(algoExercise).length > 1 && segments[segments.length - 1] !== "exercise") {

            form.reset({
                title: algoExercise.title || "",
                content: algoExercise.content || "",
                difficulty: algoExercise.difficulty || "",
                tags: algoExercise.tags || [],
                testcases: algoExercise.testcases || [
                    {
                        input: [],
                        outputExpected: "",
                        hidden: false,
                    },
                ],
                defaultCode: algoExercise.defaultCode || [],
                solutions: algoExercise.solutions || [],
                score: algoExercise.score || 0,
            });
        }
    }, [algoExercise]);


    const handleNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        dispatch(setCurrentStep(currentStep + 1));
    };

    const handlePrevious = () => {
        dispatch(setCurrentStep(currentStep - 1));
    };

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        console.log("data algio", data)
        if (algoExercise.variableName?.length == 0) {
            data.testcases.forEach((testcase, index) => {
                data.testcases[index].input = [];
            });
        }
        console.log("segments[segments.length] ", segments[segments.length])
        if (segments[segments.length - 1] !== "exercise") {
            try {

                await axiosPrivate.put(`/algorithm/${algoExercise._id}`, data).then((res) => {
                    toast({
                        title: "Success",
                        description: "Exercise updated successfully",
                        variant: "success",
                    });
                    dispatch(updateExercise(res.data.data));
                    router.back();
                });
            }
            catch (e: any) {
                toast({
                    title: "Error",
                    description: e.response?.data?.message || "Something went wrong",
                    variant: "error",
                });
            }
            finally {
                setIsSubmitting(false);
            }
        }
        else {
            try {
                await axiosPrivate.post("/algorithm", data).then((res) => {
                    toast({
                        title: "Success",
                        description: "Exercise created successfully",
                        variant: "success",
                    });
                    dispatch(addExercise(res.data.data));
                    router.back();
                });
            } catch (e: any) {
                toast({
                    title: "Error",
                    description: e.response?.data?.message || "Something went wrong",
                    variant: "error",
                });
            } finally {
                setIsSubmitting(false);
            }
        }

    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <CodingExerciseForm formAlgo={form} />;
            case 1:
                return <VariableNameForm />;
            case 2:
                return <TestcaseForm formAlgo={form} />;
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-3xl min-h-screen">
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
                                    {isSubmitting ? <LoadingSpinner /> : "Submit"}
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
