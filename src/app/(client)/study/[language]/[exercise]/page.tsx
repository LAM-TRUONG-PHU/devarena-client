"use client";
import { LoadingSpinner } from "@/components/loading";
import { TabsExercise } from "@/components/tab/tabs-exercise";
import ThemeSwitch from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchExercise,
    setAllTestCasesResultRunning,
    setCode,
    setCompile,
    setEachTestCaseResultRunning,
    setLoadingSubList,
    setLoadingTestCase,
    setSubList,
    setSubmission,
    setSubmissionId,
    setTestCases,
    setTestCasesResult,
    updateOutputCompiling,
    updateOutputTestCaseResultSubmit,
    updateStatusTestCase,
    updateStatusTestCaseResult
} from "@/redux/slices/admin/exerciseStudySlice";
import { useSocket } from "@/socket/useSocket";
import { StatusCompile } from "@/types/Exercise";
import { ICompileRes } from "@/types/ICompileRes";
import { capitalize } from "@/utils/capitalize";
import Editor, { Monaco } from "@monaco-editor/react";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa6";
import { TbCloudShare } from "react-icons/tb";

export default function ExercisePage() {
    const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const dispatch = useAppDispatch();
    const axiosPrivate = usePrivate();
    const searchParams = useSearchParams();

    const {
        exercise,
        testCases,
        loading,
        loadingTestCase,
        persistTestCases,
        loadingSubList,
        compile,
        code,
        resultSubmit,
        submission,
        testCasesResult
    } = useAppSelector((state) => state.exercises);
    const language = capitalize(segments[1]);

    const { data: session } = useSession();
    const { toast } = useToast();
    const { connected, compileCode, submitCode, stopExecution, isConnected } =
        useSocket({
            uniqueId: session?.user.id || "",
            exerciseId: exercise._id || "",
            onOutput: (output: ICompileRes) => {
                dispatch(
                    updateStatusTestCase({
                        key: exercise.title,
                        index: output.testCaseIndex,
                        res: output,
                    })
                );
                // dispatch(updateStatusTestCaseResult({ key: exercise.title, testCaseId: output.testCaseIndex.toString(), status: StatusCompile.COMPILE_SUCCESS }));
            },
            onOutputCompile(data: any) {
                dispatch(updateOutputCompiling({
                    index: data.testCaseIndex,
                    output: data.chunk,
                    key: exercise.title,

                }))
            },
            onCompleted() {
                testCasesResult[exercise.title].forEach((testCase) => {
                    if (testCase.statusCompile === StatusCompile.COMPILE_SUCCESS) {
                        dispatch(updateStatusTestCaseResult({ key: exercise.title, testCaseId: testCase._id, status: StatusCompile.COMPILE_SUCCESS }));
                    }
                });
                toast({
                    title: "Result",
                    description: "Completed",
                    variant: "success",
                });
            },
            onCompiling: () => {

                toast({
                    title: "Biên dịch",
                    description: "Đang biên dịch...",
                    variant: "default",
                });
            },
            onError: (error) => {
                toast({
                    title: "Lỗi",
                    description: error,
                    variant: "error",
                });
            },
            onWaitingInput: (message) => {
                console.log(message);
            },
            onOutputSubmit: (output: ICompileRes) => {
                dispatch(updateOutputTestCaseResultSubmit(resultSubmit));
            },
            onReconnect: (data: TestcaseRestore[]) => {
                console.log("testcases reconnect", testCases[exercise.title]);
                if (testCases[exercise.title]) {
                    // dispatch(setAllTestCasesResultRunning(exercise.title));
                    dispatch(setTestCasesResult({
                        key: exercise.title,
                        testCases: testCases[exercise.title].map((testCase, index) => {
                            const found = data.find((item) => item.testcaseIndex == index);
                            // console.log('found', found);
                            if (found) {
                                if (found.hasOwnProperty('isCorrect')) {
                                    console.log('found property', found);
                                    dispatch(updateStatusTestCaseResult({ key: exercise.title, testCaseId: testCase._id, status: found.isCorrect ? StatusCompile.COMPILE_SUCCESS : StatusCompile.COMPILE_FAILED }));
                                    return {
                                        ...testCase,
                                        output: found.value,
                                        statusCompile: found.isCorrect ? StatusCompile.COMPILE_SUCCESS : StatusCompile.COMPILE_FAILED,
                                        outputExpected: found.outputExpected
                                    }
                                } else {
                                    console.log("loading test case", exercise.title, index);
                                    dispatch(setEachTestCaseResultRunning({
                                        key: exercise.title,
                                        index: index
                                    }))
                                    return {
                                        ...testCase,
                                        output: found.value,
                                        statusCompile: StatusCompile.COMPILE_RUNNING
                                    }
                                }


                            } else {
                                return {
                                    ...testCase,
                                    statusCompile: StatusCompile.COMPILE_RUNNING
                                }
                            }



                            return testCase;
                        })
                    }));


                }

            }

        });


    useEffect(() => {
        // Only run if testCases is empty and we have either persistTestCases or exercise.testcases
        if (!testCases[exercise.title] || testCases[exercise.title].length === 0) {
            if (persistTestCases[exercise.title] != undefined && persistTestCases[exercise.title].length > 0) {
                dispatch(
                    setTestCases({
                        key: exercise.title,
                        testCases: persistTestCases[exercise.title],
                    })
                );
            } else if (exercise.testcases) {
                console.log("exercise.testcases", exercise.testcases);
                dispatch(
                    setTestCases({
                        key: exercise.title,
                        testCases: exercise.testcases.filter((testcase) => testcase.hidden === false).map((testcase, index) => {
                            return {
                                _id: crypto.randomUUID(),
                                input: testcase.input,
                            }
                        }

                        ),
                    })
                );
            }
        }
    }, [exercise.testcases, exercise.title, dispatch, persistTestCases]);

    useEffect(() => {
        dispatch(setCompile(null));
        dispatch(setLoadingTestCase(false));
        dispatch(setLoadingSubList(false));
        // dispatch(setRunningTestCase(""));
        dispatch(setSubmissionId(""));
        dispatch(setSubmission({}));
        dispatch(
            fetchExercise({
                axiosInstance: axiosPrivate,
                id: searchParams.get("id")!,
            })
        );
    }, []);

    useEffect(() => {
        axiosPrivate
            .get(`/exercise-status/exercise/${searchParams.get("id")!}/submission`)
            .then((res) => {
                dispatch(setSubList(res.data.data.submission));
            })
            .catch((err) => {
                console.error(err);
            });
    }, [loadingSubList == true, loading == true, compile == "Accepted"]);

    useEffect(() => {
        if (!code[`${exercise.title}`]) {
            dispatch(setCode({ key: exercise.title, code: exercise.defaultCode }));
        }
    }, [
        exercise.title,
        exercise.defaultCode,
        code[`${exercise.title}`],
        dispatch,
    ]);

    function handleEditorDidMount(editor: any, monaco: Monaco) {
        // Define a custom theme with background color #1D2432
        monaco.editor.defineTheme("customTheme", {
            base: "vs-dark", // Base theme to extend
            inherit: true, // Inherit other settings from the base theme
            rules: [], // Define custom token colors (if needed)
            colors: {
                "editor.background": "#1D2432", // Set custom background color
            },
        });

        // Apply the custom theme
        monaco.editor.setTheme("customTheme");
    }

    useEffect(() => {
        const testCases = testCasesResult[exercise.title];
        console.log("testCases Result", testCases);
        // Check if all test cases have finished running
        if (
            testCases &&
            testCases.length > 0 &&
            testCases.every(
                (testCase) =>
                    testCase.statusCompile === StatusCompile.COMPILE_SUCCESS ||
                    testCase.statusCompile === StatusCompile.COMPILE_FAILED
            )
        ) {
            dispatch(setLoadingTestCase(false)); // Stop loading when all test cases finish
        }
    }, [testCasesResult, exercise.title]); // Runs when testCasesResult updates

    const handleRun = async () => {
        try {
            dispatch(
                setTestCasesResult({
                    key: exercise.title,
                    testCases: testCases[exercise.title],
                })
            );

            dispatch(setAllTestCasesResultRunning(exercise.title)); // Only set running here, not in useEffect
            dispatch(setCompile("Test Result"));
            dispatch(setLoadingTestCase(true)); // Start loading

            if (
                language.toLowerCase() === "java" &&
                !code[`${exercise.title}`].includes("public class") ||
                language.toLowerCase() === "java" &&
                !code[`${exercise.title}`].includes("public static void main")
            ) {
                throw new Error("Code needs to have a public class and main function");
            }


            const convertedTestCases = Object.values(testCases[exercise.title])
                .flat()
                .map((testCase) =>
                    testCase.input
                        .map((item) => Object.values(item).map(String))
                        .flat()
                );


            await compileCode(
                code[`${exercise.title}`],
                convertedTestCases,
                searchParams.get("id")! || "",
                language.toLowerCase(),
                session?.user.id || ""
            );
        } catch (error: any) {
            toast({
                title: "Lỗi",
                description: error.message || "Đã có lỗi xảy ra",
                variant: "error",
            });
            dispatch(setLoadingTestCase(false)); // Stop loading on error
        }
    };

    const handleSubmit = async () => {
        dispatch(setSubmission({}));

        await submitCode(
            code[`${exercise.title}`],
            searchParams.get("id")! || "",
            session?.user.id || "",
            language.toLowerCase()
        );
    };
    const toggleTheme = () => {
        setTheme((prev) => {
            const newTheme = prev === "vs-dark" ? "light" : "vs-dark";
            return newTheme;
        });
    };

    return (
        <>
            <div className="grid h-full grid-cols-5">
                <div className="col-span-3 relative h-full">
                    <div className="h-12 bg-[#EBEBF3] flex items-center px-8 relative">
                        <div className="absolute">
                            <ThemeSwitch toggleTheme={toggleTheme} />
                        </div>
                        <div className="flex justify-center w-full items-center gap-4">
                            <div>Language</div>

                            <Button variant="outline" size="icon">
                                {capitalize(segments[1])}
                            </Button>
                        </div>

                    </div>
                    <Editor
                        height={"calc(100svh - 7rem)"}
                        defaultLanguage={segments[1]}
                        theme={theme}
                        value={code[`${exercise.title}`] ?? ""}
                        onChange={(value) =>
                            dispatch(setCode({ key: exercise.title, code: value }))
                        }
                        onMount={handleEditorDidMount}
                    />
                    <div className="absolute bottom-8 right-8">
                        <div className="flex gap-4">
                            <Button
                                variant={theme == "vs-dark" ? "run-dark" : "run-light"}
                                size="editor"
                                onClick={handleRun}
                                disabled={loadingTestCase}
                            >
                                {loadingTestCase ? (
                                    <LoadingSpinner />
                                ) : (
                                    <>
                                        <FaPlay />
                                        Run
                                    </>
                                )}
                            </Button>
                            <Button variant="submit" size="editor" onClick={handleSubmit}>
                                {loadingSubList ? (
                                    <LoadingSpinner />
                                ) : (
                                    <>
                                        <TbCloudShare />
                                        Submit
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <TabsExercise />
                </div>
            </div>
        </>
    );
}