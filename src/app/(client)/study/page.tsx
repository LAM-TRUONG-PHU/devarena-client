"use client";
import React, { useState } from "react";
import Image from "next/image";
import StudyCard from "@/components/study/study-card";
import InProcessingCard from "@/components/study/in-processing-card";
import { Progress } from "@radix-ui/react-progress";
import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { ELanguages } from "@/types/language";
import AllCourseSection from "@/components/study/AllCourseSection";
import GetInProgresCourse from "@/components/study/GetInProgresCourse";

export default function StudyPage() {
    const router = useRouter();
 
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
                <span>In Processing</span>
                <GetInProgresCourse  />
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InProcessingCard language={ELanguages.C} exercises={82} onClick={() => {}} />
                    <InProcessingCard language={ELanguages.C} exercises={82} onClick={() => {}} />
                </div> */}
                <span>All Study Courses</span>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
                    <AllCourseSection  />
                    {/* <StudyCard
                        onClick={() => {
                            router.push("/study/c");
                        }}
                        language={ELanguages.C}
                        exercises={82}
                    />
                    <StudyCard
                        onClick={() => {
                            router.push("/study/java");
                        }}
                        language={ELanguages.Java}
                        exercises={82}
                    />
                    <StudyCard
                        onClick={() => {
                            router.push("/study/cpp");
                        }}
                        language={ELanguages.Cpp}
                        exercises={82}
                    /> */}
                {/* </div> */}
            </div>
        </div>
    );
}
