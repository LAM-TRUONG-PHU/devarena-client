import React from "react";
import { C, Java, Cpp } from "@/components/mastery";
import { FaDumbbell } from "react-icons/fa6";
import { ELanguages } from "@/types/language";
import { getLanguageTitle } from "@/utils/get-language-title";
type StudyCardProps = {
    language: ELanguages;
    exercises: number;
    onClick: () => void;
};

export default function StudyCard(props: StudyCardProps) {
    return (
        <div className="card-bg" onClick={props.onClick}>
            <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-4">
                    <div className="size-20">
                        {props.language === ELanguages.C && <C.TierFinal />}
                        {props.language === ELanguages.Java && <Java.TierFinal />}
                        {props.language === ELanguages.Cpp && <Cpp.TierFinal />}
                    </div>
                    <div>
                        <div className="text-xl font-semibold">{getLanguageTitle(props.language)}</div>
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
