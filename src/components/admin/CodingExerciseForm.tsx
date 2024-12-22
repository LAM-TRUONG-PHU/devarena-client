"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MultiSelect, OptionType } from "@/components/ui/multi-select";
import { FloatingLabelInput } from "../ui/floating-label-input";
import CustomEditor from "../CustomEditor/CustomEditor";
import { mainInstance } from "@/axios/MainInstance";
import useAxios from "@/hooks/useAxios";
import TestcaseForm from "./TestcaseForm";

const difficultyOptions = [
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];

const tagOptions: OptionType[] = [
  { value: "Array", label: "Array" },
  { value: "Function", label: "Function" },
  { value: "Loop", label: "Loop" },
  { value: "String", label: "String" },
  { value: "Recursion", label: "Recursion" },
  { value: "Algorithm", label: "Algorithm" },
];
interface Pros {
  language: string;
}
export function CodingExerciseForm({ language }: Pros) {
  const [difficulty, setDifficulty] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const axiosInstance = useAxios();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log({ difficulty, tags, title, content });

    const reponse = await axiosInstance
      .post("/exercise", {
        language: language,
        difficulty: difficulty,
        title: title,
        content: content,
        tags: tags,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
    // Reset form after submission
    setDifficulty("");
    setTags([]);
    setTitle("");
    setContent("");
  };
  const onChangeTag = (selected: string[]) => {
    setTags(selected);
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 w-[60%] ">
        <FloatingLabelInput
          as="select"
          label="Độ khó"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="" disabled>
            Chọn độ khó
          </option>
          {difficultyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FloatingLabelInput>

        <MultiSelect
          options={tagOptions}
          selected={tags}
          onChange={onChangeTag}
          placeholder="Chọn tags"
          label="Tags"
        />

        <FloatingLabelInput
          label="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề bài tập"
        />

        {/* <FloatingLabelInput
        as="textarea"
        label="Nội dung"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Nhập nội dung bài tập"
      /> */}
        <CustomEditor content={content} setContent={setContent} />
        <Button type="submit" className="w-full">
          Tạo bài tập
        </Button>
      </form>
    </>
  );
}
