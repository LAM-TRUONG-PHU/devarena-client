"use client";
import { LoadingSpinner } from "@/components/loading";
import { EStatus } from "@/components/sort";
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
  setLoadingSubList,
  setLoadingTestCase,
  setRunningTestCase,
  setSubList,
  setSubmission,
  setSubmissionId,
  setTestCases,
  setTestCasesResult,
  updateOutputCompiling,
  updateOutputTestCaseResultSubmit,
  updateStatusTestCase,
  updateStatusTestCaseResult,
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
import { MdFormatAlignLeft } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { TbCloudShare } from "react-icons/tb";
import { VscDebugRestart } from "react-icons/vsc";

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
  } = useAppSelector((state) => state.exercises);
  const language = capitalize(segments[1]);

  const { data: session } = useSession();
  const { toast } = useToast();
  const { connected, compileCode, submitCode, stopExecution, isConnected } =
    useSocket({
      uniqueId: session?.user.id || "",
      exerciseId: exercise._id||"",
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
      onOutputCompile(data:any) {
          dispatch(updateOutputCompiling({
            index:data.testCaseIndex,
            output:data.chunk,
            key: exercise.title,

          }))
      },
      onCompleted() {
        dispatch(
          setTestCasesResult({
            key: exercise.title,
            testCases: testCases[exercise.title],
          })
        );
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
    });

  useEffect(() => {
    // Only run if testCases is empty and we have either persistTestCases or exercise.testcases
    if (!testCases[exercise.title] || testCases[exercise.title].length === 0) {
      if (persistTestCases[exercise.title]) {
        dispatch(
          setTestCases({
            key: exercise.title,
            testCases: persistTestCases[exercise.title],
          })
        );
      } else if (exercise.testcases) {
        dispatch(
          setTestCases({
            key: exercise.title,
            testCases: exercise.testcases.map((testcase, index) => ({
              _id: (index + 1).toString(),
              input: testcase.input,
            })),
          })
        );
      }
    }
  }, [exercise.testcases, exercise.title, dispatch, persistTestCases]);

  useEffect(() => {
    dispatch(setCompile(null));
    dispatch(setLoadingTestCase(false));
    dispatch(setLoadingSubList(false));
    dispatch(setRunningTestCase(""));
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
  const handleRun = async () => {
    try {
      dispatch(setAllTestCasesResultRunning(exercise.title));
      dispatch(setCompile(null));
      dispatch(setLoadingTestCase(true));
      dispatch(setRunningTestCase(searchParams.get("id")! || ""));

      if (
        !code[`${exercise.title}`].includes("public class") ||
        !code[`${exercise.title}`].includes("public static void main")
      ) {
        throw new Error("Code need to have public class and main function");
      }

      // Flatten the grouped te st cases into a single array of inputs
      const convertedTestCases = Object.values(testCases[exercise.title])
        .flat() // Flatten all groups into a single array
        .map((testCase) =>
          testCase.input
            .map(
              (item) => Object.values(item).map(String) // Convert all input values to strings
            )
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
      dispatch(setLoadingTestCase(false));
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
      <div className="grid h-full grid-cols-3">
        <div className="col-span-2 relative h-full">
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
            <div className="absolute right-8">
              <div className="flex gap-6">
                <MdFormatAlignLeft
                  size={20}
                  className="hover:text-pink_primary  transition-all cursor-pointer"
                />
                <VscDebugRestart
                  size={20}
                  className="hover:text-pink_primary  transition-all cursor-pointer"
                />
                <SlOptionsVertical
                  size={20}
                  className="hover:text-pink_primary  transition-all cursor-pointer"
                />
              </div>
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
        <div className="col-span-1 overflow-auto h-[calc(100vh-4rem)]">
          <TabsExercise study />
        </div>
      </div>
    </>
  );
}
