// "use client";
// import DefaultCodeForm from "@/components/admin/contest/DefaultCode";
// import SolutionCodeForm from "@/components/admin/contest/SolutionCode";
// import { Stepper } from "@/components/admin/Stepper";
// import { CodingExerciseForm } from "@/components/admin/study/CodingExerciseForm";
// import TestcaseForm from "@/components/admin/study/TestcaseForm";
// import VariableNameForm from "@/components/admin/study/VariableNameForm";
// import { LoadingSpinner } from "@/components/loading";
// import { Button } from "@/components/ui/button";
// import { Form } from "@/components/ui/form";
// import { useToast } from "@/hooks/use-toast";
// import { usePrivate } from "@/hooks/usePrivateAxios";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { addContestExercise, setCurrentStep } from "@/redux/slices/admin/ContestSlice";
// import {

//   updateExercise,
// } from "@/redux/slices/admin/exerciseStudySlice";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// const steps = [
//   "Basic Info",
//   "Instructions",
//   "Equipment",
//   "Default",
//   "Solution",
// ];

// export type TExerciseArena = {
//   title: string;
//   content: string;
//   difficulty: string;
//   tags: string[];
//   testcases: {
//     input: Record<string, any>[];
//     hidden: boolean;
//     outputExpected?: any;
//   }[];
//   // defaultCode: string;
//   // solution: string;
//   defaultCode: {
//     code: string;
//     language: string;
//   }[];
//   solutions: {
//     code: string;
//     language: string;
//   }[];
//   contestId: string;
//   score: number;
// };

// export const formSchema = z.object({
//   title: z.string().min(1, {
//     message: "required",
//   }),
//   content: z.string().min(1, {
//     message: "required",
//   }),
//   difficulty: z.string().min(1, {
//     message: "required",
//   }),
//   tags: z.array(z.string()),
//   testcases: z.array(
//     z.object({
//       input: z.array(z.any()),
//       outputExpected: z.any(),
//       hidden: z.boolean(),
//     })
//   ),
//   defaultCode: z.array(
//     z.object({
//       code: z.string().min(1, {
//         message: "required",
//       }),
//       language: z.string().min(1, {
//         message: "required",
//       }),
//     })
//   ),
//   solutions: z.array(
//     z.object({
//       code: z.string().min(1, {
//         message: "required",
//       }),
//       language: z.string().min(1, {
//         message: "required",
//       }),
//     })
//   ),
//   contestId: z.string().min(1, {
//     message: "required",
//   }),
//   score: z.number().min(1, { message: "required" }),
// });

// export default function DetailExercisePage() {
//   const [isSubmitting, setIsSubmitting] = useState(false); // State for button loading
//   const dispatch = useAppDispatch();
//   const { currentStep, totalStep } = useAppSelector((state) => state.contest);
//   const axiosPrivate = usePrivate();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { toast } = useToast();
//   const pathname = usePathname();
//   const segments = pathname.split("/").filter(Boolean);
//   const { exercise } = useAppSelector((state) => state.exercises);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       content: "",
//       difficulty: "",
//       tags: [],
//       testcases: [
//         {
//           input: [],
//           outputExpected: "",
//           hidden: false,
//         },
//       ],
//       // defaultCode: "",
//       // solution: "",
//       defaultCode: [],
//       solutions: [],
//       contestId: searchParams.get("contestId")!,
//       score: 0,
//     },
//   });

//   // useEffect(() => {
//   //     if (segments[segments.length - 1] !== "exercise") {
//   //         dispatch(fetchExercise({ axiosInstance: axiosPrivate, id: searchParams.get("id")! }));
//   //         dispatch(setCurrentStep(0));
//   //     }

//   // }, [searchParams]);
//   // useEffect(() => {
//   //     if (exercise && Object.keys(exercise).length > 1) {
//   //         form.reset({

