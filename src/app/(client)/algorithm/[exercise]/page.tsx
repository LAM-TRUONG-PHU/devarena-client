"use client";
import React, { useEffect, useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import ThemeSwitch from "@/components/theme-switch";
import { VscDebugRestart } from "react-icons/vsc";
import { SlOptionsVertical } from "react-icons/sl";
import { MdFormatAlignLeft } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { TbCloudShare } from "react-icons/tb";
import { FaPlay } from "react-icons/fa6";
import { usePathname, useSearchParams } from "next/navigation";
import ChangeLanguage from "@/components/change-language";
import { set } from "react-hook-form";
import { getLanguageTitle } from "@/utils/get-language-title";
import { ELanguages } from "@/types/language";
import { getLanguageValue } from "@/utils/get-language-value";
import { TabsExercise } from "@/components/tab/tabs-exercise";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCode, setSubmission, setSubmissionId, setCompile, setLoadingSubList, setLoadingTestCase, fetchAlgoExercise, setSubList, setTestCases, setTestCasesResult, updateOutputTestCaseResultSubmit, updateOutputCompiling, updateStatusTestCase, updateStatusTestCaseResult, setEachTestCaseResultRunning, setAllTestCasesResultRunning } from "@/redux/slices/admin/exerciseStudySlice";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { StatusCompile } from "@/types/Exercise";
import useSocket from "@/socket/useSocket";
import { useSession } from "next-auth/react";
import { ICompileRes } from "@/types/ICompileRes";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/loading";

const defaultValue = {
  "C++": `#include <iostream> \nusing namespace std; \nint main() { \n    cout << "Hello, World!"; \n    return 0; \n}`,
  Java: `public class Main { \n    public static void main(String[] args) { \n        System.out.println("Hello, World!"); \n    } \n}`,
  C: `#include <stdio.h> \nint main() { \n    printf("Hello, World!"); \n    return 0; \n}`,
};

