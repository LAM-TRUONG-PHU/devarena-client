"use client";
// import { CodingExerciseForm } from "@/components/admin/CodingExerciseForm";
import { ExerciseCreate } from "@/components/admin/study/ExerciseCreate";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { use, useEffect } from "react";
import { fetchExercises } from "@/redux/slices/admin/exerciseSlice";
import { usePrivateAxios } from "@/hooks/use-private-axios";
import { TableExercise } from "@/components/admin/study/TableExercise";
import { CodingExerciseForm } from "@/components/admin/study/CodingExerciseForm";
import { useForm } from "react-hook-form";
const page = ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = use(params); // Unwrap the params to get the slug
    const dispatch = useAppDispatch();
    const axiosPrivate = usePrivateAxios();
    const { exercises } = useAppSelector((state) => state.exercises);
    const form = useForm();
    useEffect(() => {
        dispatch(fetchExercises({ axiosInstance: axiosPrivate }));
    }, []);

    return (
        <div>
            {/* <CodingExerciseForm language={slug}/> */}
            <div className="p-8">
                <TableExercise exercises={exercises} />
            </div>
        </div>
    );
};

export default page;
