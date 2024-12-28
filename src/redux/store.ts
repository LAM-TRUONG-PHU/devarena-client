import { configureStore } from "@reduxjs/toolkit";
import contestSlice from "./slices/contestSlice";
import filterSlice from "./slices/filterSlice";
import studyFormSlice from "./slices/admin/StudyFormSlice";

export const store = configureStore({
    reducer: {
        contest: contestSlice,
        filter: filterSlice,
        studyForm: studyFormSlice
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
