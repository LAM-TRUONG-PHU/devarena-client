import { Editor, Monaco } from '@monaco-editor/react'
import { usePathname } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { TExerciseStudy } from '@/types/Exercise';
import { setSolutionCode } from '@/redux/slices/admin/exerciseStudySlice';

type defaultSolutionFormProps = {
    form: UseFormReturn<
        TExerciseStudy,
        any,
        undefined
    >;
}

export default function SolutionCodeForm(props: defaultSolutionFormProps) {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const { exercise } = useAppSelector((state) => state.exercises);
    const dispatch = useAppDispatch();
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
    return (
        <FormField
            control={props.form.control}
            name="solution"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Solution Code</FormLabel>
                    <FormControl>
                        <Editor
                            height={"calc(100svh - 7rem)"}
                            defaultLanguage={segments[2].toLowerCase()}
                            defaultValue={
                                exercise.solution ||
                                `// Write your code here\n\n`
                            }
                            value={exercise.solution || field.value}
                            onChange={(value) => {
                                field.onChange(value);
                                dispatch(setSolutionCode(value));
                            }}
                            theme="vs-dark"
                            onMount={handleEditorDidMount}
                        />
                    </FormControl>
                    <FormMessage className="text-right" />
                </FormItem>
            )}
        />


    )
}
