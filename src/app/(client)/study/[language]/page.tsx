"use client";
import { Progress } from "@/components/ui/progress";
import { ELanguages } from "@/types/language";
import React from "react";
import Image from "next/image";
import { Trophy } from "lucide-react";
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
export type SortOptionTitle = "Filter" | "Status" | "Skills" | "Difficulty";

export default function LanguagePage() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const statusFilter = useStatusFilter();
    const difficultyFilter = useDifficultyFilter();
    const skillsFilter = useSkillsFilter();
    const mainFilter = useMainFilter();
    const router = useRouter();

    const language = segments[1]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    if (!isValidLanguage(language)) {
        return router.replace("/404");
    }

    return (
        <>
            <div className="flex shrink-0 items-center justify-between lg:pr-14 lg:pl-10  py-6 bg-white shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="md:size-24 size-20">
                        {language === ELanguages.C && <C.TierFinal />}
                        {language === ELanguages.Java && <Java.TierFinal />}
                        {language === ELanguages.Cpp && <Cpp.TierFinal />}
                    </div>
                    <h1 className="md:text-2xl font-semibold text-lg">Practice in {language} </h1>
                </div>
                <div className="space-y-1 scale-90">
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
                            {language === ELanguages.C && <C.TierOne />}
                            {language === ELanguages.Java && <Java.TierOne />}
                            {language === ELanguages.Cpp && <Cpp.TierOne />}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ExerciseCard
                        language={language}
                        title="Hello World"
                        tags={["Crypto", "Privacy", "Social"]}
                        inProgress
                        onClick={() => {}}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ExerciseCard
                        language={language}
                        title="Hello World"
                        tags={["Crypto", "Privacy", "Social"]}
                        onClick={() => {
                            router.push(`/study/${segments[1]}/hello-world`);
                        }}
                    />
                    <ExerciseCard
                        language={language}
                        title="Function in C"
                        tags={["Crypto", "Privacy", "Social"]}
                        onClick={() => {}}
                    />
                </div>
            </div>
        </>
    );
}
