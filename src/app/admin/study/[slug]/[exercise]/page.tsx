"use client";
import { Stepper } from "@/components/admin/Stepper";
import { CodingExerciseForm } from "@/components/admin/study/CodingExerciseForm";
import DefaultCodeForm from "@/components/admin/study/DefaultCodeForm";
import SolutionCodeForm from "@/components/admin/study/SolutionCodeForm";
import TestcaseForm from "@/components/admin/study/TestcaseForm";
import VariableNameForm from "@/components/admin/study/VariableNameForm";
import { LoadingSpinner } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addExercise, fetchExercise, updateExercise, setVariableName } from "@/redux/slices/admin/exerciseStudySlice";
import { setCurrentStep, setVariableCount, } from "@/redux/slices/admin/StudyFormSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const steps = ["Basic Info", "Instructions", "Equipment", "Default", "Solution"];



 const formSchema = z.object({
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
    const { exercise, variableName } = useAppSelector((state) => state.exercises);



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
            defaultCode: "",
            solution: "",
            courseId: searchParams.get("id")!,
            score: 0,
        },
    });

    // useEffect(() => {
    //     if (exercise?.testcases?.[0]?.input) {
    //         const inputLength = exercise?.testcases?.[0]?.input?.length;
    //         dispatch(setVariableCount(inputLength));
    //         dispatch(setVariableName(Array(inputLength).fill(
    //             exercise?.testcases?.[0]?.input?.map((input: any) => Object.keys(input)[0])
    //         )));
    //     }
    // }, [exercise?.testcases?.[0]?.input]);

    useEffect(() => {
        if (segments[segments.length - 1] !== "exercise") {
            dispatch(fetchExercise({ axiosInstance: axiosPrivate, id: searchParams.get("id")! }))



            dispatch(setCurrentStep(0));
        }

    }, [searchParams]);

    useEffect(() => {

        if (exercise && Object.keys(exercise).length > 1 && segments[segments.length - 1] !== "exercise") {
            form.reset({

                title: exercise.title || "",
                content: exercise.content || "",
                difficulty: exercise.difficulty || "",
                tags: exercise.tags || [],
                testcases: exercise.testcases || [
                    {
                        input: [],
                        outputExpected: "",
                        hidden: false,
                    },
                ],
                defaultCode: exercise.defaultCode || "",
                solution: exercise.solution || "",
                courseId: exercise.courseId || searchParams.get("id")!,
                score: exercise.score || 0,
            });
        }
    }, [exercise]);


    const handleNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        dispatch(setCurrentStep(currentStep + 1));
    };

    const handlePrevious = () => {
        dispatch(setCurrentStep(currentStep - 1));
    };


    useEffect(() => {
        if (exercise?.testcases?.[0]?.input) {
            const inputLength = exercise.testcases[0].input.length;
            dispatch(setVariableCount(inputLength));
            const variableNames = exercise.testcases[0].input.map((input: any) => Object.keys(input)[0] || "");

            dispatch(setVariableName(variableNames));
            console.log("Dispatched variable names:", variableNames);
        }
    }, [exercise?.testcases?.[0]?.input]);
    useEffect(() => {
        console.log("variableName", exercise.variableName);
    }, [exercise.variableName]);

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        console.log("data", data)
        if (exercise.variableName?.length == 0) {
            data.testcases.forEach((testcase, index) => {
                data.testcases[index].input = [];
            });
        }
        if (segments[segments.length - 1] !== "exercise") {
            try {

                await axiosPrivate.put(`/study/${exercise._id}`, data).then((res) => {
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
                await axiosPrivate.post("/study", data).then((res) => {
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
                return <CodingExerciseForm form={form} />;
            case 1:
                return <VariableNameForm />;
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
        <Suspense>
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
        </Suspense>
    );
}
