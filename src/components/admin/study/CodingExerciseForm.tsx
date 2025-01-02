"use client";

import { useEffect, useState } from "react";
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
import { formSchema, TExerciseStudy } from "@/app/admin/study/[slug]/create-exercise/page";
import { ESkills } from "@/components/sort";

const difficultyOptions = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
];

const tagOptions = [
    { value: "array", label: "Array" },
    { value: "string", label: "String" },
    { value: "hash-table", label: "Hash Table" },
    { value: "dynamic-programming", label: "Dynamic Programming" },
    { value: "math", label: "Math" },
    { value: "sorting", label: "Sorting" },
    { value: "greedy", label: "Greedy" },
    { value: "depth-first-search", label: "Depth-First Search" },
    { value: "database", label: "Database" },
    { value: "binary-search", label: "Binary Search" },
    { value: "matrix", label: "Matrix" },
    { value: "tree", label: "Tree" },
    { value: "breadth-first-search", label: "Breadth-First Search" },
    { value: "bit-manipulation", label: "Bit Manipulation" },
    { value: "two-pointers", label: "Two Pointers" },
    { value: "prefix-sum", label: "Prefix Sum" },
    { value: "heap-(priority-queue)", label: "Heap (Priority Queue)" },
    { value: "binary-tree", label: "Binary Tree" },
    { value: "simulation", label: "Simulation" },
    { value: "stack", label: "Stack" },
    { value: "graph", label: "Graph" },
    { value: "counting", label: "Counting" },
    { value: "sliding-window", label: "Sliding Window" },
    { value: "design", label: "Design" },
    { value: "backtracking", label: "Backtracking" },
    { value: "enumeration", label: "Enumeration" },
    { value: "union-find", label: "Union Find" },
    { value: "linked-list", label: "Linked List" },
    { value: "number-theory", label: "Number Theory" },
    { value: "ordered-set", label: "Ordered Set" },
    { value: "monotonic-stack", label: "Monotonic Stack" },
    { value: "trie", label: "Trie" },
    { value: "segment-tree", label: "Segment Tree" },
    { value: "bitmask", label: "Bitmask" },
    { value: "queue", label: "Queue" },
    { value: "divide-and-conquer", label: "Divide and Conquer" },
    { value: "recursion", label: "Recursion" },
    { value: "combinatorics", label: "Combinatorics" },
    { value: "binary-indexed-tree", label: "Binary Indexed Tree" },
    { value: "geometry", label: "Geometry" },
    { value: "binary-search-tree", label: "Binary Search Tree" },
    { value: "hash-function", label: "Hash Function" },
    { value: "memoization", label: "Memoization" },
    { value: "string-matching", label: "String Matching" },
    { value: "topological-sort", label: "Topological Sort" },
    { value: "shortest-path", label: "Shortest Path" },
    { value: "rolling-hash", label: "Rolling Hash" },
    { value: "game-theory", label: "Game Theory" },
    { value: "interactive", label: "Interactive" },
    { value: "data-stream", label: "Data Stream" },
    { value: "monotonic-queue", label: "Monotonic Queue" },
    { value: "brainteaser", label: "Brainteaser" },
    { value: "randomized", label: "Randomized" },
    { value: "merge-sort", label: "Merge Sort" },
    { value: "doubly-linked-list", label: "Doubly Linked List" },
    { value: "counting-sort", label: "Counting Sort" },
    { value: "iterator", label: "Iterator" },
    { value: "concurrency", label: "Concurrency" },
    { value: "probability-and-statistics", label: "Probability and Statistics" },
    { value: "quickselect", label: "Quickselect" },
    { value: "suffix-array", label: "Suffix Array" },
    { value: "bucket-sort", label: "Bucket Sort" },
];

type CodingExerciseFormProps = {
    form: UseFormReturn<TExerciseStudy, any, undefined>;
};
export function CodingExerciseForm(props: CodingExerciseFormProps) {
    const dispatch = useAppDispatch();
    const { currentStep, totalStep, exercise } = useAppSelector((state) => state.studyForm);

    useEffect(() => {
        console.log("content", exercise.content);
    }, [exercise.content]);

    // const onChangeTag = (selected: string[]) => {
    //     // setTags(selected);
    //     dispatch(setTags(selected));
    // };
    return (
        <div>
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
                                }}
                                value={field.value}
                                placeholder="Select tags"
                                variant="inverted"
                                animation={2}
                                maxCount={5}
                            />
                        </FormControl>
                        <FormMessage className="text-right" />
                    </FormItem>
                )}
            />
            {/* <CustomEditor content={exercise.content} /> */}
            <FormField
                control={props.form.control}
                name="content"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                            <CustomEditor
                                content={field.value}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                }}
                            />
                        </FormControl>
                        <FormMessage className="text-right" />
                    </FormItem>
                )}
            />
            <FormField
                control={props.form.control}
                name="score"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Score</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="Enter score"
                                type="number"
                                value={field.value} // Assuming field.value is expected to be a number
                                onChange={(e) => {
                                    const numericValue = e.target.value === "" ? "" : Number(e.target.value); // Handle empty input gracefully
                                    field.onChange(numericValue);
                                }}
                            />
                        </FormControl>
                        <FormMessage className="text-right" />
                    </FormItem>
                )}
            />

            {/* <Button type="submit" className="w-full">
          Tạo bài tập
        </Button> */}
            {/* <Button onClick={handleNext}>Next</Button> */}
        </div>
    );
}
