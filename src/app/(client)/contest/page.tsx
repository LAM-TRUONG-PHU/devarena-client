"use client";
import React, { use, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createContest } from "@/redux/slices/contestSlice";
import Image from "next/image";
import ContestCard from "@/components/contest/contest-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function ContestPage() {
    const { contests } = useAppSelector((state) => state.contest);
    const dispatch = useAppDispatch();
    useEffect(() => {
        console.log(contests);
    }, [contests]);

    const autoGenerateId = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    return (
        <>
            <div className="flex shrink-0 items-center justify-between pr-8 px-4 py-6 bg-white shadow-sm">
                <div className="flex gap-4">
                    <Image src="/trophy.png" alt="logo" width={36} height={36} />
                    <div>
                        <h1 className="text-lg font-semibold">DevArena Contest </h1>
                        <p>Contest every week. Compete and see your ranking!</p>
                    </div>
                </div>
                <Link href="/contest/my-contest">
                    <Button>My contest</Button>
                </Link>
            </div>
            <div>
                <h1 className="text-lg font-medium p-4">Active Contest</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-10">
                    <ContestCard
                        title="ServiceNow Tech Hiring Challenge"
                        date="Dec 8, 2024 9:30 AM GMT+7"
                        countdown="4d 20h 45m 12s"
                        buttonText="Join"
                        onButtonClick={() => {}}
                    />
                    <ContestCard
                        title="Hackathon Challenge 2024"
                        date="Dec 15, 2024 10:00 AM GMT+7"
                        countdown="11d 18h 30m 45s"
                        buttonText="Join"
                        onButtonClick={() => {}}
                    />
                </div>
            </div>
            <div className="pb-8">
                <div className="flex justify-between items-center pr-4">
                    <h1 className="text-lg font-medium p-4">Past Contest</h1>
                    <Link href="/contest/past-contest">
                        <Button variant="ghost">View All</Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
                    <ContestCard
                        title="ServiceNow Tech Hiring Challenge"
                        date="Dec 8, 2024 9:30 AM GMT+7"
                        buttonText="Join"
                        onButtonClick={() => {}}
                    />
                    <ContestCard
                        title="Hackathon Challenge 2024"
                        date="Dec 15, 2024 10:00 AM GMT+7"
                        buttonText="Join"
                        onButtonClick={() => {}}
                    />
                    <ContestCard
                        title="Hackathon Challenge 2024"
                        date="Dec 15, 2024 10:00 AM GMT+7"
                        buttonText="Join"
                        onButtonClick={() => {}}
                    />
                    <ContestCard
                        title="ServiceNow Tech Hiring Challenge"
                        date="Dec 8, 2024 9:30 AM GMT+7"
                        buttonText="Join"
                        onButtonClick={() => {}}
                    />
                    <ContestCard
                        title="Hackathon Challenge 2024"
                        date="Dec 15, 2024 10:00 AM GMT+7"
                        buttonText="Join"
                        onButtonClick={() => {}}
                    />
                    <ContestCard
                        title="Hackathon Challenge 2024"
                        date="Dec 15, 2024 10:00 AM GMT+7"
                        buttonText="Join"
                        onButtonClick={() => {}}
                    />
                </div>
            </div>
        </>
    );
}
