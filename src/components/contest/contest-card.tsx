import React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
type ContestCardProps = {
    title: string;
    date: string;
    countdown?: string;
    buttonText: string;
    onButtonClick: () => void;
};

export default function ContestCard(props: ContestCardProps) {
    return (
        <div className=" rounded-2xl  p-6  items-center justify-between bg-white hover:bg-background_hover cursor-pointer transition-all	">
            <div className="flex flex-col gap-2">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{props.title}</h3>
                    <p className="text-sm text-gray-500">{props.date}</p>
                </div>

                <div className={`flex items-center ${props.countdown ? "justify-between" : "justify-end"} `}>
                    {props.countdown && (
                        <div className="flex items-center text-pink_primary">
                            <Clock className="size-4 mr-1" />
                            <span className="text-sm font-medium">
                                Starts in <span className="text-foreground">{props.countdown}</span>
                            </span>
                        </div>
                    )}

                    <Button onClick={props.onButtonClick} variant="outline">
                        {props.buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
