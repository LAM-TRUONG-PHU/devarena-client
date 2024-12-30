import { ICourse } from "./ICourse";
import { IExerciseStatus } from "./IExerciseStatus";

export interface ICourseStatus {
    courseId: ICourse,
    _id: string,
    status: string,
    progress: number,
    exerciseStatuses: IExerciseStatus[]| null

}