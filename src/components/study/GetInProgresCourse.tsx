"use client";
import { ICourseStatus } from "@/types/ICourseStatus";
import { usePrivate } from "@/hooks/usePrivateAxios";
import React, { useEffect, useState } from "react";
import InProcessingCard from "./in-processing-card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const GetInProgresCourse = () => {
  const axiosPrivate = usePrivate();
  const [courseStatusList, setCourseStatusList] = useState<ICourseStatus[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    const getCourseStatus = async () => {
      try {
        const response = await axiosPrivate
          .get(`/course-status/user/${session?.user.id}`)
          .then((res) => {
            console.log(res.data.data);
            setCourseStatusList(res.data.data);
          });
      } catch (error) {
        console.error("Error fetching course status:", error);
      }
    };
    if (status === "authenticated") {
      console.log("seession");
      console.log(session);
      console.log(status);
      getCourseStatus();
    }
  }, [status]);

  return (
    // <div>
    //   {courseStatusList.map((course) => (
    //     <div key={course.id}>{/* Hiển thị thông tin khóa học */}</div>
    //   ))}
    // </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* <InProcessingCard language={ELanguages.C} exercises={82} onClick={() => {}} />
    <InProcessingCard language={ELanguages.C} exercises={82} onClick={() => {}} /> */}
      {courseStatusList.map((course) => (
        <InProcessingCard
          key={course._id}
          language={course.courseId.language}
          exercises={course.courseId.totalExercises}
          progress={course.progress}
          onClick={() => {}}
        />
      ))}
    </div>
  );
};

export default GetInProgresCourse;
