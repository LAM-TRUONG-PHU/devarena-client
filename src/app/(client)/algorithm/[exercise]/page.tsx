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
import { usePathname } from "next/navigation";
import ChangeLanguage from "@/components/change-language";
import { set } from "react-hook-form";
import { getLanguageTitle } from "@/utils/get-language-title";
import { ELanguages } from "@/types/language";
import { getLanguageValue } from "@/utils/get-language-value";
import { TabsExercise } from "@/components/tab/tabs-exercise";
import { useAppSelector } from "@/redux/hooks";

const defaultValue = {
  "C++": `#include <iostream> \nusing namespace std; \nint main() { \n    cout << "Hello, World!"; \n    return 0; \n}`,
  Java: `public class Main { \n    public static void main(String[] args) { \n        System.out.println("Hello, World!"); \n    } \n}`,
  C: `#include <stdio.h> \nint main() { \n    printf("Hello, World!"); \n    return 0; \n}`,
};

export default function ExercisePage() {
  const [theme, setTheme] = useState<"vs-dark" | "vs-light">("vs-dark");

  const [language, setLanguage] = useState<ELanguages>(ELanguages.C);
  const [code, setCode] = useState(defaultValue[ELanguages.C]);
  const {exerciseSelected,testCases}=useAppSelector((state)=>state.exerciseStatus)
  const handleRunCode=async()=>{
    console.log(language);
    console.log(code)
    console.log(exerciseSelected)
    console.log(testCases)
  }
  useEffect(() => {
    setCode(defaultValue[language as keyof typeof defaultValue]);
  }, [language]);

  const handleEditorChange = (value: string | undefined) => {
    // Update code state when the user edits the code in the editor
    setCode(value || "");
  };

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

  useEffect(() => {
    console.log("code", code);
  }, [code]);

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
            defaultLanguage={getLanguageValue(language)}
            value={code}
            theme={theme}
            onMount={handleEditorDidMount}
          />
          <div className="absolute bottom-8 right-8">
            <div className="flex gap-4">
              <Button
                variant={theme == "vs-dark" ? "run-dark" : "run-light"}
                size="editor"
                onClick={handleRunCode}
              >
                <FaPlay />
                Run
              </Button>
              <Button variant="submit" size="editor">
                <TbCloudShare />
                Submit
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
