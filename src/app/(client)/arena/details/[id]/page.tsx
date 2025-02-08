"use client";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { fetchExerciseCard } from "@/redux/slices/contestClientSlice";
import { IContest } from "@/types/IContest";
import { useRouter } from "next/navigation";
import { useEffect, use, useState } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function ArenaDetailsPage({ params }: Props) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [contest, setContest] = useState<IContest | null>(null);
  const axiosInstance = usePrivate();
    const router = useRouter();
  useEffect(() => {
    axiosInstance.get(`/contest-description/${id}`).then((res) => {
      setContest(res.data.data);
    });
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <button className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
          <span>←</span> Back to Contest
        </button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {contest?.contestName}
        </h1>
        <button className="bg-yellow-200 px-6 py-2 rounded-md hover:bg-yellow-300 transition-colors"
         onClick={() => {
            const currentPath = window.location.pathname;
            router.push(`${currentPath}/exercises?id=${id}`);
          }}>
          Go to Exercise
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="prose max-w-none">
        <div 
            className="text-gray-700 mb-6"
            dangerouslySetInnerHTML={{ __html: contest?.description || '' }}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-gray-600">Start Date:</p>
              <p>{new Date(contest?.startDate || "").toLocaleString()}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">End Date:</p>
              <p>{new Date(contest?.endDate || "").toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
