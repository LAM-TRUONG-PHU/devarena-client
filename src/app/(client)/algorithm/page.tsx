"use client";
import { AlertAchievementDialog } from "@/components/alert-achievement-dialog";
import { MainFilter } from "@/components/filter";
import { C, Cpp, Java, Algorithm } from "@/components/mastery";
import { Sort, EStatus, EDifficulty, ESkills } from "@/components/sort";
import ExerciseCard from "@/components/study/exercise-card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import useDifficultyFilter from "@/hooks/filter/use-difficulty-filter";
import useMainFilter from "@/hooks/filter/use-filter";
import useSkillsFilter from "@/hooks/filter/use-skills-filter";
import useStatusFilter from "@/hooks/filter/use-status-filter";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { createSlug } from "@/lib/helper";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAchievementsByRefId, fetchAchievementsByRefIdAndRequiredScore } from "@/redux/slices/achievementSlice";
import { fetchAlgoExercises } from "@/redux/slices/admin/exerciseStudySlice";
import { IExercise } from "@/types/Exercise";
import { IExerciseStatus } from "@/types/IExerciseStatus";
import { ELanguages } from "@/types/language";
import { getLanguageTitle } from "@/utils/get-language-title";
import { isValidLanguage } from "@/utils/is-valid-language";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

