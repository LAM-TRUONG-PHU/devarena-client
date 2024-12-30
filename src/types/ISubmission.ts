export interface ISubmission {
    _id: string;
    code: string;
    status: "pending" | "processing" | "completed" | "failed";
    score?: number;
    isPublic: boolean;

}
