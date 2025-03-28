import { C } from "@/components/mastery";
import { IExercise, IPersistTestCase, ITestCase, StatusCompile } from "@/types/Exercise";
import { ICompileRes } from "@/types/ICompileRes";
import { IExerciseStatus } from "@/types/IExerciseStatus";
import { IResultSubmit } from "@/types/IResultSubmit";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { set } from "store";

interface ISubmission {
    status: "accepted" | "wrong answer" | "compile error";
    score: number;
    result: string;
    createdAt: string;
    totalTime: number;
    code: string;
    _id?: string;
    testcase?: ITestCase;
    errorCode?: string;
}

interface ExerciseState {
    exercises: IExercise[];
    exercise: IExercise;
    persistTestCases: { [key: string]: IPersistTestCase[] };
    testCases: { [key: string]: ITestCase[] };
    testCasesResult: { [key: string]: ITestCase[] };
    currentExercise: IExercise | null;
    exerciseStatus: IExerciseStatus;
    loading: boolean;
    error: string | null;
    loadingTestCase: boolean;
    subList: ISubmission[];
    submission: ISubmission | {};
    submissionId: string;
    loadingSubList: boolean;
    compile: "Accepted" | "Compile Error" | "Test Result" | "Wrong Answer" | null;
    code: { [key: string]: string };
    resultSubmit: IResultSubmit & {
        submittedAt: string;
        codeFailed?: string;
    };
    clickTracker: number;
    activeResultTab: string;
    activeTestcaseTab: string;
    activeTab: string;
}

interface IExercisePayload {
    data: IExercise[];
}

const initialState: ExerciseState = {
    exercises: [],
    exercise: {} as IExercise,
    testCases: {},
    persistTestCases: {},
    testCasesResult: {},
    currentExercise: null,
    exerciseStatus: {} as IExerciseStatus,
    loading: false,
    error: null,
    loadingTestCase: false,
    loadingSubList: false,
    subList: [],
    submission: {},
    submissionId: "",
    compile: null,
    code: {},
    resultSubmit: {} as IResultSubmit & { submittedAt: string },
    clickTracker: 0,
    activeResultTab: "",
    activeTestcaseTab: "",
    activeTab: "",
};

export const fetchExercises = createAsyncThunk<
    IExercisePayload,
    { axiosInstance: AxiosInstance; },
    { rejectValue: string }
