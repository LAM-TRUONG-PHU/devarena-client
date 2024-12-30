import { configureStore } from "@reduxjs/toolkit";
import contestSlice from "./slices/contestSlice";
import filterSlice from "./slices/filterSlice";
import exercisesSlice from "./slices/admin/exerciseStudySlice";
import studyFormSlice from "./slices/admin/StudyFormSlice";

export const store = configureStore({
    reducer: {
        contest: contestSlice,
        filter: filterSlice,
        exercises: exercisesSlice,
        studyForm: studyFormSlice,
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
