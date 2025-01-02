import { TExerciseStudy } from '@/app/admin/study/[slug]/exercise/page';
import { Editor, Monaco } from '@monaco-editor/react'
import { usePathname } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useAppSelector } from '@/redux/hooks';

type defaultCodeFormProps = {
    form: UseFormReturn<
        TExerciseStudy,
        any,
        undefined
    >;
}

export default function DefaultCodeForm(props: defaultCodeFormProps) {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const { currentExercise } = useAppSelector((state) => state.exercises);
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
            name="defaultCode"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Default Code</FormLabel>
                    <FormControl>
                        <Editor
                            height={"calc(100svh - 7rem)"}
                            defaultLanguage={segments[2].toLowerCase()}
                            defaultValue={
                                currentExercise?.defaultCode ||
                                `// Write your code here\n\n`
                            }
                            value={currentExercise?.defaultCode || field.value}
                            onChange={(value) => field.onChange(value)}
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