>("course/fetchCoursesByCourse", async ({ axiosInstance, }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/algorithm`);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const fetchExercise = createAsyncThunk<
    IExercise,
    { axiosInstance: AxiosInstance; id: string },
    { rejectValue: string }
>("course/fetchCourse", async ({ axiosInstance, id }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/study/${id}`);
        return response.data.data;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const fetchExerciseStatus = createAsyncThunk<
    IExerciseStatus,
    { axiosInstance: AxiosInstance; userId: string; exerciseId: string },
    { rejectValue: string }
>("course/fetchExerciseStatus", async ({ axiosInstance, userId, exerciseId }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/exercise-status/user/${userId}/exercise/${exerciseId}`);
        return response.data.data;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

const exercisesAlgoSlice = createSlice({
    name: "exercise",
    initialState,
    reducers: {
        setAllTestCasesResultRunning: (state, action: PayloadAction<string>) => {
            const key = action.payload;
            console.log(key)
            if (state.testCasesResult[key]) {
                state.testCasesResult[key] = state.testCasesResult[key].map(testCase => ({
                    ...testCase,
                    statusCompile: StatusCompile.COMPILE_RUNNING,
                }));
            }
        },
        // set test cases rusult running if it is not running
        setEachTestCaseResultRunning: (state, action: PayloadAction<{ key: string, index: number }>) => {
            const { key, index } = action.payload;
            if (state.testCasesResult[key] && state.testCasesResult[key][index]) {
                state.testCasesResult[key][index] = {
                    ...state.testCasesResult[key][index],
                    statusCompile: StatusCompile.COMPILE_RUNNING,
                };
            }
        },
        updateStatusTestCaseResult: (
            state,
            action: PayloadAction<{
                key: string;
                testCaseId: string;
                status: StatusCompile;
            }>
        ) => {
            const { key, testCaseId, status } = action.payload;
            if (state.testCasesResult[key]) {
                state.testCasesResult[key] = state.testCasesResult[key].map(testCase =>
                    testCase._id === testCaseId
                        ? { ...testCase, statusCompile: status }
                        : testCase
                );
            }
        },

        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        addExercise(state, action: PayloadAction<IExercise>) {
            state.exercises.push(action.payload);
        },
        setCurrentExercise(state, action: PayloadAction<IExercise | null>) {
            state.currentExercise = action.payload;
        },
        setExercise(state, action: PayloadAction<IExercise>) {
            state.exercise = action.payload;
        },
        updateExercise(state, action: PayloadAction<IExercise>) {
            const index = state.exercises.findIndex((exercise) => exercise._id === action.payload._id);
            if (index !== -1) {
                state.exercises[index] = action.payload;
            }
        },
        deleteExercise(state, action: PayloadAction<string | undefined>) {
            state.exercises = state.exercises.filter((exercise) => exercise._id !== action.payload);
        },
        setTestCases: (state, action: PayloadAction<{ key: string; testCases: ITestCase[] }>) => {
            state.testCases[action.payload.key] = action.payload.testCases;
            state.persistTestCases[action.payload.key] = action.payload.testCases.map((testCase) => ({
                _id: testCase._id,
                input: testCase.input,
            }));
        },
        setTestCasesResult(state, action: PayloadAction<{ key: string; testCases: ITestCase[] }>) {
            state.testCasesResult[action.payload.key] = action.payload.testCases;
        },
        addTestCase: (state, action: PayloadAction<{ key: string; testCase: ITestCase }>) => {
            if (!state.testCases[action.payload.key] || !state.persistTestCases[action.payload.key]) {
                state.testCases[action.payload.key] = [];
                state.persistTestCases[action.payload.key] = [];
            }
            state.testCases[action.payload.key].push(action.payload.testCase);
            state.persistTestCases[action.payload.key].push({
                _id: action.payload.testCase._id,
                input: action.payload.testCase.input,
            });
        },
        removeTestCase: (state, action: PayloadAction<{ key: string; testCaseId: string }>) => {
            if (state.testCases[action.payload.key]) {
                state.testCases[action.payload.key] = state.testCases[action.payload.key].filter(
                    (testCase) => testCase._id !== action.payload.testCaseId
                );
                state.persistTestCases[action.payload.key] = state.persistTestCases[
                    action.payload.key
                ].filter((testCase) => testCase._id !== action.payload.testCaseId);
            }
        },
        setRunningTestCase: (state, action: PayloadAction<string>) => {
            const key = action.payload;
            if (state.testCasesResult[key]) {
                state.testCasesResult[key] = state.testCasesResult[key].map((testCase) => ({
                    ...testCase,
                    statusCompile: StatusCompile.COMPILE_RUNNING,
                }));
            }
        },
        updateStatusTestCase: (
            state,
            action: PayloadAction<{ key: string; index: number; res: ICompileRes }>
        ) => {
            const { key, index, res } = action.payload;
            if (state.testCasesResult[key] && state.testCasesResult[key][index]) {
                const testCase = state.testCasesResult[key][index];
                // Update the test case fields
                console.log("Update status test case:", res);
                testCase.statusCompile = res.isCorrect
                    ? StatusCompile.COMPILE_SUCCESS
                    : StatusCompile.COMPILE_FAILED;
                testCase.output = res.output;
                testCase.outputExpected = res.outputExpect;
            }
        },
        updateOutputCompiling: (
            state,
            action: PayloadAction<{
                key: string;
                output: string;
                index: number;
            }>
        ) => {
            const { key, output, index } = action.payload;
            if (state.testCasesResult[key] && state.testCasesResult[key][index]) {
                let result = ''
                if (state.testCasesResult[key][index].output) {
                    result = state.testCasesResult[key][index].output + output
                } else {
                    result = output
                }
                state.testCasesResult[key][index] = {
                    ...state.testCasesResult[key][index],
                    output: result
                };
            }
        },
        updateOutputTestCaseResultSubmit: (
            state,
            action: PayloadAction<
                IResultSubmit & {
                    submittedAt: string;
                    codeFailed?: string;
                }
            >
        ) => {
            console.log("Update output test case result submit:", action.payload);
        },

        handleChangeInputTestCase: (
            state,
            action: PayloadAction<{ key: string; id: string; inputKey: string; value: string }>
        ) => {
            const { key, id, inputKey, value } = action.payload;

            // Ensure the key exists
            if (state.testCases[key]) {
                // Find the index of the test case to be updated
                const testCaseIndex = state.testCases[key].findIndex((testCase) => testCase._id === id);

                if (testCaseIndex !== -1) {
                    // Clone the target test case
                    const updatedTestCase = { ...state.testCases[key][testCaseIndex] };
                    const updatedPersistTestCase = { ...state.persistTestCases[key][testCaseIndex] };

                    // Update the input value in the test case
                    updatedTestCase.input = updatedTestCase.input.map((inputObj) =>
                        inputObj[inputKey] !== undefined ? { ...inputObj, [inputKey]: value } : inputObj
                    );

                    updatedPersistTestCase.input = updatedPersistTestCase.input.map((inputObj) =>
                        inputObj[inputKey] !== undefined ? { ...inputObj, [inputKey]: value } : inputObj
                    );

                    // Replace the updated test case in the array
                    state.testCases[key][testCaseIndex] = updatedTestCase;
                    state.persistTestCases[key][testCaseIndex] = updatedPersistTestCase;
                }
            }
        },

        setVariableName(state, action: PayloadAction<string[]>) {
            state.exercise.variableName = action.payload;
        },
        setLoadingTestCase(state, action: PayloadAction<boolean>) {
            state.loadingTestCase = action.payload;
        },
        setSubList(state, action: PayloadAction<ISubmission[]>) {
            state.subList = action.payload;
        },
        setSubmission(state, action: PayloadAction<ISubmission | {}>) {
            state.submission = action.payload;
        },
        setSubmissionId(state, action: PayloadAction<string>) {
            state.submissionId = action.payload;
        },
        setLoadingSubList(state, action: PayloadAction<boolean>) {
            state.loadingSubList = action.payload;
        },
        setCompile(
            state,
            action: PayloadAction<"Accepted" | "Compile Error" | "Test Result" | "Wrong Answer" | null>
        ) {
            state.compile = action.payload;
        },
        setCode(
            state,
            action: PayloadAction<{
                key: string;
                code: string | undefined;
            }>
        ) {
            state.code[action.payload.key] = action.payload.code || "";
        },
        setResultSubmit(
            state,
            action: PayloadAction<
                IResultSubmit & {
                    submittedAt: string;
                    codeFailed?: string;
                }
            >
        ) {
            state.resultSubmit = action.payload;
        },
        setClickTracker(state, action: PayloadAction<number>) {
            state.clickTracker = action.payload;
        },
        setActiveResultTab(state, action: PayloadAction<string>) {
            state.activeResultTab = action.payload;
        },
        setActiveTestcaseTab(state, action: PayloadAction<string>) {
            state.activeTestcaseTab = action.payload;
        },
        setActiveTab(state, action: PayloadAction<string>) {
            state.activeTab = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder.addCase(fetchExercises.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(
            fetchExercises.fulfilled,
            (state, action: PayloadAction<IExercisePayload>) => {
                state.loading = false;
                state.exercises = action.payload.data;
            }
        );
        builder.addCase(fetchExercises.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload!;
        });
        builder.addCase(fetchExercise.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchExercise.fulfilled, (state, action: PayloadAction<IExercise>) => {
            state.loading = false;
            state.exercise = action.payload;
        });
        builder.addCase(fetchExercise.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload!;
        });
        builder.addCase(fetchExerciseStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchExerciseStatus.fulfilled, (state, action: PayloadAction<IExerciseStatus>) => {
            state.loading = false;
            state.exerciseStatus = action.payload;
        });
        builder.addCase(fetchExerciseStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload!;
        });
    },
});

export const {
    addExercise,
    setCurrentExercise,
    updateExercise,
    deleteExercise,
    setTestCases,
    removeTestCase,
    addTestCase,
    setCode,
    setRunningTestCase,
    updateStatusTestCase,
    setLoadingTestCase,
    setLoadingSubList,
    handleChangeInputTestCase,
    setVariableName,
    setTestCasesResult,
    setLoading,
    setExercise,
    setSubList,
    setCompile,
    setResultSubmit,
    updateOutputTestCaseResultSubmit,
    setSubmission,
    setSubmissionId,
    setClickTracker,
    setAllTestCasesResultRunning,
    updateStatusTestCaseResult,
    updateOutputCompiling,
    setActiveResultTab,
    setActiveTestcaseTab,
    setActiveTab,
    setEachTestCaseResultRunning
} = exercisesAlgoSlice.actions;

export default exercisesAlgoSlice.reducer;
