"use client";
// import { CodingExerciseForm } from "@/components/admin/CodingExerciseForm";
import { ButtonCreateDialog } from "@/components/admin/study/ButtonCreateDialog";
import StudyCard from "@/components/study/study-card";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { ELanguages } from "@/types/language";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface ICourse {
  _id: string;
  title: string;
  language: ELanguages;
  totalExercises: number;
}

export default function AdminStudyPage() {
  const router = useRouter();
  const axiosPrivate = usePrivate();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get("/course");
        console.log(response.data.data);
        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="w-full h-full relative">
      <div className="lg:pr-14 lg:pl-10 px-8 pt-4 pb-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <StudyCard
              key={course._id}
              onClick={() => {
                router.push(`/admin/study/${course.language}?id=${course._id}`);
              }}
              language={course.language}
              exercises={course.totalExercises}
            />
          ))}
        </div>
      </div>
      {/* Add this ButtonCreateDialog positioned at the bottom-left */}
      <div className="absolute bottom-0 right-0 p-4">
        <ButtonCreateDialog />
      </div>
    </div>
  );
}
