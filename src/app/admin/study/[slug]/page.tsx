"use client";
// import { CodingExerciseForm } from "@/components/admin/CodingExerciseForm";
import { TableExercise } from "@/components/admin/study/TableExercise";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchExercises } from "@/redux/slices/admin/exerciseStudySlice";
import { use, useEffect, useMemo } from "react";
const page = ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = use(params); // Unwrap the params to get the slug
    const dispatch = useAppDispatch();
    const axiosPrivate = usePrivate();
    const { exercises, loading } = useAppSelector((state) => state.exercises);

    useEffect(() => {
        if (!exercises.length) {
            dispatch(fetchExercises({ axiosInstance: axiosPrivate }));
        }
    }, [axiosPrivate, dispatch, exercises.length]);



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
