"use client";
import React, { use, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createContest } from "@/redux/slices/contestSlice";
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
            <div>
                <h1>Contests</h1>
                <button
                    onClick={() =>
                        dispatch(
                            createContest({
                                _id: autoGenerateId(),
                                title: "Contest 1",
                                description: "Description 1",
                                startDate: "2021-10-10",
                                endDate: "2021-10-20",
                                imageUrl: "https://via.placeholder.com/150",
                                status: "active",
                                participants: 0,
                            })
                        )
                    }
                >
                    Create Contest
                </button>
                <div>
                    {contests.map((contest) => (
                        <div key={contest._id}>
                            <h2>{contest.title}</h2>
                            <p>{contest.description}</p>
                            <p>{contest.startDate}</p>
                            <p>{contest.endDate}</p>
                            <p>{contest.imageUrl}</p>
                            <p>{contest.status}</p>
                            <p>{contest.participants}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
