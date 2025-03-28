"use client";
import React, { use, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createContest,
  fetchIncomingContests,
  fetchPastContests,
} from "@/redux/slices/contestClientSlice";
import Image from "next/image";
import ContestCard from "@/components/contest/contest-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { usePrivate } from "@/hooks/usePrivateAxios";
export default function ContestPage() {
  const { inCommingContests, pastContests, incomingLoading, pastLoading } =
    useAppSelector((state) => state.contestClient);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const axiosInstance = usePrivate();
  useEffect(() => {
    dispatch(fetchIncomingContests({ axiosInstance: axiosInstance }));
    dispatch(fetchPastContests({ axiosInstance: axiosInstance }));
  }, [dispatch]);

  const autoGenerateId = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  return (
    <>
      <div className="flex shrink-0 items-center justify-between pr-14 pl-10 py-6 bg-white shadow-sm">
        <div className="flex gap-4">
          <Image
            src="/trophy.png"
            alt="logo"
            width={36}
            height={36}
            className="object-contain"
          />
          <div>
            <h1 className="text-lg font-semibold">DevArena Contest </h1>
            <p>Contest every week. Compete and see your ranking!</p>
          </div>
        </div>
        <Link href="/arena/my-contest">
          <Button className="py-5 text-md bg-gradient-to-b from-pink_background to-pink_primary rounded-xl">
            My contest
          </Button>
        </Link>
      </div>
      <div className="pr-14 pl-10">
        <h1 className="text-lg font-medium py-4">Active Contest</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {/* <ContestCard
            title="ServiceNow Tech Hiring Challenge"
            date="Dec 8, 2024 9:30 AM GMT+7"
            countdown="4d 20h 45m 12s"
            buttonText="Join"
            onClick={() => {
              router.push(`/arena/servicenow-tech-hiring-challenge`);
            }}
          />
          <ContestCard
            title="Hackathon Challenge 2024"
            date="Dec 15, 2024 10:00 AM GMT+7"
            countdown="11d 18h 30m 45s"
            buttonText="Join"
            onClick={() => {}}
          /> */}
          {inCommingContests.map((contest) => (
            <ContestCard
              status={contest.status}
              key={contest._id}
              title={contest.contestName}
              date={contest.startDate}
              buttonText="Join"
              id={contest._id}
              
            />
          ))}
        </div>
      </div>
      <div className="pb-8 pr-14 pl-10">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-medium py-4">Past Contest</h1>
          <Link
            href="/arena/past-contest"
            className="text-sm hover:text-pink_primary"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <ContestCard
            status="completed"
            title="ServiceNow Tech Hiring Challenge"
            date="Dec 8, 2024 9:30 AM GMT+7"
            buttonText="Join"
            id="123"
          />
          <ContestCard

            status="completed"
            title="Hackathon Challenge 2024"
            date="Dec 15, 2024 10:00 AM GMT+7"
            buttonText="Join"
            id="123"
          />
          <ContestCard
          id="kdkd"
            status="completed"
            title="Hackathon Challenge 2024"
            date="Dec 15, 2024 10:00 AM GMT+7"
            buttonText="Join"
          />
        </div>
      </div>
    </>
  );
}
