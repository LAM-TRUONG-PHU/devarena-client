import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { TExerciseStudy } from "@/app/admin/study/[slug]/[exercise]/page";
import { useAppSelector } from "@/redux/hooks";
import { Textarea } from "@/components/ui/textarea"
import { TExerciseAlgo } from "@/app/admin/algorithm/[exercise]/page";

type TestCaseFormProps = {
    form?: UseFormReturn<
        TExerciseStudy,
        any,
        undefined
    >;

    formAlgo?: UseFormReturn<TExerciseAlgo,
        any,
        undefined
    >;
};

const TestcaseForm = (props: TestCaseFormProps) => {
    const control = (props.form?.control || props.formAlgo?.control) as any
    // const { exercise } = useAppSelector((state) => state.studyForm);
    const { algoExercise } = useAppSelector((state) => state.exercises);

    // Manage testcases dynamically
    const { fields, append, remove } = useFieldArray({
        control,
        name: "testcases", // Name should match the form structure
    });

    const handleAddTestcase = () => {
        append({
            input: Array(algoExercise.variableName!.length).fill(""),
            output: "",
            hidden: false,
        });
    };

    return (
        <div className="flex flex-col space-y-4">
            {fields.map((field, testcaseIndex) => (
                <div
                    key={field.id}
                    className="p-4 border border-gray-300 rounded flex flex-col"
                >
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Testcase {testcaseIndex + 1}</h4>
                        <button
                            type="button"
                            onClick={() => remove(testcaseIndex)}
                            className="text-red-500 hover:underline"
                        >
                            Remove
                        </button>
                    </div>

                    {algoExercise.variableName !== undefined && (
                        <div className="flex flex-col space-y-2">
                            {algoExercise.variableName.map((variable, variableIndex) => (
                                <FormField
                                    key={variableIndex}
                                    control={control}
                                    name={`testcases.${testcaseIndex}.input.${variableIndex}.${variable}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{variable}</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder={`Enter value for ${variable}`}
                                                    value={field.value || algoExercise?.testcases?.[testcaseIndex]?.input[variableIndex][variable] || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-4">
                        <FormField
                            control={control}
                            name={`testcases.${testcaseIndex}.output`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Output</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter output value"
                                            value={field.value || algoExercise?.testcases?.[testcaseIndex]?.output || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="mt-4 flex items-center">
                        <FormField
                            control={control}
                            name={`testcases.${testcaseIndex}.hidden`}
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-4">
                                    <FormLabel>Hidden?</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value || algoExercise?.testcases?.[testcaseIndex]?.hidden || false}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddTestcase}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                + Add Testcase
            </button>
        </div>
    );
};

export default TestcaseForm;