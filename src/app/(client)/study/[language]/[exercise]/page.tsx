"use client";
import React, { use, useDebugValue, useEffect, useRef, useState } from "react";
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
import { TabsExercise } from "@/components/tab/tabs-exercise";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSocket } from "@/socket/useSocket";
import { useSession } from "next-auth/react";
import { StatusCompile } from "@/types/Exercise";
import { fetchExerciseStatus, setLoading, setRunningTestCase, setTestCases, setTestCasesResult, updateStatusTestCase } from "@/redux/slices/admin/exerciseStudySlice";
import { useToast } from "@/hooks/use-toast";
import { ICompileRes } from "@/types/ICompileRes";
import { capitalize } from "@/utils/capitalize";
import { fetchExercise } from "@/redux/slices/admin/exerciseStudySlice";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { LoadingSpinner } from "@/components/loading";
import { EStatus } from "@/components/sort";

const defaultValue = {
  cpp: `#include <iostream> \nusing namespace std; \nint main() { \n    cout << "Hello, World!"; \n    return 0; \n}`,
  python: `print("Hello, World!")`,
  java: `public class Main { \n    public static void main(String[] args) { \n        System.out.println("Hello, World!"); \n    } \n}`,
  javascript: `console.log("Hello, World!");`,
  typescript: `console.log("Hello, World!");`,
  csharp: `using System; \nclass Program { \n    static void Main() { \n        Console.WriteLine("Hello, World!"); \n    } \n}`,
  c: `#include <stdio.h> \nint main() { \n    printf("Hello, World!"); \n    return 0; \n}`,
};

export default function ExercisePage() {
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const [code, setCode] = useState("")
  const dispatch = useAppDispatch();
  const axiosPrivate = usePrivate();
  const searchParams = useSearchParams();

  const { exercise, testCases, loading, exerciseStatus } = useAppSelector(state => state.exercises)

  const { data: session } = useSession()
  const { toast } = useToast()
  const { connected, compileCode, stopExecution, isConnected } = useSocket(
    {
      uniqueId: session?.user.id || "",
      onOutput: (output: ICompileRes) => {
        dispatch(updateStatusTestCase({ key: exercise.title, index: output.testCaseIndex, res: output }))

      },

      onCompleted(result) {
        dispatch(setTestCasesResult({ key: exercise.title, testCases: testCases[exercise.title] }))
        toast({
          title: "Kết quả",
          description: result,
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
        console.log(message)
      }

    }

  );

  useEffect(() => {
    dispatch(fetchExercise(
      {
        axiosInstance: axiosPrivate,
        id: searchParams.get("id")!,
      }
    ))

  }, []);

  console.log("exerciseStatus", exerciseStatus)
  useEffect(() => {
    if (exercise?.defaultCode) {
      setCode(exercise.defaultCode)
    }
  }, [exercise])

  // useEffect(() => {
  //   const testCasesTemp =
  //     exerciseSelected?.exerciseId.testcases!.map((testCase) => ({
  //       ...testCase,
  //       statusCompile: StatusCompile.COMPILE_WAITING,
  //     })) || [];
  //   dispatch(setTestCases(testCasesTemp));
  //   console.log("testcaseTemp", testCasesTemp)
  // }, [exerciseSelected]);

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
      dispatch(setLoading(true))

      if (searchParams.get("status") == EStatus.Unsolved) {
        await axiosPrivate.post("/exercise-status", {
          exerciseId: searchParams.get("id")!,
          userId: session?.user.id,
        })
      }


      dispatch(setRunningTestCase(searchParams.get("id")! || ""));

      if (!code.includes("public class") || !code.includes("public static void main")) {
        throw new Error("Code phải có public class và hàm main");
      }

      // Flatten the grouped test cases into a single array of inputs
      const convertedTestCases = Object.values(testCases[exercise.title])
        .flat() // Flatten all groups into a single array
        .map((testCase) =>
          testCase.input.map((item) =>
            Object.values(item).map(String) // Convert all input values to strings
          ).flat()
        );


      await compileCode(code, convertedTestCases, searchParams.get("id")! || "")
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Đã có lỗi xảy ra",
        variant: "error",
      })
      dispatch(setLoading(false));
    }
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
            value={code}
            onChange={(value) => setCode(value || "")}
            onMount={handleEditorDidMount}
          />
          <div className="absolute bottom-8 right-8">
            <div className="flex gap-4">
              <Button
                variant={theme == "vs-dark" ? "run-dark" : "run-light"}
                size="editor"
                onClick={handleRun}
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : <>
                  <FaPlay />
                  Run</>}

              </Button>
              <Button variant="submit" size="editor">
                <TbCloudShare />
                Submit
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