//   //             title: exercise.title || "",
//   //             content: exercise.content || "",
//   //             difficulty: exercise.difficulty || "",
//   //             tags: exercise.tags || [],
//   //             testcases: exercise.testcases || [
//   //                 {
//   //                     input: [],
//   //                     outputExpected: "",
//   //                     hidden: false,
//   //                 },
//   //             ],
//   //             // defaultCode: exercise.defaultCode || "",
//   //             defaultCode: exercise.defaultCode || [{
//   //                 code: "",
//   //                 language: "java",
//   //             }],
//   //             // solution: exercise.solution || "",
//   //             solutions: exercise.solutions || [{
//   //                 code: "",
//   //                 language: "java",
//   //             }],
//   //             contestId: exercise.contestId || searchParams.get("id")!,
//   //             score: exercise.score || 0,
//   //         });
//   //     }
//   // }, [exercise]);

//   const handleNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
//     e.preventDefault();
//     dispatch(setCurrentStep(currentStep + 1));
//   };

//   const handlePrevious = () => {
//     dispatch(setCurrentStep(currentStep - 1));
//   };

//   // console.log("exercise", exercise);
//   async function onSubmit(data: z.infer<typeof formSchema>) {
//     console.log("data", data);
//     setIsSubmitting(true);
//     if (exercise.variableName?.length == 0) {
//       data.testcases.forEach((testcase, index) => {
//         data.testcases[index].input = [];
//       });
//     }
//     await axiosPrivate.post("/contest-exercise", data).then((res) => {
//       toast({
//         title: "Success",
//         description: "Exercise created successfully",
//         variant: "success",
//       });
//       dispatch(addContestExercise(res.data.data));
//       router.back();
//     });
//     // if (segments[segments.length - 1] !== "exercise") {
//     //   try {
//     //     console.log("data", data);
//     //     await axiosPrivate.put(`/study/${exercise._id}`, data).then((res) => {
//     //       toast({
//     //         title: "Success",
//     //         description: "Exercise updated successfully",
//     //         variant: "success",
//     //       });
//     //       dispatch(updateExercise(res.data.data));
//     //       router.back();
//     //     });
//     //   } catch (e: any) {
//     //     toast({
//     //       title: "Error",
//     //       description: e.response?.data?.message || "Something went wrong",
//     //       variant: "error",
//     //     });
//     //   } finally {
//     //     setIsSubmitting(false);
//     //   }
//     // }
//     // else {
//     //   try {

//     //   } catch (e: any) {
//     //     toast({
//     //       title: "Error",
//     //       description: e.response?.data?.message || "Something went wrong",
//     //       variant: "error",
//     //     });
//     //   } finally {
//     //     setIsSubmitting(false);
//     //   }
//     // }
//   }

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 0:
//         return <CodingExerciseForm form={form} />;
//       case 1:
//         return <VariableNameForm />;
//       case 2:
//         return <TestcaseForm form={form} />;
//       case 3:
//         return <DefaultCodeForm form={form} />;
//       case 4:
//         return <SolutionCodeForm form={form} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       <Stepper steps={steps} currentStep={currentStep} />
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="mx-auto max-w-3xl min-h-screen"
//         >
//           <div className="flex flex-col items-center justify-center space-y-4">
//             <div className="flex justify-between w-full max-w-md">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handlePrevious}
//                 disabled={currentStep === 0 || isSubmitting}
//               >
//                 Previous
//               </Button>
//               {currentStep === steps.length - 1 ? (
//                 <Button
//                   type="submit"
//                   disabled={isSubmitting}
//                   onClick={() => {
//                     const values = form.getValues();
//                     console.log("Current form values:", values);
//                     const result = formSchema.safeParse(values);
//                     if (!result.success) {
//                       console.log("Validation errors:", result.error);
//                     } else {
//                       onSubmit(values);
//                     }
//                   }}
//                 >
//                   {isSubmitting ? <LoadingSpinner /> : "Submit"}
//                 </Button>
//               ) : (
//                 <Button
//                   type="button"
//                   onClick={(e) => {
//                     handleNext(e);
//                   }}
//                   disabled={isSubmitting}
//                 >
//                   Next
//                 </Button>
//               )}
//             </div>
//           </div>
//           {renderStepContent()}
//         </form>
//       </Form>
//     </div>
//   );
// }
import React from 'react'

const Page = () => {
  return (
    <div>
      
    </div>
  )
}

export default Page
