import { configureStore } from "@reduxjs/toolkit";
import contestSlice from "./slices/contestSlice";
import filterSlice from "./slices/filterSlice";
export const store = configureStore({
    reducer: {
        contest: contestSlice,
        filter: filterSlice,
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
