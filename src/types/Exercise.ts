export interface ITestCase {
    input: Record<string, string | number | any[]>; // Flexible key-value mapping
    output: string | number | any[]; // Allow flexible output types
    hidden: boolean;
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
}
