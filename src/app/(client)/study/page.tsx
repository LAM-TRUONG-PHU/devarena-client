"use client";
import React, { Suspense, use, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import StudyCard from "@/components/study/study-card";
import InProcessingCard from "@/components/study/in-processing-card";
import { Progress } from "@radix-ui/react-progress";
import { Trophy } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ELanguages } from "@/types/language";
import AllCourseSection from "@/components/study/AllCourseSection";
import GetInProgresCourse from "@/components/study/GetInProgresCourse";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { useSession } from "next-auth/react";
import { set } from "store";
import { LoadingSpinner } from "@/components/loading";
import { ICourse, ICourseStatus } from "@/types/ICourse";
import { EStatus } from "@/components/sort";
import { useAppDispatch } from "@/redux/hooks";
import { fetchAchievementsByRefIdAndRequiredScore } from "@/redux/slices/achievementSlice";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudyPage() {
    const router = useRouter();
    const axiosPrivate = usePrivate();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const [courses, setCourses] = useState<(ICourse & { status: EStatus })[]>([]);
    useEffect(() => {
        if (status !== "authenticated" || courses.length > 0) return;

        const fetchCourses = async () => {
            try {
                setLoading(true);
                const res = await axiosPrivate.get(`/course/user/${session?.user.id}`);
                const { coursesStatus }: { coursesStatus: ICourseStatus[] } = res.data.data;

                setCourses(
                    res.data.data.courses.map((course: ICourse) => {
                        const courseStatus = coursesStatus.find((courseStatus) => courseStatus.courseId === course._id);
                        return {
                            ...course,
                            status: courseStatus?.status === "completed" ? EStatus.Solved : EStatus.InProgress,
                        };
                    })
                );
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [status]); // No dependency on `courses`


    return (
        <Suspense>
            <div className="flex shrink-0 items-center justify-between pr-14 pl-10 py-6 bg-white shadow-sm">
                <div className="mx-auto">
                    <Image
                        className="mx-auto"
                        src="/languages.svg"
                        alt="DevArena logo"
                        width={200}
                        height={200}
                    />
                    <div className="text-center text-xl text-black font-semibold">
                        Some language to boost your programming skills
                    </div>
                    <div className="text-center">
                        Explore our tracks and become proficient in your chosen technologies, supported <br />
                        by an incredible community of creators.
                    </div>
                </div>
            </div>
            <div className="pr-14 pl-10 pb-8 pt-6 space-y-20">

                {loading ? (<>
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"

                    >
                        <Skeleton className="flex items-center w-full h-52 justify-center whitespace-nowrap rounded-xl px-3 py-1  font-medium ring-offset-background" />
                        <Skeleton className="flex items-center w-full h-52 justify-center whitespace-nowrap rounded-xl px-3 py-1  font-medium ring-offset-background" />
                        <Skeleton className="flex items-center w-full h-52 justify-center whitespace-nowrap rounded-xl px-3 py-1  font-medium ring-offset-background" />
                        <Skeleton className="flex items-center w-full h-52 justify-center whitespace-nowrap rounded-xl px-3 py-1  font-medium ring-offset-background" />



                    </div>
                </>) : (<>
                    <AllCourseSection courses={courses} /></>)}

            </div>
        </Suspense>
    );
}
