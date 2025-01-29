import { configureStore } from "@reduxjs/toolkit";
// import contestSlice from "./slices/contestSlice";
import filterSlice from "./slices/filterSlice";
import exercisesSlice from "./slices/admin/exerciseStudySlice";
import studyFormSlice from "./slices/admin/StudyFormSlice";
import ExerciseStatusSlice from "./slices/ExerciseStatusSlice";
import courseSlice from "./slices/courseSlice";
import ContestClientSlice from "./slices/contestClientSlice";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";

import storage from "redux-persist/lib/storage";
import ContestSlice from "./slices/admin/ContestSlice";
const exercisesPersistConfig = {
    key: "persistExercises",
    storage: storage,
    whitelist: ["persistTestCases", "code"], // Include both states to persist
};


const rootReducer = combineReducers({
    // contest: contestSlice,
    filter: filterSlice,
    studyForm: studyFormSlice,
    exerciseStatus: ExerciseStatusSlice,
    exercises: persistReducer(exercisesPersistConfig, exercisesSlice),
    course: courseSlice,
    contest: ContestSlice,
    contestClient: ContestClientSlice,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),

});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
