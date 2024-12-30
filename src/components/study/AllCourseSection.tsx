'use client'
import React from "react";
import { ICourse } from "@/types/ICourse";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudyCard from "./study-card";
import { useSession } from "next-auth/react";

const AllCourseSection = () => {
  const axios = usePrivate();
  const router = useRouter();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {data:session}=useSession()
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/course");
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
  const enrolledCourses = async(courseId:string):Promise<string>=>{
    const response = await axios.post("/course-status/enroll",{
       userId:session?.user.id,
       courseId
    }).then((res)=>{
      return res.data.data._id
    }).catch((err)=>{
      console.log(err)
    })
    return response
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        courses.map((course) => (
          <StudyCard
            key={course._id}
            onClick={async() =>{
              const courseStautusId = await enrolledCourses(course._id)
              router.push(`/study/${courseStautusId}`)
            } }
            language={course.language}
            exercises={course.totalExercises || 0}
          />
        ))
      )}
    </div>
  );
};

export default AllCourseSection;
