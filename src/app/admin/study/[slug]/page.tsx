"use client";
// import { CodingExerciseForm } from "@/components/admin/CodingExerciseForm";
import { TableExercise } from "@/components/admin/study/TableExercise";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchExercisesByCourse } from "@/redux/slices/admin/exerciseStudySlice";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import router from "next/router";
import { useRouter } from "next/navigation"
import { use, useEffect, useMemo } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { TableAchievement } from "@/components/admin/study/TableAchievement";
import { fetchAchievementsByRefId } from "@/redux/slices/achievementSlice";
const page = ({ params }: { params: Promise<{ slug: string }> }) => {
    const dispatch = useAppDispatch();
    const axiosPrivate = usePrivate();
    const { exercises, loading } = useAppSelector((state) => state.exercises);
    const { achievements } = useAppSelector((state) => state.achievement);
    const searchParams = useSearchParams();
    const { status } = useSession();
    const courseId = useMemo(() => searchParams.get("id"), [searchParams]);
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated" && courseId) {
            // Check if data for the specific courseId is already available
            const isDataAlreadyFetched = exercises.some((exercise) => exercise.courseId === courseId);

            if (!isDataAlreadyFetched) {
                dispatch(fetchExercisesByCourse({ axiosInstance: axiosPrivate, courseId }));
                dispatch(fetchAchievementsByRefId({ axiosInstance: axiosPrivate, refId: courseId }));
            }
        }
    }, [status, courseId, dispatch, axiosPrivate]);

    return (
        <div>
            {/* <CodingExerciseForm language={slug}/> */}
            <div className="p-8 relative">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        router.back();
                    }}
                    className="absolute left-12 top-8 transform -translate-y-10 p-0 w-8 h-8 rounded-full"
                >
                    <IoIosArrowRoundBack className="w-10 h-10" />
                </Button>
                <Tabs defaultValue="exercise" >
                    <TabsList className="grid w-fit grid-cols-2 mx-auto px-4 gap-4">
                        <TabsTrigger value="exercise">Exercise</TabsTrigger>
                        <TabsTrigger value="achievement">Achievement</TabsTrigger>
                    </TabsList>
                    <TabsContent value="exercise">
                        <TableExercise exercises={exercises} loading={loading} />

                    </TabsContent>
                    <TabsContent value="achievement">
                        <TableAchievement achievements={achievements} loading={false} />
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    );
};

export default page;
