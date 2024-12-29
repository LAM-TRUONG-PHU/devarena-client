"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { FloatingLabelInput } from "../../ui/floating-label-input";
import CustomEditor from "../../CustomEditor/CustomEditor";
import { mainInstance } from "@/axios/MainInstance";
import useAxios from "@/hooks/useAxios";
import TestcaseForm from "./VariableNameForm";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    setCurrentStep,
    setDifficulty,
    setTags,
    setTitle,
    setContent,
} from "@/redux/slices/admin/StudyFormSlice";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { formSchema } from "@/app/admin/study/create-exercise/page";

const difficultyOptions = [
    { value: "Easy", label: "Easy" },
    { value: "Medium", label: "Medium" },
    { value: "Hard", label: "Hard" },
];

const tagOptions = [
    { value: "Array", label: "Array" },
    { value: "Function", label: "Function" },
    { value: "Loop", label: "Loop" },
    { value: "String", label: "String" },
    { value: "Recursion", label: "Recursion" },
    { value: "Algorithm", label: "Algorithm" },
];

type CodingExerciseFormProps = {
    form: UseFormReturn<
        {
            title: string;
            // content: string;
            difficulty: string;
            tags: string[];
        },
        any,
        undefined
    >;
};
export function CodingExerciseForm(props: CodingExerciseFormProps) {
    const dispatch = useAppDispatch();
    const { currentStep, totalStep, exercise } = useAppSelector((state) => state.studyForm);

    const axiosInstance = useAxios();
    // const [difficulty, setDifficulty] = useState("");
    // const [tags, setTags] = useState<string[]>([]);
    // const [title, setTitle] = useState("");
    // const [content, setContent] = useState("");
    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     // Here you would typically send the form data to your backend
    //     console.log(exercise);

    //     const reponse = await axiosInstance
    //         .post("/exercise", {
    //             language: language,
    //             difficulty: exercise.difficulty,
    //             title: exercise.title,
    //             content: exercise.content,
    //             tags: exercise.tags,
    //         })
    //         .then((res) => {
    //             console.log(res);
    //         })
    //         .catch((e) => {
    //             console.log(e);
    //         });
    //     // Reset form after submission
    //     setDifficulty("");
    //     setTags([]);
    //     setTitle("");
    //     setContent("");
    // };
    const handleNext = () => {
        dispatch(setCurrentStep(currentStep + 1));
    };

    // const onChangeTag = (selected: string[]) => {
    //     // setTags(selected);
    //     dispatch(setTags(selected));
    // };
    return (
        <>
            <FormField
                control={props.form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Enter title" />
                        </FormControl>
                        <FormMessage className="text-right" />
                    </FormItem>
                )}
            />
            <FormField
                control={props.form.control}
                name="difficulty"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <FormControl>
                            <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    {difficultyOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage className="text-right" />
                    </FormItem>
                )}
            />

            <FormField
                control={props.form.control}
                name="tags"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                            <MultiSelect
                                options={tagOptions}
                                onValueChange={(selected: string[]) => {
                                    field.onChange(selected);
                                    dispatch(setTags(selected));
                                }}
                                value={field.value}
                                placeholder="Select tags"
                                variant="inverted"
                                animation={2}
                                maxCount={3}
                            />
                        </FormControl>
                        <FormMessage className="text-right" />
                    </FormItem>
                )}
            />
            {/* <CustomEditor content={exercise.content} /> */}
            {/* <FormField
                control={props.form.control}
                name="content"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                            <CustomEditor content={exercise.content} {...field} />
                        </FormControl>
                        <FormMessage className="text-right" />
                    </FormItem>
                )}
            /> */}
            {/* <Button type="submit" className="w-full">
          Tạo bài tập
        </Button> */}
            {/* <Button onClick={handleNext}>Next</Button> */}
        </>
    );
}
