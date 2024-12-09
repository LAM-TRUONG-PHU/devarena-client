import { configureStore } from "@reduxjs/toolkit";
import contestSlice from "./slices/contestSlice";
export const store = configureStore({
    reducer: {
        contest: contestSlice,
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;