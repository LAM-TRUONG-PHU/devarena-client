import React from "react";
import Difficulty from "@/components/difficulty";
import { Button } from "../ui/button";
import { EDifficulty } from "../sort";
type ChallengeCardProps = {
    title: string;
    date: string;
    countdown?: string;
    buttonText: string;
    id: string;
    score: number;
    difficulty: string;
    onClick: () => void;
};
export default function ChallengeCard(props: ChallengeCardProps) {
    return (
        <div>
            <div className="card-bg" onClick={props.onClick}>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <div className="text-md font-medium text-gray-900">{props.title}</div>
                        <div className="aspect-square rounded-full border border-foreground w-fit items-center flex text-xs p-1  font-semibold   ">
                            {props.score}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        {/* <Difficulty variant={EDifficulty.Hard} /> */}
                        <Difficulty variant={props.difficulty as EDifficulty} />
                        <Button onClick={props.onClick} variant="outline">
                            {props.buttonText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
