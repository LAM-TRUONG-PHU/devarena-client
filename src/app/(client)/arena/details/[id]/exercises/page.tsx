"use client";
import React, { Suspense, useEffect } from "react";
import ChallengeCard from "@/components/contest/challenge-card";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { C } from "@/components/mastery";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchContestExercises } from "@/redux/slices/contestClientSlice";
import { useAppSelector } from "@/redux/hooks";
import { usePrivate } from "@/hooks/usePrivateAxios";
export default function ChallengePage() {
    const dispatch = useAppDispatch();
    const { exerciseCard } = useAppSelector((state) => state.contestClient);
    const axiosInstance = usePrivate();
    const params = useSearchParams();
    const id = params.get("id");
    useEffect(() => {
        dispatch(fetchContestExercises({ axiosInstance: axiosInstance, contestId: id as string }));
    }, [id]);
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const title = segments[1]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return (
        <Suspense>
            <div className="flex shrink-0 items-center justify-between pr-14 pl-10 py-6 bg-white shadow-sm">
                <div>
                    <h1 className="text-xl font-semibold">{title} </h1>
                </div>
                <div className="space-y-1">
                    <div className="text-sm">
                        <span className="text-pink_primary">In top 5%</span> to get your this mastery!
                    </div>
                    <div className="flex justify-between items-center">
                        <Progress value={50} />
                        <div className="text-xs ml-2">50%</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <div className="aspect-square rounded-full border border-foreground w-fit items-center flex text-xs p-1  font-semibold   ">
                                0/25
                            </div>
                            <div className=" rounded-full border border-foreground w-fit items-center flex text-xs py-1  font-semibold px-2">
                                <Trophy className="size-4 mr-1" />
                                1999
                            </div>
                        </div>

                        <Image
                            src="/mastery/test.svg"
                            alt="avatar"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    </div>
                </div>
            </div>
            <div className="pr-14 pl-10 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 ">
                {
                    exerciseCard.map((exercise) => (
                        <ChallengeCard
                            title={exercise.title}
                            date="12th March 2022"
                            buttonText="View Challenge"
                            onClick={() => console.log("Clicked")}
                            key={exercise._id}
                            id={exercise._id}
                            difficulty={exercise.difficulty}
                            score={exercise.score}
                        />
                    ))
                }

            </div>
        </Suspense>
    );
}
