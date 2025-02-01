import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { IAchievement } from "@/types/IAchievement";
import { useState } from "react";

type TProps = {
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
    yourPreAchievement: IAchievement | null;
}

export function AlertAchievementDialog(props: TProps) {
    const baseImageURL = `${process.env.NEXT_PUBLIC_BACKEND_UPLOAD_URL}/achievements`;

    return (
        <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Achievement Unlocked!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="flex justify-center">
                            <img src={`${baseImageURL}/${props.yourPreAchievement?.image}`} className="w-16 h-16" />
                        </div>
                        🎉 Congrats on your achievement at Web Dev Arena! 🚀 Your hard work and dedication are inspiring. Keep building, keep growing! 💻👏
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => props.onOpenChange(false)}>
                        Close
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
