import React from "react";
import Difficulty from "@/components/difficulty";
import { Button } from "../ui/button";
type ChallengeCardProps = {
    title: string;
    date: string;
    countdown?: string;
    buttonText: string;
    onClick: () => void;
};
export default function ChallengeCard(props: ChallengeCardProps) {
    return (
        <div>
            <div
                className=" rounded-2xl  p-6  items-center justify-between bg-white hover:bg-background_hover cursor-pointer transition-all"
                onClick={props.onClick}
            >
                <div className="flex flex-col gap-2">
                    <div className="text-md font-medium text-gray-900">{props.title}</div>
                    <div className="flex justify-between">
                        <div className="flex items-center space-x-4">
                            <Difficulty variant="hard" />
                            <div className="aspect-square rounded-full border border-foreground w-fit items-center flex text-xs p-1  font-semibold   ">
                                0/10
                            </div>
                        </div>

                        <Button onClick={props.onClick} variant="outline">
                            {props.buttonText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
