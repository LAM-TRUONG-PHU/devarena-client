import { Editor, Monaco } from '@monaco-editor/react'
import { usePathname } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import React, { useState } from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useAppSelector } from '@/redux/hooks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TExerciseStudy } from '@/app/admin/arena/exercises/form/page';

type solutionCodeFormProps = {
    form: UseFormReturn<
        TExerciseStudy,
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

const solution_CODE_TEMPLATES = {
    java: `public class Solution {
    public static int solution(int[] nums) {
        // Write your code here
        return 0;
    }
}`,
    cpp: `class Solution {
public:
    int solution(vector<int>& nums) {
        // Write your code here
        return 0;
    }
};`,
    c: `int solution(int* nums, int numsSize) {
    // Write your code here
    return 0;
}`
};

export default function SolutionCodeForm(props: solutionCodeFormProps) {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const { exercise } = useAppSelector((state) => state.exercises);
    const [selectedLanguage, setSelectedLanguage] = useState('java');
    const [codeEntries, setCodeEntries] = useState<CodeEntry[]>(props.form.getValues('solutions'));

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

    const addNewLanguage = () => {
        const newEntry = {
            language: selectedLanguage,
            code: solution_CODE_TEMPLATES[selectedLanguage as keyof typeof solution_CODE_TEMPLATES] || ''
        };
        
        const updatedEntries = [...codeEntries, newEntry];
        setCodeEntries(updatedEntries);
        props.form.setValue('solutions', updatedEntries);
        console.log(props.form.getValues('solutions'));

    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4 items-end">
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
                <Button onClick={addNewLanguage} type="button">Add Language</Button>
            </div>

            {codeEntries.map((entry, index) => (
                <FormField
                    key={index}
                    control={props.form.control}
                    name={`solutions.${index}`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{entry.language.toUpperCase()} Code</FormLabel>
                            <FormControl>
                                <Editor
                                    height="300px"
                                    defaultLanguage={entry.language}
                                    defaultValue={entry.code}
                                    value={entry.code}
                                    onChange={(value) => {
                                        const newEntries = [...codeEntries];
                                        newEntries[index].code = value || '';
                                        setCodeEntries(newEntries);
                                        props.form.setValue('solutions', newEntries);
                                    }}
                                    theme="vs-dark"
                                    onMount={handleEditorDidMount}
                                />
                            </FormControl>
                            <FormMessage className="text-right" />
                        </FormItem>
                    )}
                />
            ))}
        </div>
    )
}
