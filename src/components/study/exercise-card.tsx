import React from "react";
import { C, Java, Cpp } from "../mastery";
import { CiHeart } from "react-icons/ci";
import Difficulty from "../difficulty";
import { Button } from "../ui/button";
import { Languages } from "@/types/language";
import { EDifficulty } from "../sort";
type CardProps = {
    language: Languages;
    title: string;
    tags: string[];
    inProgress?: boolean;
};
export default function ExerciseCard(props: CardProps) {
    return (
        <div className="card-bg space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="size-10">
                        {props.language === "C" && <C.TierFinal />}
                        {props.language === "Java" && <Java.TierFinal />}
                        {props.language === "C++" && <Cpp.TierFinal />}
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">{props.title}</h1>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="aspect-square rounded-full border border-foreground w-fit items-center flex text-xs p-1  font-semibold   ">
                        0/25
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                <Difficulty variant={EDifficulty.Easy} />

                {props.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>
            <div className={`flex items-center ${props.inProgress ? "justify-between" : "justify-end"}`}>
                {props.inProgress && (
                    <div className="bg-[#E1EBFF] text-[#2E57E8] rounded-xl font-semibold h-fit w-fit text-xs py-1 px-1 xl:px-4">
                        In-Progress
                    </div>
                )}

                <div className="flex items-center gap-2 text-gray-800 text-sm">
                    <CiHeart size={32} className="inline-block" />
                    {!props.inProgress ? (
                        <Button onClick={() => {}} variant="outline">
                            Start
                        </Button>
                    ) : (
                        <Button onClick={() => {}}>Continue</Button>
                    )}
                </div>
            </div>
        </div>
    );
}
