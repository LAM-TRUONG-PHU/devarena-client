"use client";
import { CodingExerciseForm } from "@/components/admin/study/CodingExerciseForm";
import CustomEditor from "@/components/CustomEditor/CustomEditor";
import UploadWidget from "@/components/uploadWidget/UploadWidget";
import { useRouter } from "next/navigation";
import React from "react";

export default function AdminStudyPage() {
  const router = useRouter();
  return (
    <div className="w-full flex justify-center items-center">
      {/* <CustomEditor/> */}
      <div
        className="w-[200] h-[80] p-4 cursor-pointer"
        onClick={() => {
          router.push("/admin/study/java");
        }}
      >
        Java
      </div>
      <div
        className="w-[200] h-[80] p-4 cursor-pointer"
        onClick={() => {
          router.push("/admin/study/cpp");
        }}
      >
        C++
      </div>
    </div>
  );
}
