"use client";
import { Progress } from "@/components/ui/progress";
import { ELanguages } from "@/types/language";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Trophy } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { C, Java, Cpp } from "@/components/mastery";
import ExerciseCard from "@/components/study/exercise-card";
import { EDifficulty, ESkills, EStatus, Sort } from "@/components/sort";
import useStatusFilter from "@/hooks/filter/use-status-filter";
import useDifficultyFilter from "@/hooks/filter/use-difficulty-filter";
import { MainFilter } from "@/components/filter";
import useMainFilter from "@/hooks/filter/use-filter";
import useSkillsFilter from "@/hooks/filter/use-skills-filter";
import { isValidLanguage } from "@/utils/is-valid-language";
import { getLanguageTitle } from "@/utils/get-language-title";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { IExerciseStatus } from "@/types/IExerciseStatus";
import { ICourseStatus } from "@/types/ICourseStatus";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setCourseStatus,
  setExerciseSelected,
} from "@/redux/slices/ExerciseStatusSlice";
import { createSlug } from "@/lib/helper";
import { useSession } from "next-auth/react";
import { IExercise } from "@/types/Exercise";
import { set } from "store";
import { capitalize } from "@/utils/capitalize";
import DialogLoading from "@/components/dialog-loading";

export type SortOptionTitle = "Filter" | "Status" | "Skills" | "Difficulty";

export default function LanguagePage() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const statusFilter = useStatusFilter();
  const difficultyFilter = useDifficultyFilter();
  const skillsFilter = useSkillsFilter();
  const mainFilter = useMainFilter();
  const router = useRouter();
  // const [courseStatus, setCourseStatus] = useState<ICourseStatus|null>(null)
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const axiosPrivate = usePrivate();
  const { data: session, status } = useSession();
  const [courseTitle, setCourseTitle] = useState("");
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const language = capitalize(segments[1]);
  const [exercises, setExercises] = useState<(IExercise & {
    status: EStatus
  })[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<(IExercise & {
    status: EStatus
  })[]>([]);

  useEffect(() => {
    const getExercisesByUserAndCourse = async () => {
      try {
        if (status === "authenticated") {
          await axiosPrivate
            .get(`/study/course/${courseId}/user/${session?.user.id}`)
            .then((res) => {
              setCourseTitle(res.data.data.courseTitle);
              const { exercisesStatus }: { exercisesStatus: IExerciseStatus[] } = res.data.data
              setExercises(res.data.data.exercisesByCourse.map((exercise: IExercise) => {
                const exerciseStatus = exercisesStatus.find((exercisesStatus) => exercisesStatus.exerciseId == exercise._id)

                if (exerciseStatus == undefined) {
                  return { ...exercise, status: EStatus.Unsolved }
                } else {
                  return { ...exercise, status: exerciseStatus.status == "completed" ? EStatus.Solved : EStatus.InProgress }
                }
              }));
              setLoading(false);

            })
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching exercises:", error);
      }

    }


    getExercisesByUserAndCourse();

  }, [axiosPrivate, dispatch, status]);
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

      <div className="flex shrink-0 items-center justify-between lg:pr-14 lg:pl-10  py-6 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="md:size-24 size-20">
            {language === ELanguages.C && (
              <C.TierFinal />
            )}
            {language === ELanguages.Java && (
              <Java.TierFinal />
            )}
            {language === ELanguages.Cpp && (
              <Cpp.TierFinal />
            )}
          </div>
          <h1 className="md:text-2xl font-semibold text-lg">
            {loading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="size-6 animate-spin" />
              </div>
            ) : (<>{courseTitle}</>)}
          </h1>
        </div>
        <div className="space-y-1 scale-90 lg:scale-100">
          <div className="text-sm">
            <span className="text-pink_primary">17 more points</span> to get
            your this mastery!
          </div>
          <div className="flex justify-between items-center">
            <Progress value={50} />
            <div className="text-xs ml-2">50%</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="aspect-square rounded-full border border-foreground w-fit items-center flex text-xs p-1  font-semibold   ">
                0/25
              </div>
            </div>
            <div className="size-10">
              {language === ELanguages.C && (
                <C.TierOne />
              )}
              {language === ELanguages.Java && (
                <Java.TierOne />
              )}
              {language === ELanguages.Cpp && (
                <Cpp.TierOne />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:pr-14 lg:pl-10 px-8 pt-4 pb-8 space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MainFilter
            title="Filter"
            menuItems={[]}
            applyFilter={mainFilter.applyMainFilter}
          />
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
          <div className="flex justify-center items-center">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : (<>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-5">

            {filteredExercises.filter((exercise) => exercise.status == EStatus.InProgress).map((exercise) => (
              <ExerciseCard
                key={exercise._id}
                language={language}
                title={exercise.title}
                tags={exercise.tags}
                onClick={() => {
                  router.push(`/study/${segments[1]}/${createSlug(exercise.title)}?id=${exercise._id}`);
                }} status={exercise.status}
                score={exercise.score}
                difficulty={exercise.difficulty as EDifficulty}
              />
            ))}


          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExercises.filter((exercise) => { return exercise.status == EStatus.Unsolved || exercise.status == EStatus.Solved })
              .sort((a, b) => {
                if (a.status === EStatus.Solved && b.status !== EStatus.Solved) return -1;
                if (a.status !== EStatus.Solved && b.status === EStatus.Solved) return 1;
                return 0;
              })
              .map((exercise) => (
                <ExerciseCard
                  key={exercise._id}
                  language={language}
                  title={exercise.title}
                  tags={exercise.tags}
                  onClick={() => {
                    router.push(`/study/${segments[1]}/${createSlug(exercise.title)}?id=${exercise._id}`)
                  }}
                  status={exercise.status === EStatus.Solved ? "completed" : ""}
                  score={exercise.score}
                  difficulty={exercise.difficulty as EDifficulty}
                />
              ))}
          </div></>)}


      </div>
    </>
  );
}
