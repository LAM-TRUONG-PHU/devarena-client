import { configureStore } from "@reduxjs/toolkit";
import contestSlice from "./slices/contestSlice";
import filterSlice from "./slices/filterSlice";
import exercisesSlice from "./slices/admin/exerciseStudySlice";
import studyFormSlice from "./slices/admin/StudyFormSlice";
import ExerciseStatusSlice from "./slices/ExerciseStatusSlice";

export const store = configureStore({
    reducer: {
        contest: contestSlice,
        filter: filterSlice,
        studyForm: studyFormSlice,
        exerciseStatus: ExerciseStatusSlice,
        exercises: exercisesSlice,
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
