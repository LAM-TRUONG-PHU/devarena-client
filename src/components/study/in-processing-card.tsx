import React from "react";
import { FaDumbbell } from "react-icons/fa6";
import { C, Cpp, Java } from "@/components/mastery";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";
import { ELanguages } from "@/types/language";
import { getLanguageTitle } from "@/utils/get-language-title";
type InProgressingCardProps = {
  language: string;
  exercises: number;
  progress: number;
  onClick: () => void;
};

export default function InProcessingCard(props: InProgressingCardProps) {
  return (
    <div className="card-bg border border-gray-200 relative">
      <div className="size-24 absolute -top-4 -right-4">
        {props.language === ELanguages.C && <C.TierFinal />}
        {props.language === ELanguages.Cpp && <Cpp.TierFinal />}
        {props.language === ELanguages.Java && <Java.TierFinal />}
      </div>
      <div className="space-y-1">
        <div className="text-xl font-semibold">
          {getLanguageTitle(props.language as ELanguages)}
        </div>
        <div className="flex gap-1">
          <FaDumbbell className="size-4 mr-1" />
          <span className="text-sm font-medium">
            {props.exercises} exercises
          </span>
        </div>
        <div className="flex justify-between items-center w-11/12">
          <Progress value={props.progress} variant={props.language as ELanguages} />
          <div className="text-xs ml-2">{props.progress}%</div>
        </div>
        <div className="flex gap-1 items-center w-2/3 text-sm">
          <div>Get to 15 points to unlock next mastery</div>
          <div className="size-8">
            {props.language === ELanguages.C && <C.TierFinal />}
            {props.language === ELanguages.Cpp && <Cpp.TierFinal />}
            {props.language === ELanguages.Java && <Java.TierFinal />}
          </div>
        </div>
        <Button onClick={props.onClick} className="px-4 py-6">
          <span>Continue Studying</span>
        </Button>
      </div>
    </div>
  );
}
