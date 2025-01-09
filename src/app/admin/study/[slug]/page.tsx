"use client";
// import { CodingExerciseForm } from "@/components/admin/CodingExerciseForm";
import { TableExercise } from "@/components/admin/study/TableExercise";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchExercisesByCourse } from "@/redux/slices/admin/exerciseStudySlice";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useMemo } from "react";
const page = ({ params }: { params: Promise<{ slug: string }> }) => {
    const dispatch = useAppDispatch();
    const axiosPrivate = usePrivate();
    const { exercises, loading } = useAppSelector((state) => state.exercises);
    const searchParams = useSearchParams();
    const { status } = useSession();
    const courseId = useMemo(() => searchParams.get("id"), [searchParams]);

    useEffect(() => {
        if (status === "authenticated" && courseId) {
            // Check if data for the specific courseId is already available
            const isDataAlreadyFetched = exercises.some((exercise) => exercise.courseId === courseId);

            if (!isDataAlreadyFetched) {
                dispatch(fetchExercisesByCourse({ axiosInstance: axiosPrivate, courseId }));
            }
        }
    }, [status, courseId, dispatch, axiosPrivate]);


    return (
        <div>
            {/* <CodingExerciseForm language={slug}/> */}
            <div className="p-8">
                <TableExercise exercises={exercises} loading={loading} />
            </div>
        </div>
    );
};

export default page;