export default function AlgorithmPage() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const statusFilter = useStatusFilter();
    const difficultyFilter = useDifficultyFilter();
    const skillsFilter = useSkillsFilter();
    const mainFilter = useMainFilter();
    const router = useRouter();
    const { data: session, status } = useSession();
    const axiosPrivate = usePrivate();
    const dispatch = useAppDispatch();
    const [exercises, setExercises] = useState<(IExercise & {
        status: EStatus
    })[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredExercises, setFilteredExercises] = useState<(IExercise & {
        status: EStatus
    })[]>([]);
    const { achievement, yourPreAchievement } = useAppSelector((state) => state.achievement)
    const baseImageURL = `${process.env.NEXT_PUBLIC_BACKEND_UPLOAD_URL}/achievements`;
    const totalSolvedScore = exercises.reduce((total, exercise) => {
        return exercise.status === EStatus.Solved ? total + exercise.score! : total;
    }, 0);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        if (yourPreAchievement) {
            setOpen(true);
        }
    }, [yourPreAchievement])
    useEffect(() => {
        const getExercisesByUserAndCourse = async () => {
            try {
                if (status === "authenticated") {
                    const response = await axiosPrivate.get(
                        `/algorithm/user/${session?.user.id}`
                    );

                    console.log("response", response.data.data);


                    const { exercisesStatus }: { exercisesStatus: IExerciseStatus[] } =
                        response.data.data;

                    const exercisesWithStatus = response.data.data.exercises.map(
                        (exercise: IExercise) => {
                            const exerciseStatus = exercisesStatus.find(
                                (exercisesStatus) => exercisesStatus.exerciseId == exercise._id
                            );

                            if (exerciseStatus == undefined) {
                                return { ...exercise, status: EStatus.Unsolved };
                            } else {
                                return {
                                    ...exercise,
                                    status:
                                        exerciseStatus.status == "completed"
                                            ? EStatus.Solved
                                            : EStatus.InProgress,
                                };
                            }
                        }
                    );

                    setExercises(exercisesWithStatus);

                    const totalSolvedScore = exercisesWithStatus.reduce(
                        (total: number, exercise: IExercise & { status: EStatus }) =>
                            exercise.status === EStatus.Solved
                                ? total + exercise.score!
                                : total,
                        0
                    );


                    // Dispatch the action with the calculated requiredScore
                    dispatch(
                        fetchAchievementsByRefIdAndRequiredScore({
                            axiosInstance: axiosPrivate,
                            id: "algorithm",
                            totalSolvedScore
                        })
                    );


                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                console.error("Error fetching exercises:", error);
            }
        };
        getExercisesByUserAndCourse();
    }, [status]);

    // useEffect(() => {
    //     console.log("yourPreAchievement", yourPreAchievement);
    //     if (yourPreAchievement) {
    //       setOpen(true);
    //     }
    //   }, [yourPreAchievement]);

    useEffect(() => {
        const applyFilters = () => {
            let filtered = [...exercises];

            // Apply Status Filter
            if (statusFilter.selected.length) {
                filtered = filtered.filter((exercise) =>
                    statusFilter.selected.includes(exercise.status)
                );
            }

            // Apply Difficulty Filter
            if (difficultyFilter.selected.length) {
                filtered = filtered.filter((exercise) =>
                    difficultyFilter.selected.includes(exercise.difficulty as EDifficulty)
                );
            }

            // Apply Skills Filter
            if (skillsFilter.selected.length) {
                filtered = filtered.filter((exercise) =>
                    skillsFilter.selected.some((skill) => exercise.tags.includes(skill))
                );
            }


            setFilteredExercises(filtered);
        };
        applyFilters();
    }, [statusFilter.selected, difficultyFilter.selected, skillsFilter.selected, exercises]);
    return (
        <>
            <AlertAchievementDialog open={open} onOpenChange={setOpen} yourPreAchievement={yourPreAchievement} />

            <div className="flex shrink-0 items-center justify-between lg:px-14  py-6 bg-white shadow-sm">
                <div className="">
                    <div className="text-center text-xl text-black font-semibold">
                        Welcome to DevArena's Algorithm Section! 🚀{" "}
                    </div>
                    <div className="text-center">
                        Dive into the world of problem-solving and coding challenges to enhance <br /> your
                        skills. Whether you're just starting or sharpening your expertise, there's <br />
                        something here for everyone.
                    </div>
                </div>

                <div className="space-y-1 scale-90 lg:scale-100">
                    <div className="text-sm">
                        <span className="text-pink_primary">{
                            achievement?.requiredScore! - totalSolvedScore
                        } more points</span> to get
                        your this mastery!
                    </div>
                    <div className="flex justify-between items-center">
                        <Progress value={totalSolvedScore * 100 / achievement?.requiredScore!} />
                        <div className="text-xs ml-2">
                            {totalSolvedScore * 100 / achievement?.requiredScore!}%
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <div className="aspect-square rounded-full border border-foreground w-fit items-center flex text-xs p-1  font-semibold   ">
                                {totalSolvedScore}/{achievement?.requiredScore}
                            </div>
                        </div>
                        <div className="size-10">
                            <img src={`${baseImageURL}/${achievement?.image}`} alt="achievement" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:pr-14 lg:pl-10 px-8 pt-4 pb-8 space-y-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MainFilter title="Filter" menuItems={[]} applyFilter={mainFilter.applyMainFilter} />
                    <Sort<EStatus>
                        title="Status"
                        menuItems={statusFilter.menuItems}
                        applyFilter={statusFilter.applyStatusFilter}
                        selected={statusFilter.selected}
                    />
                    <Sort<EDifficulty>
                        title="Difficulty"
                        menuItems={difficultyFilter.menuItems}
                        applyFilter={difficultyFilter.applyDifficultyFilter}
                        selected={difficultyFilter.selected}
                    />
                    <Sort<ESkills>
                        title="Skills"
                        menuItems={skillsFilter.menuItems}
                        applyFilter={skillsFilter.applySkillsFilter}
                        selected={skillsFilter.selected}
                    />
                </div>

                {loading ? (
                    <div className="pr-14 pl-10 pb-8 space-y-20">
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"

                        >
                            <Skeleton className="flex items-center w-full h-40 justify-center whitespace-nowrap rounded-xl px-3 py-1  font-medium ring-offset-background" />
                            <Skeleton className="flex items-center w-full h-40 justify-center whitespace-nowrap rounded-xl px-3 py-1  font-medium ring-offset-background" />
                            <Skeleton className="flex items-center w-full h-40 justify-center whitespace-nowrap rounded-xl px-3 py-1  font-medium ring-offset-background" />
                            <Skeleton className="flex items-center w-full h-40 justify-center whitespace-nowrap rounded-xl px-3 py-1  font-medium ring-offset-background" />
                            <Skeleton className="flex items-center w-full h-40 justify-center whitespace-nowrap rounded-xl px-3 py-1  font-medium ring-offset-background" />
                            <Skeleton className="flex items-center w-full h-40 justify-center whitespace-nowrap rounded-xl px-3 py-1  font-medium ring-offset-background" />



                        </div>
                    </div>
                ) : (<>
                    {filteredExercises.some((exercise) => exercise.status === EStatus.InProgress) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-5">
                            {filteredExercises
                                .filter((exercise) => exercise.status === EStatus.InProgress)
                                .map((exercise) => (
                                    <ExerciseCard
                                        key={exercise._id}
                                        language={ELanguages.Unknown}
                                        title={exercise.title}
                                        tags={exercise.tags}
                                        onClick={() => {
                                            router.push(`/algorithm/${createSlug(exercise.title)}?id=${exercise._id}`);
                                        }}
                                        status={exercise.status}
                                        score={exercise.score}
                                        difficulty={exercise.difficulty as EDifficulty}
                                    />
                                ))}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredExercises
                            .filter((exercise) => exercise.status === EStatus.Unsolved || exercise.status === EStatus.Solved)
                            .sort((a, b) => {
                                if (a.status === EStatus.Solved && b.status !== EStatus.Solved) return -1;
                                if (a.status !== EStatus.Solved && b.status === EStatus.Solved) return 1;
                                return 0;
                            })
                            .map((exercise) => (
                                <ExerciseCard
                                    key={exercise._id}
                                    language={ELanguages.Unknown}
                                    title={exercise.title}
                                    tags={exercise.tags}
                                    onClick={() => {
                                        router.push(`/algorithm/${createSlug(exercise.title)}?id=${exercise._id}`);
                                    }}
                                    status={exercise.status === EStatus.Solved ? "completed" : ""}
                                    score={exercise.score}
                                    difficulty={exercise.difficulty as EDifficulty}
                                />
                            ))}
                    </div>
                </>)}

            </div>
        </>
    );
}
