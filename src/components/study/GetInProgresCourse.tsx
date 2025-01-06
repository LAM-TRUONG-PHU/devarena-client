"use client";
import { ICourseStatus } from "@/types/ICourseStatus";
import { usePrivate } from "@/hooks/usePrivateAxios";
import React, { useEffect, useState } from "react";
import InProcessingCard from "./in-processing-card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { setCurrentCourse } from "@/redux/slices/courseSlice";
import { useAppDispatch } from "@/redux/hooks";
import { EStatus } from "../sort";
import { ICourse } from "@/types/ICourse";

type GetInProgresCourseProps = {
  courses: (ICourse & { status: EStatus })[]
}

const GetInProgresCourse = (props: GetInProgresCourseProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {props.courses.filter((course) => course.status === EStatus.InProgress).map((course) => (
        <InProcessingCard
          key={course._id}
          onClick={async () => {
            router.push(`/study/${course.language.toLowerCase()}?id=${course._id}`);
          }}
          language={course.language}
          exercises={course.totalExercises || 0} progress={0} />
      ))}

    </div>
  );
};

export default GetInProgresCourse;
