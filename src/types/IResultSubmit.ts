import { ITestCase } from "./Exercise";

export interface IResultSubmit {
    status?: number;
    compareTime?: number;
    totalRuntime?: number;
    testcase?: ITestCase;
    result: string;
}
