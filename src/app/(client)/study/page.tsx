"use client";
import React, { use, useEffect, useMemo, useState } from "react";
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

export default function StudyPage() {
    const router = useRouter();
    const axiosPrivate = usePrivate();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const [courses, setCourses] = useState<(ICourse & { status: EStatus })[]>([]);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                if (status === "authenticated") {
                    setLoading(true);
                    await axiosPrivate.get(`/course/user/${session?.user.id}`).then((res) => {
                        const { coursesStatus }: { coursesStatus: ICourseStatus[] } = res.data.data;

                        setCourses(res.data.data.courses.map((course: ICourse) => {
                            const courseStatus = coursesStatus.find((courseStatus) => courseStatus.courseId === course._id);
                            if (courseStatus == undefined) {
                                return { ...course, status: EStatus.Unsolved };
                            } else {
                                return { ...course, status: courseStatus.status == "completed" ? EStatus.Solved : EStatus.InProgress };
                            }
                        }));
                        setLoading(false);
                    });
                } else {
                    setLoading(false);
                }

            } catch (error) {
                setLoading(false);
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();

    }, [status]);

    return (
        <div>
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
                {loading ? <LoadingSpinner /> : (<>
                    <GetInProgresCourse courses={courses} />
                    <AllCourseSection courses={courses} /></>)}

            </div>
        </div>
    );
}
