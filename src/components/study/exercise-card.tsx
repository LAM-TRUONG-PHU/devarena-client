import React from "react";
import { C, Java, Cpp, Algorithm } from "../mastery";
import { CiHeart } from "react-icons/ci";
import Difficulty from "../difficulty";
import { Button } from "../ui/button";
import { ELanguages } from "@/types/language";
import { EDifficulty } from "../sort";
import { usePathname } from "next/navigation";
import { MdOutlineCheckCircle } from "react-icons/md";

type CardProps = {
    language: string;
    title: string;
    tags: string[];
    isAlgorithm?: boolean;
    onClick: () => void;
    status: string;
    score: number | undefined;
};
export default function ExerciseCard(props: CardProps) {
    return (
        <div className="card-bg space-y-2" onClick={props.onClick}>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="size-10">
                        {props.language === ELanguages.C && <C.TierFinal />}
                        {props.language === ELanguages.Java && <Java.TierFinal />}
                        {props.language === ELanguages.Cpp && <Cpp.TierFinal />}
                        {props.language === ELanguages.Unknown && <Algorithm.TierFinal />}
                    </div>
                    <div>
                        <h1 className={`text-lg font-semibold ${props.status === "in-progress" && "text-black"}`}>
                            {props.title}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center">
                    <div
                        className={`aspect-square rounded-full border border-foreground w-10 justify-center items-center flex text-xs p-1  font-semibold   ${props.status === "in-progress" && "border-pink_primary text-pink_primary"
                            }`}
                    >
                        {props.status == "completed" ? props.score : 0}/{props.score}
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                <Difficulty variant={EDifficulty.Easy} />

                {props.tags.map((tag, index) => (
                    <span key={index} className="tag">
                        {tag}
                    </span>
                ))}
            </div>
            <div className={`flex items-center  ${props.status === "in-progress" ? "justify-between" : "justify-end"}`}>
                {props.status === "in-progress" && (
                    <div className="bg-[#E1EBFF] text-[#2E57E8] rounded-xl font-semibold h-fit w-fit text-xs py-1 px-2 xl:px-4 ">
                        In-Progress
                    </div>
                )}

                <div className="flex items-center justify-between gap-2 text-gray-800 text-sm">
                    {props.isAlgorithm && (
                        <div className="size-8">
                            <C.TierFinal mostUsed />
                        </div>
                    )}

                    <CiHeart size={32} className="inline-block" />
                    {props.status === "completed" ? (
                        <Button
                            onClick={() => { }}
                            variant="outline"
                            className="border-pink_primary text-pink_primary"
                        >
                            Completed
                            <MdOutlineCheckCircle />
                        </Button>
                    ) : props.status !== "in-progress" ? (
                        <Button onClick={() => { }} variant="outline">
                            Start
                        </Button>
                    ) : (
                        <Button onClick={() => { }} className="w-2/3 xl:w-auto">Continue</Button>
                    )}
                </div>
            </div>
        </div>
    );
}
