"use client";
import React, { use, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createContest } from "@/redux/slices/contestSlice";
import Image from "next/image";
import ContestCard from "@/components/contest/contest-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function ContestPage() {
    const { contests } = useAppSelector((state) => state.contest);
    const dispatch = useAppDispatch();
    const router = useRouter();
    useEffect(() => {
        console.log(contests);
    }, [contests]);

    const autoGenerateId = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    return (
        <>
            <div className="flex shrink-0 items-center justify-between pr-14 pl-10 py-6 bg-white shadow-sm">
                <div className="flex gap-4">
                    <Image src="/trophy.png" alt="logo" width={36} height={36} />
                    <div>
                        <h1 className="text-lg font-semibold">DevArena Contest </h1>
                        <p>Contest every week. Compete and see your ranking!</p>
                    </div>
                </div>
                <Link href="/contest/my-contest">
                    <Button className="py-5 text-md bg-gradient-to-b from-pink_background to-pink_primary rounded-xl">
                        My contest
                    </Button>
                </Link>
            </div>
            <div className="pr-14 pl-10">
                <h1 className="text-lg font-medium py-4">Active Contest</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <ContestCard
                        title="ServiceNow Tech Hiring Challenge"
                        date="Dec 8, 2024 9:30 AM GMT+7"
                        countdown="4d 20h 45m 12s"
                        buttonText="Join"
                        onClick={() => {
                            router.push(`/contest/servicenow-tech-hiring-challenge`);
                        }}
                    />
                    <ContestCard
                        title="Hackathon Challenge 2024"
                        date="Dec 15, 2024 10:00 AM GMT+7"
                        countdown="11d 18h 30m 45s"
                        buttonText="Join"
                        onClick={() => {}}
                    />
                </div>
            </div>
            <div className="pb-8 pr-14 pl-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-medium py-4">Past Contest</h1>
                    <Link href="/contest/past-contest" className="text-sm hover:text-pink_primary">
                        View All
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                    <ContestCard
                        title="ServiceNow Tech Hiring Challenge"
                        date="Dec 8, 2024 9:30 AM GMT+7"
                        buttonText="Join"
                        onClick={() => {}}
                    />
                    <ContestCard
                        title="Hackathon Challenge 2024"
                        date="Dec 15, 2024 10:00 AM GMT+7"
                        buttonText="Join"
                        onClick={() => {}}
                    />
                    <ContestCard
                        title="Hackathon Challenge 2024"
                        date="Dec 15, 2024 10:00 AM GMT+7"
                        buttonText="Join"
                        onClick={() => {}}
                    />
                    <ContestCard
                        title="ServiceNow Tech Hiring Challenge"
                        date="Dec 8, 2024 9:30 AM GMT+7"
                        buttonText="Join"
                        onClick={() => {}}
                    />
                    <ContestCard
                        title="Hackathon Challenge 2024"
                        date="Dec 15, 2024 10:00 AM GMT+7"
                        buttonText="Join"
                        onClick={() => {}}
                    />
                    <ContestCard
                        title="Hackathon Challenge 2024"
                        date="Dec 15, 2024 10:00 AM GMT+7"
                        buttonText="Join"
                        onClick={() => {}}
                    />
                </div>
            </div>
        </>
    );
}
