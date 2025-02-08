import { Editor, Monaco } from '@monaco-editor/react'
import { UseFormReturn } from 'react-hook-form';
import React, { useEffect, useState } from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useAppSelector } from '@/redux/hooks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TExerciseAlgo } from '@/app/admin/algorithm/[exercise]/page';
import { Trash } from 'lucide-react';
import { IDefaultSolutionCode } from '@/types/Exercise';
import { setSolutionCodeEntries } from '@/redux/slices/admin/exerciseStudySlice';
import { useDispatch } from 'react-redux';

type defaultCodeFormProps = {
    form: UseFormReturn<
        TExerciseAlgo,
        any,
        undefined
    >;
}

type CodeEntry = {
    code: string;
    language: string;
}

const SUPPORTED_LANGUAGES = [
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
];

const DEFAULT_CODE_TEMPLATES = {
    java: `import java.util.*;
    import java.lang.*;
    
    public class Solution {
        public static int solution(int[] nums) {
            // Write your code here
            return 0;
        }
    }`,
    cpp: `#include <iostream>
    #include <vector>
    #include <string>
    #include <algorithm>
    
    using namespace std;
    
    class Solution {
    public:
        int solution(vector<int>& nums) {
            // Write your code here
            return 0;
        }
    };`,
    c: `#include <stdio.h>
    #include <stdlib.h>
    
    int solution(int* nums, int numsSize) {
        // Write your code here
        return 0;
    }`,
};

export default function SolutionCodeForm(props: defaultCodeFormProps) {
    const [selectedLanguage, setSelectedLanguage] = useState('java');
    const { solutionCodeEntries, codeEntries, algoExercise } = useAppSelector((state) => state.exercises);
    const dispatch = useDispatch();
    // const [solutionCodeEntries, setSolutionCodeEntries] = useState<IDefaultSolutionCode[]>([]);

    // useEffect(() => {
    //     if (algoExercise.solutions) {
    //         setSolutionCodeEntries(algoExercise.solutions);
    //     } else {
    //         setSolutionCodeEntries(
    //             codeEntries.map((entry) => ({
    //                 code: codeEntries.find((e) => e.language === entry.language)?.code || "",
    //                 language: entry.language
    //             }))
    //         );
    //     }

    // }, []);



    useEffect(() => {
        console.log('codeEntries from solution', codeEntries);
        console.log('solutionCodeEntries from solution', solutionCodeEntries);

        // Ensure solutionCodeEntries contains all codeEntries while keeping existing solutions
        if (codeEntries.length !== solutionCodeEntries.length) {
            const updatedSolutionEntries = codeEntries.map((entry) => {
                // Check if there's already a solution for this language
                const existingSolution = solutionCodeEntries.find((sol) => sol.language === entry.language);
                return existingSolution || { code: entry.code || "", language: entry.language };
            });

            dispatch(setSolutionCodeEntries(updatedSolutionEntries));
        }
    }, [codeEntries, dispatch]);
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



    const handleCodeChange = (index: number, value: string | undefined) => {
        const updatedEntries = [...solutionCodeEntries]; // Create a new copy of the array
        updatedEntries[index] = { ...updatedEntries[index], code: value || '' }; // Update the specific entry

        dispatch(setSolutionCodeEntries(updatedEntries)); // Dispatch updated state
        props.form.setValue('solutions', updatedEntries); // Update form value
    };

    return (
        <div className="mt-4 space-y-4">
            <div className="flex gap-4 items-end justify-center">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {SUPPORTED_LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {solutionCodeEntries.map((entry, index) => (
                <div key={index} className="border rounded p-2"> {/* Added a container for each editor */}
                    <div className="flex justify-between items-center"> {/* Added a container for label and remove button */}
                        <FormLabel>{entry.language.toUpperCase()} Code</FormLabel>

                    </div>
                    <FormField
                        control={props.form.control}
                        name={`solutions.${index}.code`} // Important: Correct the name
                        render={({ field }) => (
                            <FormItem>
                                <FormControl className='flex'>
                                    <Editor
                                        height="300px"
                                        defaultLanguage={entry.language}
                                        defaultValue={entry.code}
                                        value={entry.code}
                                        onChange={(value) => handleCodeChange(index, value)} // Use the handler
                                        theme="vs-dark"
                                        onMount={handleEditorDidMount}
                                    />
                                </FormControl>
                                <FormMessage className="text-right" />
                            </FormItem>
                        )}
                    />
                </div>
            ))}
        </div>
    )
}