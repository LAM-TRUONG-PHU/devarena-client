"use client";
import React from "react";
import { ICourse } from "@/types/ICourse";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudyCard from "./study-card";
import { useSession } from "next-auth/react";
import { ELanguages } from "@/types/language";
import { setCurrentCourse } from "@/redux/slices/courseSlice";
import { useAppDispatch } from "@/redux/hooks";
import { EStatus } from "../sort";

type AllCourseSectionProps = {
    courses: (ICourse & { status: EStatus })[]
};

const AllCourseSection = (props: AllCourseSectionProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    return (
        <div>
            <span>All Study Courses</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(
                    props.courses.filter((course) => course.status === EStatus.Unsolved).map((course) => (
                        <StudyCard
                            key={course._id}
                            onClick={async () => {
                                router.push(`/study/${course.language.toLowerCase()}?id=${course._id}`);
                            }}
                            language={course.language as ELanguages}
                            exercises={course.totalExercises || 0}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default AllCourseSection;
