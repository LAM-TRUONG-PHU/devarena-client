'use client'
import React, { use, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { createContest } from '@/redux/slices/contestSlice';
export default function AdminContestPage() {
    const { contests } = useAppSelector((state) => state.contest);
    const dispatch = useAppDispatch();
    useEffect(() => {
        console.log(contests);
    }, [contests]);

    return (
        <>
            <div>
                <h1>Contests</h1>
                <button onClick={() => dispatch(createContest({
                    _id: "1",
                    title: "Contest 1",
                    description: "Description 1",
                    startDate: "2021-10-10",
                    endDate: "2021-10-20",
                    imageUrl: "https://via.placeholder.com/150",
                    status: "active",
                    participants: 0,
                }))}>Create Contest</button>
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
    )
}
