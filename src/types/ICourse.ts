export interface ICourse {
  _id: string;
  title: string;
  language: string;
  totalExercises: number;
}

export interface ICourseStatus {
  _id: string;
  userId: string;
  courseId: string;
  status: string;
}
