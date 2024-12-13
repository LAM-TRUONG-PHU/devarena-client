import React from "react";
import { C, Java, Cpp } from "@/components/mastery";
import { FaDumbbell } from "react-icons/fa6";
import { Languages } from "@/types/language";
type StudyCardProps = {
    title: Languages;
    exercises: number;
    onClick: () => void;
};

export default function StudyCard(props: StudyCardProps) {
    return (
        <div className="card-bg" onClick={props.onClick}>
            <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-4">
                    <div className="size-20">
                        {props.title === "C" && <C.TierFinal />}
                        {props.title === "Java" && <Java.TierFinal />}
                        {props.title === "C++" && <Cpp.TierFinal />}
                    </div>
                    <div>
                        <div className="text-xl font-semibold">{props.title}</div>
                        <div className="flex">
                            <FaDumbbell className="size-4 mr-1" />
                            <span className="text-sm font-medium">{props.exercises} exercises</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
