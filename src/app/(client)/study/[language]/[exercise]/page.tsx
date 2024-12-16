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
    const [theme, setTheme] = useState<"vs-dark" | "vs-light">("vs-dark");
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
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

    return (
        <>
            <div className="flex h-full">
                <div className="w-2/3 relative h-full">
                    <div className="h-12 bg-[#EBEBF3] flex items-center px-8 relative">
                        <div className="absolute">
                            <ThemeSwitch toggleTheme={toggleTheme} />
                        </div>
                        <div className="flex justify-center w-full items-center gap-4">
                            <div>Language</div>

                            {segments[0] == "study" ? (
                                <>
                                    <Button variant="outline" size="icon">
                                        {segments[1].charAt(0).toUpperCase() + segments[1].slice(1)}
                                    </Button>
                                </>
                            ) : (
                                <ChangeLanguage language={segments[1]} />
                            )}
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
                        defaultValue={defaultValue[segments[1] as keyof typeof defaultValue]}
                        theme={theme}
                        onMount={handleEditorDidMount}
                    />
                    <div className="absolute bottom-8 right-8">
                        <div className="flex gap-4">
                            <Button variant={theme == "vs-dark" ? "run-dark" : "run-light"} size="editor">
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
                <div className="bg-black w-1/3 max-h-screen"></div>
            </div>
        </>
    );
}
