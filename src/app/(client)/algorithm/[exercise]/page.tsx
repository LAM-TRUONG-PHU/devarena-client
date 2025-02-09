"use client";
import ChangeLanguage from "@/components/change-language";
import { LoadingSpinner } from "@/components/loading";
import { TabsExercise } from "@/components/tab/tabs-exercise";
import ThemeSwitch from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAlgoExercise, setAllTestCasesResultRunning, setCodeAlgo, setCompile, setEachTestCaseResultRunning, setLanguage, setLoadingSubList, setLoadingTestCase, setSubList, setSubmission, setSubmissionId, setTestCases, setTestCasesResult, updateOutputCompiling, updateOutputTestCaseResultSubmit, updateStatusTestCase, updateStatusTestCaseResult } from "@/redux/slices/admin/exerciseStudySlice";
import useSocket from "@/socket/useSocket";
import { StatusCompile } from "@/types/Exercise";
import { ICompileRes } from "@/types/ICompileRes";
import { getLanguageValue } from "@/utils/get-language-value";
import Editor, { Monaco } from "@monaco-editor/react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa6";
import { TbCloudShare } from "react-icons/tb";

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
    codeAlgo,
    resultSubmit,
    submission,
    testCasesResult,
    language,
  } = useAppSelector((state) => state.exercises);
  // const [language, setLanguage] = useState<ELanguages>(ELanguages.Java);
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
    const key = algoExercise.title || "";
    const algoCode = codeAlgo[key] || []; // Ensure it's an array

    // console.log("codeAlgo", algoCode.length > 0
    //   ? algoCode.some(item => item.language === getLanguageValue(language))
    //   : "no code"
    // );

    // console.log("codeAlgo", algoCode);
    console.log("title", algoCode)
    if (!algoCode || algoCode.length === 0) {
      dispatch(setCodeAlgo({
        key: algoExercise.title!, code: algoExercise.defaultCode?.find
          (item => item.language === getLanguageValue(language))?.code, language: getLanguageValue(language)
      }));
    } else
      if (algoCode.length > 0 && !algoCode.some(item => item.language === getLanguageValue(language))) {
        dispatch(setCodeAlgo({
          key: algoExercise.title!, code: algoExercise.defaultCode?.find
            (item => item.language === getLanguageValue(language))?.code, language: getLanguageValue(language)
        }));
      }

    // console.log("code", algoExercise.defaultCode?.find
    //   (item => item.language === getLanguageValue(language))?.code);
  }, [
    algoExercise.title,
    algoExercise.defaultCode,
    language,
    dispatch,
  ]);

  // useEffect(() => {
  //   // dispatch(setCode({
  //   //   key: algoExercise.title!, code: algoExercise.defaultCode?.find
  //   //     (item => item.language === getLanguageValue(language))?.code
  //   // }));
  //   dispatch(setCodeAlgo({
  //     key: algoExercise.title!, code: algoExercise.defaultCode?.find
  //       (item => item.language === getLanguageValue(language))?.code, language: getLanguageValue(language)
  //   }));
  // }, [language]);

  useEffect(() => {
    const key = algoExercise.title || "";

    // if (codeAlgo[key] && Array.isArray(codeAlgo[key]) && codeAlgo[key].length > 0) {
    //   console.log(
    //     "codeAlgo",
    //     codeAlgo[key].find(item => item.language === getLanguageValue(language))?.code
    //   );
    //   console.log("title ", codeAlgo[key]);
    // }
  }, [codeAlgo, language, algoExercise.title]);


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
            testCases: algoExercise.testcases.filter((testcase) => testcase.hidden === false).map((testcase, index) => ({
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
        if (res.data?.data?.submission) {
          dispatch(setSubList(res.data.data.submission));
        }
      })

  }, [loadingSubList, loading, compile]); // Adjusted dependencies


  useEffect(() => {
    const testCases = testCasesResult[algoExercise.title!];
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

      // if (
      //   language === ELanguages.Java &&
      //   !codeAlgo[`${algoExercise.title!}`].includes("public class") ||
      //   language === ELanguages.Java &&
      //   !codeAlgo[`${algoExercise.title!}`].includes("public static void main")
      // ) {
      //   throw new Error("Code needs to have a public class and main function");
      // }


      // Find the correct code for the current language
      const currentCodeEntry = codeAlgo[algoExercise.title!]?.find(
        (entry) => entry.language === getLanguageValue(language)
      );

      if (!currentCodeEntry) {
        throw new Error("No code found for the selected language");
      }
      const convertedTestCases = Object.values(testCases[algoExercise.title!])
        .flat()
        .map((testCase) =>
          testCase.input
            .map((item) => Object.values(item).map(String))
            .flat()
        );

      console.log("currentCodeEntry", currentCodeEntry);

      await compileCode(
        currentCodeEntry.code,
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

  // console.log("codeAlgo", codeAlgo[`${algoExercise.title}`].code);

  const handleSubmit = async () => {
    const currentCodeEntry = codeAlgo[algoExercise.title!]?.find(
      (entry) => entry.language === getLanguageValue(language)
    );

    if (!currentCodeEntry) {
      throw new Error("No code found for the selected language");
    }
    dispatch(setSubmission({}));

    await submitCode(
      currentCodeEntry.code,
      searchParams.get("id")! || "",
      session?.user.id || "",
      language.toLowerCase(),

    );
  };


  return (
    <Suspense fallback={<div>loading</div>}>
      <div className="grid h-full grid-cols-5">
        <div className="col-span-3 relative h-full">
          <div className="h-12 bg-[#EBEBF3] flex items-center px-8 relative">
            <div className="absolute">
              <ThemeSwitch toggleTheme={toggleTheme} />
            </div>
            <div className="flex justify-center w-full items-center gap-4">
              <div>Language</div>

              <ChangeLanguage setLanguage={
                (value) => {
                  dispatch(setLanguage(value))
                }
              } />
            </div>

          </div>
          <Editor
            height={"calc(100svh - 7rem)"}
            defaultLanguage={getLanguageValue(language)}
            // value={codeAlgo[`${algoExercise.title}`].code ?? ""}
            value={codeAlgo[`${algoExercise.title}`] != undefined ? codeAlgo[`${algoExercise.title}`].find(item => item.language === getLanguageValue(language))?.code : ""}
            theme={theme}
            onChange={(value) =>
              dispatch(setCodeAlgo({ key: algoExercise.title!, code: value, language: getLanguageValue(language) }))
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
    </Suspense>
  );
}
