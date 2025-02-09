export enum StatusCompile {
    COMPILE_SUCCESS = "COMPILE_SUCCESS",
    COMPILE_FAILED = "COMPILE_FAILED",
    COMPILE_RUNNING = "COMPILE_RUNNING",
    COMPILE_WAITING = "COMPILE_WAITING",
}
export interface ITestCase {
    _id: string
    input: Record<string, string | number | any[]>[]; // Flexible key-value mapping
    output?: string; // Allow flexible output types
    hidden?: boolean;
    statusCompile?: StatusCompile;
    outputExpected?: string
}

export interface IDefaultSolutionCode {
    code: string
    language: string
}


export interface IPersistTestCase {
    _id: string
    input: Record<string, string | number | any[]>[];
}

export interface IExercise {
    _id?: string;
    language?: string;
    difficulty: string;
    title: string;
    content: string;
    tags: string[];
    variableName?: string[];
    testcases?: ITestCase[];
    score?: number;
    defaultCode?: string;
    solution?: string;
    courseId?: string;

}
export interface IAlgoExercise {
    _id?: string;
    language?: string;
    difficulty: string;
    title: string;
    content: string;
    tags: string[];
    variableName?: string[];
    testcases?: ITestCase[];
    score?: number;
    defaultCode?: IDefaultSolutionCode[]
    solutions?: IDefaultSolutionCode[]
    courseId?: string;
}
export interface IContestExercise {
    _id: string;
    contestId: string;
    difficulty: string;
    title: string;
    content: string;
    score: number;
    defaultCode: ICode;
    solutions: ICode;
    testcases?: ITestCase[];


}
interface ICode {
    language: string;
    code: string;
}
export type TExerciseStudy = {
    title: string;
    content: string;
    difficulty: string;
    tags: string[];
    testcases: {
        input: Record<string, any>[];
        hidden: boolean;
        outputExpected?: any;
    }[];
    defaultCode: string;
    solution: string;
    courseId: string;
    score: number;
};
export type TExerciseArena = {
  title: string;
  content: string;
  difficulty: string;
  tags: string[];
  testcases: {
    input: Record<string, any>[];
    hidden: boolean;
    outputExpected?: any;
  }[];
  // defaultCode: string;
  // solution: string;
  defaultCode: {
    code: string;
    language: string;
  }[];
  solutions: {
    code: string;
    language: string;
  }[];
  contestId: string;
  score: number;
};