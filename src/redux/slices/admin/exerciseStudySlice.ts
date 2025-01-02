import { TExerciseStudy } from "@/app/admin/study/[slug]/exercise/page";
import { IExercise } from "@/types/Exercise";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";

interface ExerciseState {
    exercises: IExercise[];
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

const exercisesSlice = createSlice({
    name: "course",
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
        }, deleteExercise(state, action: PayloadAction<string | undefined>) {
            state.exercises = state.exercises.filter((exercise) => exercise._id !== action.payload);
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
    },
});

export const { addExercise, setCurrentExercise,
    updateExercise, deleteExercise
} = exercisesSlice.actions;

export default exercisesSlice.reducer;
