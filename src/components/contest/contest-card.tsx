import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/helper";
import { useRouter } from "next/navigation";

type ContestCardProps = {
    title: string;
    date: string;
    status: string;
    buttonText: string;
    id: string;
};

export default function ContestCard(props: ContestCardProps) {
    const [countdown, setCountdown] = useState<string>("");
    const date = formatDateTime(props.date);
    const router = useRouter();
    useEffect(() => {
        if (props.status !== "published") return;

        const calculateTimeLeft = () => {
            const startDate = new Date(props.date).getTime();
            const now = new Date().getTime();
            const difference = startDate - now;

            if (difference <= 0) {
                return "";
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        };

        // Initial calculation
        setCountdown(calculateTimeLeft());

        // Update countdown every second
        const timer = setInterval(() => {
            const timeLeft = calculateTimeLeft();
            setCountdown(timeLeft);
            
            // Clear interval if countdown is finished
            if (!timeLeft) {
                clearInterval(timer);
            }
        }, 1000);

        // Cleanup on unmount
        return () => clearInterval(timer);
    }, [props.date, props.status]);
const handleClick = () => {
    router.push(`/arena/details/${props.id}`);
}
    return (
        <div className="card-bg" onClick={handleClick}>
            <div className="flex flex-col gap-2">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">{props.title}</h3>
                    <p className="text-sm text-gray-500">{date}</p>
                </div>

                <div className={`flex items-center ${props.status === "published" && countdown ? "justify-between" : "justify-end"}`}>
                    {props.status === "published" && countdown && (
                        <div className="flex items-center text-pink_primary">
                            <Clock className="size-4 mr-1" />
                            <span className="text-sm font-medium">
                                Starts in <span className="text-foreground">{countdown}</span>
                            </span>
                        </div>
                    )}

                    <Button onClick={handleClick} variant="outline">
                        {props.buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
}