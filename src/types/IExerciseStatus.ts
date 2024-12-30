import { IExercise } from "./Exercise";
import { ISubmission } from "./ISubmission";

export interface IExerciseStatus {
    _id: string;
    submissions: ISubmission[]
    status: string;
    exerciseId: IExercise;
}