"use client";
import { Progress } from "@/components/ui/progress";
import { Languages } from "@/types/language";
import React from "react";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { usePathname } from "next/navigation";
import { C, Java, Cpp } from "@/components/mastery";
import ExerciseCard from "@/components/study/exercise-card";
import { EStatus, Sort } from "@/components/sort";
import useStatusFilter from "@/hooks/filter/use-status-filter";
export type SortOptionTitle = "Filter" | "Status" | "Skills" | "Difficulty";

export default function ExercisePage() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const statusFilter = useStatusFilter();
    const title = segments[1]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    interface SortOption {
        title: SortOptionTitle;
        isFilter?: boolean;
    }
    const sortOptions: SortOption[] = [
        { title: "Filter", isFilter: true },
        { title: "Status" },
        { title: "Skills" },
        { title: "Difficulty" },
    ];
    return (
        <>
            <div className="flex shrink-0 items-center justify-between pr-14 pl-10 py-6 bg-white shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="size-24">
                        {title === "C" && <C.TierFinal />}
                        {title === "Java" && <Java.TierFinal />}
                        {title === "C++" && <Cpp.TierFinal />}
                    </div>
                    <h1 className="text-2xl font-semibold">Practice in {title} </h1>
                </div>
                <div className="space-y-1">
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
                            {title === "C" && <C.TierOne />}
                            {title === "Java" && <Java.TierOne />}
                            {title === "C++" && <Cpp.TierOne />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pr-14 pl-10 pt-4 pb-8 space-y-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Sort<EStatus>
                        title="Status"
                        menuItems={statusFilter.menuItems}
                        applyFilter={statusFilter.applyStatusFilter}
                        selected={statusFilter.selected}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ExerciseCard
                        language={title as Languages}
                        title="Hello World"
                        tags={["Crypto", "Privacy", "Social"]}
                        inProgress
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ExerciseCard
                        language={title as Languages}
                        title="Hello World"
                        tags={["Crypto", "Privacy", "Social"]}
                    />
                    <ExerciseCard
                        language={title as Languages}
                        title="Function in C"
                        tags={["Crypto", "Privacy", "Social"]}
                    />
                </div>
            </div>
        </>
    );
}
