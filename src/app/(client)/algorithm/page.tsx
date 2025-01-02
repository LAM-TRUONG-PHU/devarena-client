"use client";
import { MainFilter } from "@/components/filter";
import { C, Cpp, Java, Algorithm } from "@/components/mastery";
import { Sort, EStatus, EDifficulty, ESkills } from "@/components/sort";
import ExerciseCard from "@/components/study/exercise-card";
import { Progress } from "@/components/ui/progress";
import useDifficultyFilter from "@/hooks/filter/use-difficulty-filter";
import useMainFilter from "@/hooks/filter/use-filter";
import useSkillsFilter from "@/hooks/filter/use-skills-filter";
import useStatusFilter from "@/hooks/filter/use-status-filter";
import { ELanguages } from "@/types/language";
import { getLanguageTitle } from "@/utils/get-language-title";
import { isValidLanguage } from "@/utils/is-valid-language";
import { usePathname, useRouter } from "next/navigation";

import React from "react";

export default function AlgorithmPage() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const statusFilter = useStatusFilter();
    const difficultyFilter = useDifficultyFilter();
    const skillsFilter = useSkillsFilter();
    const mainFilter = useMainFilter();
    const router = useRouter();
    return (
        <>
            <div className="flex shrink-0 items-center justify-between lg:px-14  py-6 bg-white shadow-sm">
                <div className="">
                    <div className="text-center text-xl text-black font-semibold">
                        Welcome to DevArena's Algorithm Section! 🚀{" "}
                    </div>
                    <div className="text-center">
                        Dive into the world of problem-solving and coding challenges to enhance <br /> your
                        skills. Whether you're just starting or sharpening your expertise, there's <br />
                        something here for everyone.
                    </div>
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
                            <Algorithm.TierOne />
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
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-5">
                    <ExerciseCard
                        language={ELanguages.Unknown}
                        title="Hello World"
                        tags={["Crypto", "Privacy", "Social"]}
                        inProgress
                        onClick={() => {}}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ExerciseCard
                        language={ELanguages.Unknown}
                        title="Hello World"
                        tags={["Crypto", "Privacy", "Social"]}
                        onClick={() => {
                            router.push(`/algorithm/hello-world`);
                        }}
                    />
                    <ExerciseCard
                        language={ELanguages.Unknown}
                        title="Function in C"
                        tags={["Crypto", "Privacy", "Social"]}
                        onClick={() => {}}
                    />
                </div> */}
            </div>
        </>
    );
}
