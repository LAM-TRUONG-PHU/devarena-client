import React from "react";
import { FaDumbbell } from "react-icons/fa6";
import { C } from "@/components/mastery";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";
import { Languages } from "@/types/language";
type InProgressingCardProps = {
    title: Languages | undefined;
    exercises: number;
    onClick: () => void;
};

export default function InProcessingCard(props: InProgressingCardProps) {
    return (
        <div className="card-bg border border-gray-200 relative">
            <div className="size-24 absolute -top-8 -right-10">
                <C.TierFinal />
            </div>
            <div className="space-y-1">
                <div className="text-xl font-semibold">{props.title}</div>
                <div className="flex gap-1">
                    <FaDumbbell className="size-4 mr-1" />
                    <span className="text-sm font-medium">{props.exercises} exercises</span>
                </div>
                <div className="flex justify-between items-center w-11/12">
                    <Progress value={50} variant={props.title} />
                    <div className="text-xs ml-2">50%</div>
                </div>
                <div className="flex gap-1 items-center w-2/3 text-sm">
                    <div>33% Get to 15 points to unlock next mastery</div>
                    <div className="size-8">
                        <C.TierThree />
                    </div>
                </div>
                <Button onClick={props.onClick} className="px-4 py-6">
                    <span>Continue Studying</span>
                </Button>
            </div>
        </div>
    );
}
