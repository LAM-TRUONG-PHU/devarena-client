import { IExercise } from "@/types/Exercise";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";

interface ExerciseState {
    exercises: IExercise[];
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
    reducers: {},
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

export default exercisesSlice.reducer;
