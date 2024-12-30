"use client";
import { Progress } from "@/components/ui/progress";
import { ELanguages } from "@/types/language";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Trophy } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { C, Java, Cpp } from "@/components/mastery";
import ExerciseCard from "@/components/study/exercise-card";
import { EDifficulty, ESkills, EStatus, Sort } from "@/components/sort";
import useStatusFilter from "@/hooks/filter/use-status-filter";
import useDifficultyFilter from "@/hooks/filter/use-difficulty-filter";
import { MainFilter } from "@/components/filter";
import useMainFilter from "@/hooks/filter/use-filter";
import useSkillsFilter from "@/hooks/filter/use-skills-filter";
import { isValidLanguage } from "@/utils/is-valid-language";
import { getLanguageTitle } from "@/utils/get-language-title";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { IExerciseStatus } from "@/types/IExerciseStatus";
import { ICourseStatus } from "@/types/ICourseStatus";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCourseStatus, setExercises, setExerciseSelected } from "@/redux/slices/ExerciseStatusSlice";
import { createSlug } from "@/lib/helper";

export type SortOptionTitle = "Filter" | "Status" | "Skills" | "Difficulty";

export default function LanguagePage() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const statusFilter = useStatusFilter();
    const difficultyFilter = useDifficultyFilter();
    const skillsFilter = useSkillsFilter();
    const mainFilter = useMainFilter();
    const router = useRouter();
    console.log("Language slug:", segments[1]); // Thêm dòng này để log ra slug language
    // const [courseStatus, setCourseStatus] = useState<ICourseStatus|null>(null)
    const axios =usePrivate()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)
    const {courseStatus} = useAppSelector((state)=>state.exerciseStatus)
    // const language = segments[1]
    //     .split("-")
    //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    //     .join(" ");

    // if (!isValidLanguage(language)) {
    //     return router.replace("/404");
    // }
    useEffect(()=>{
        console.log(courseStatus)
    },[courseStatus])
    useEffect(()=>{
        async function getExerciseStatus(){
            setLoading(true)
            const response = await axios.get(`/course-status/${segments[1]}`).then((res)=>{
                console.log(res.data.data)
                // setCourseStatus({
                //     courseId: res.data.data.courseId,
                //     _id: res.data.data._id,
                //     status: res.data.data.status,
                //     progress: res.data.data.progress,
                //     exerciseStatuses: res.data.data.exerciseStatuses
                // })
                //@ts-ignore
                dispatch(setCourseStatus(res.data.data))
            }).catch((err)=>{
                console.log(err)
            }) 
            setLoading(false)
            // setExerciseStatus(response.data)
        }
        getExerciseStatus()
        // if(segments[1]==="c"){
        //     setLanguage(ELanguages.C)
        // }
    },[segments[1]])
    return <>
            {loading && <div className="flex justify-center items-center h-screen">
                <Loader2 className="size-6 animate-spin" />
            </div>}
            <div className="flex shrink-0 items-center justify-between lg:pr-14 lg:pl-10  py-6 bg-white shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="md:size-24 size-20">
                        {courseStatus?.courseId.language === ELanguages.C && <C.TierFinal />}
                        {courseStatus?.courseId.language === ELanguages.Java && <Java.TierFinal />}
                        {courseStatus?.courseId.language === ELanguages.Cpp && <Cpp.TierFinal />}
                    </div>
                    <h1 className="md:text-2xl font-semibold text-lg">
                        {courseStatus?.courseId.title}
                    </h1>
                </div>
                <div className="space-y-1 scale-90 lg:scale-100">
                    <div className="text-sm">
                        <span className="text-pink_primary">17 more points</span> to get your this mastery!
                    </div>
                    <div className="flex justify-between items-center">
                        <Progress value={50} />
                        <div className="text-xs ml-2">50%</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <div className="aspect-square rounded-full border border-foreground w-fit items-center flex text-xs p-1  font-semibold   ">
                                0/25
                            </div>
                        </div>
                        <div className="size-10">
                            {courseStatus?.courseId.language === ELanguages.C && <C.TierOne />}
                            {courseStatus?.courseId.language === ELanguages.Java && <Java.TierOne />}
                            {courseStatus?.courseId.language === ELanguages.Cpp && <Cpp.TierOne />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:pr-14 lg:pl-10 px-8 pt-4 pb-8 space-y-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MainFilter title="Filter" menuItems={[]} applyFilter={mainFilter.applyMainFilter} />
                    <Sort<EStatus>
                        title="Status"
                        menuItems={statusFilter.menuItems}
                        applyFilter={statusFilter.applyStatusFilter}
                        selected={statusFilter.selected}
                    />
                    <Sort<EDifficulty>
                        title="Difficulty"
                        menuItems={difficultyFilter.menuItems}
                        applyFilter={difficultyFilter.applyDifficultyFilter}
                        selected={difficultyFilter.selected}
                    />
                    <Sort<ESkills>
                        title="Skills"
                        menuItems={skillsFilter.menuItems}
                        applyFilter={skillsFilter.applySkillsFilter}
                        selected={skillsFilter.selected}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-5">
                    {/* <ExerciseCard
                        language={courseStatus?.courseId.language||"Java"}
                        title="Hello World"
                        tags={["Crypto", "Privacy", "Social"]}
                        inProgress
                        onClick={() => {}}
                    /> */}
                    {
                        courseStatus?.exerciseStatuses?.map((exercise)=>{
                          
                                return <ExerciseCard
                                key={exercise._id}
                                    language={courseStatus?.courseId.language||"Java"}
                                title={exercise.exerciseId.title}
                                tags={exercise.exerciseId.tags}
                                status={exercise.status}
                                onClick={() => {
                                    const slug = createSlug(exercise.exerciseId.title)
                                    dispatch(setExerciseSelected(exercise))

                                    router.push(`/study/${segments[1]}/${slug}`);
                                }}                                
                            />
                           
                        })
                    }
                </div>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ExerciseCard
                        language={courseStatus?.courseId.language||"Java"}
                        title="Hello World"
                        tags={["Crypto", "Privacy", "Social"]}
                        onClick={() => {
                            router.push(`/study/${segments[1]}/hello-world`);
                        }}
                        
                    />
                   
                </div> */}
            </div>
        </>
   
}

