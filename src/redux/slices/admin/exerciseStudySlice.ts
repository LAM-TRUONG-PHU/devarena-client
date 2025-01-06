import { TExerciseStudy } from "@/app/admin/study/[slug]/exercise/page";
import { IExercise, ITestCase, StatusCompile } from "@/types/Exercise";
import { ICompileRes } from "@/types/ICompileRes";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";

interface ExerciseState {
    exercises: IExercise[];
    exercise: IExercise;
    testCases: ITestCase[]
    currentExercise: IExercise | null;
    loading: boolean;
    error: string | null;
}

interface IExercisePayload {
    data: IExercise[];
}

interface FetchCoursesParams {
    axiosInstance: AxiosInstance;
}

const initialState: ExerciseState = {
    exercises: [],
    exercise: {} as IExercise,
    testCases: [],
    currentExercise: null,
    loading: false,
    error: null,

};

export const fetchExercises = createAsyncThunk<IExercisePayload, FetchCoursesParams, { rejectValue: string }>(
    "course/fetchCourses",
    async ({ axiosInstance }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/study");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchExercise = createAsyncThunk<IExercise, { axiosInstance: AxiosInstance, id: string }, { rejectValue: string }>(
    "course/fetchCourse",
    async ({ axiosInstance, id }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/study/${id}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

const exercisesSlice = createSlice({
    name: "exercise",
    initialState,
    reducers: {
        addExercise(state, action: PayloadAction<IExercise>) {
            state.exercises.push(action.payload);
        },
        setCurrentExercise(state, action: PayloadAction<IExercise | null>) {
            state.currentExercise = action.payload;
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
        setTestCases: (state, action: PayloadAction<ITestCase[]>) => {
            state.testCases = action.payload;
        },
        addTestCase: (state, action: PayloadAction<ITestCase>) => {
            state.testCases = [...state.testCases!, action.payload];
        },
        removeTestCase: (state, action: PayloadAction<string>) => {
            state.testCases = state.testCases!.filter((testCase) => testCase._id !== action.payload);
        },
        setRunningTestCase: (state, action: PayloadAction<string>) => {
            state.testCases.forEach((testCase) => {
                testCase.statusCompile = StatusCompile.COMPILE_RUNNING
            })
            // state.testCases = state.testCases!.map((testCase) => testCase._id === action.payload ? { ...testCase, statusCompile: StatusCompile.COMPILE_RUNNING } : testCase);
        },
        updateStatusTestCase: (state, action: PayloadAction<{ index: number; res: ICompileRes }>) => {
            state.testCases[action.payload.index].statusCompile = action.payload.res.isCorrect ? StatusCompile.COMPILE_SUCCESS : StatusCompile.COMPILE_FAILED
            state.testCases[action.payload.index].output = action.payload.res.output
            state.testCases[action.payload.index].outputExpected = action.payload.res.outputExpect
        },
        handleChangeInputTestCase: (
            state,
            action: PayloadAction<{ id: string; key: string; value: string }>
        ) => {
            const { id, key, value } = action.payload;
            console.log(value)
            // Tìm chỉ mục của testCase trong mảng state.testCases
            const index = state.testCases.findIndex((testCase) => testCase._id === id);
            const updatedTestCase = JSON.parse(JSON.stringify(state.testCases[index])) as ITestCase;
            console.log(updatedTestCase)
            updatedTestCase.input.map((obj) => {
                if (obj[key] !== undefined) {
                    obj[key] = value
                    console.log(obj)
                }
            })
            state.testCases[index] = updatedTestCase

            return state;
        }

    },
    extraReducers: (builder) => {
        builder.addCase(fetchExercises.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchExercises.fulfilled, (state, action: PayloadAction<IExercisePayload>) => {
            state.loading = false;
            state.exercises = action.payload.data;
        });
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
    },
});

export const { addExercise, setCurrentExercise,
    updateExercise, deleteExercise,
    setTestCases, removeTestCase,
    addTestCase,
    setRunningTestCase, updateStatusTestCase,
    handleChangeInputTestCase
} = exercisesSlice.actions;

export default exercisesSlice.reducer;