export default function ExercisePage() {
  const [theme, setTheme] = useState<"vs-dark" | "vs-light">("vs-dark");
  const {
    algoExercise,
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
  const [language, setLanguage] = useState<ELanguages>(ELanguages.C);
  const axiosPrivate = usePrivate();
  const searchParams = useSearchParams();

  // const [code, setCode] = useState(defaultValue[ELanguages.C]);
  // const {exerciseSelected,testCases}=useAppSelector((state)=>state.exerciseStatus)

  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { data: session } = useSession();

  const { connected, compileCode, submitCode, stopExecution, isConnected } =
    useSocket({
      uniqueId: session?.user.id || "",
      exerciseId: algoExercise._id || "",
      onOutput: (output: ICompileRes) => {
        dispatch(
          updateStatusTestCase({
            key: algoExercise.title!,
            index: output.testCaseIndex,
            res: output,
          })
        );
        // dispatch(updateStatusTestCaseResult({ key: algoExercise.title, testCaseId: output.testCaseIndex.toString(), status: StatusCompile.COMPILE_SUCCESS }));
      },
      onOutputCompile(data: any) {
        dispatch(updateOutputCompiling({
          index: data.testCaseIndex,
          output: data.chunk,
          key: algoExercise.title!,

        }))
      },
      onCompleted() {
        testCasesResult[algoExercise.title!].forEach((testCase) => {
          if (testCase.statusCompile === StatusCompile.COMPILE_SUCCESS) {
            dispatch(updateStatusTestCaseResult({ key: algoExercise.title!, testCaseId: testCase._id, status: StatusCompile.COMPILE_SUCCESS }));
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
        console.log("testcases reconnect", testCases[algoExercise.title!]);
        if (testCases[algoExercise.title!]) {
          // dispatch(setAllTestCasesResultRunning(algoExercise.title!));
          dispatch(setTestCasesResult({
            key: algoExercise.title!,
            testCases: testCases[algoExercise.title!].map((testCase, index) => {
              const found = data.find((item) => item.testcaseIndex == index);
              console.log('found', found);
              if (found) {
                if (found.hasOwnProperty('isCorrect')) {
                  console.log('found property', found);
                  dispatch(updateStatusTestCaseResult({ key: algoExercise.title!, testCaseId: testCase._id, status: found.isCorrect ? StatusCompile.COMPILE_SUCCESS : StatusCompile.COMPILE_FAILED }));
                  return {
                    ...testCase,
                    output: found.value,
                    statusCompile: found.isCorrect ? StatusCompile.COMPILE_SUCCESS : StatusCompile.COMPILE_FAILED,
                    outputExpected: found.outputExpected
                  }
                } else {
                  console.log("loading test case", algoExercise.title, index);
                  dispatch(setEachTestCaseResultRunning({
                    key: algoExercise.title!,
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
    dispatch(setCompile(null));
    dispatch(setLoadingTestCase(false));
    dispatch(setLoadingSubList(false));
    // dispatch(setRunningTestCase(""));
    dispatch(setSubmissionId(""));
    dispatch(setSubmission({}));
    dispatch(
      fetchAlgoExercise({
        axiosInstance: axiosPrivate,
        id: searchParams.get("id")!,
      })
    );
  }, []);
  useEffect(() => {
    if (!code[`${algoExercise.title}`]) {
      dispatch(setCode({
        key: algoExercise.title!, code: algoExercise.defaultCode?.find
          (item => item.language === getLanguageValue(language))?.code
      }));
    }
    console.log("code", algoExercise.defaultCode?.find
      (item => item.language === getLanguageValue(language))?.code);
  }, [
    algoExercise.title,
    algoExercise.defaultCode,
    code[`${algoExercise.title}`],
    dispatch,
  ]);

  useEffect(() => {
    dispatch(setCode({
      key: algoExercise.title!, code: algoExercise.defaultCode?.find
        (item => item.language === getLanguageValue(language))?.code
    }));
  }, [language]);

  useEffect(() => {
    // Only run if testCases is empty and we have either persistTestCases or exercise.testcases
    if (!testCases[algoExercise.title!] || testCases[algoExercise.title!].length === 0) {
      if (persistTestCases[algoExercise.title!] != undefined && persistTestCases[algoExercise.title!].length > 0) {
        dispatch(
          setTestCases({
            key: algoExercise.title!,
            testCases: persistTestCases[algoExercise.title!],
          })
        );
      } else if (algoExercise.testcases) {
        dispatch(
          setTestCases({
            key: algoExercise.title!,
            testCases: algoExercise.testcases.map((testcase, index) => ({
              _id: crypto.randomUUID(),
              input: testcase.input,
            })),
          })
        );
      }
    }
  }, [algoExercise.testcases, algoExercise.title, dispatch, persistTestCases]);

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
    const testCases = testCasesResult[algoExercise.title!];
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
  }, [testCasesResult, algoExercise.title]);
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
  const toggleTheme = () => {
    // Toggling the theme between vs-dark and vs-light
    setTheme((prev) => {
      const newTheme = prev === "vs-dark" ? "vs-light" : "vs-dark";
      console.log("Toggling theme:", newTheme); // Log immediately after toggling
      return newTheme;
    });
  };


  const handleRun = async () => {
    try {
      dispatch(
        setTestCasesResult({
          key: algoExercise.title!,
          testCases: testCases[algoExercise.title!],
        })
      );

      dispatch(setAllTestCasesResultRunning(algoExercise.title!)); // Only set running here, not in useEffect
      dispatch(setCompile("Test Result"));
      dispatch(setLoadingTestCase(true)); // Start loading

      if (
        !code[`${algoExercise.title!}`].includes("public class") ||
        !code[`${algoExercise.title!}`].includes("public static void main")
      ) {
        throw new Error("Code needs to have a public class and main function");
      }

      const convertedTestCases = Object.values(testCases[algoExercise.title!])
        .flat()
        .map((testCase) =>
          testCase.input
            .map((item) => Object.values(item).map(String))
            .flat()
        );

      // console.log("convertedTestCases", convertedTestCases);


      await compileCode(
        code[`${algoExercise.title!}`],
        convertedTestCases,
        searchParams.get("id")! || "",
        getLanguageValue(language),
        session?.user.id || "",
        true

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
      code[`${algoExercise.title}`],
      searchParams.get("id")! || "",
      session?.user.id || "",
      language.toLowerCase(),

    );
  };


  return (
    <>
      <div className="grid h-full grid-cols-3">
        <div className="col-span-2 relative h-full">
          <div className="h-12 bg-[#EBEBF3] flex items-center px-8 relative">
            <div className="absolute">
              <ThemeSwitch toggleTheme={toggleTheme} />
            </div>
            <div className="flex justify-center w-full items-center gap-4">
              <div>Language</div>

              <ChangeLanguage setLanguage={setLanguage} />
            </div>

          </div>
          <Editor
            height={"calc(100svh - 7rem)"}
            defaultLanguage={getLanguageValue(language)}
            value={code[`${algoExercise.title}`] ?? ""}
            theme={theme}
            onChange={(value) =>
              dispatch(setCode({ key: algoExercise.title!, code: value }))
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
        <div className="col-span-1">
          <TabsExercise />
        </div>
      </div>
    </>
  );
}
