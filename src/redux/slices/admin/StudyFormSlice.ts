import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IExercise, ITestCase } from "@/types/Exercise";

interface IStudyForm {
    exercise: IExercise;
    currentStep: number;
    totalStep: number;
    variableCount: number;
}

const initialState: IStudyForm = {
    exercise: {
        content: "",
        difficulty: "",
        language: "",
        testcases: [],
        title: "",
        variableName: [],
        tags: [],

    },
    currentStep: 0,
    totalStep: 4,
    variableCount: 0,
};

const StudyFormSlice = createSlice({
    name: "StudyForm",
    initialState,
    reducers: {
        setContent(state, action: PayloadAction<string>) {
            state.exercise.content = action.payload;
        },
        setDifficulty(state, action: PayloadAction<string>) {
            state.exercise.difficulty = action.payload;
        },
        setLanguage(state, action: PayloadAction<string>) {
            state.exercise.language = action.payload;
        },
        setTestcases(state, action: PayloadAction<ITestCase[]>) {
            state.exercise.testcases = action.payload;
        },
        setTitle(state, action: PayloadAction<string>) {
            state.exercise.title = action.payload;
        },
        setVariableName(state, action: PayloadAction<string[]>) {
            state.exercise.variableName = action.payload;
        },
        setTags(state, action: PayloadAction<string[]>) {
            state.exercise.tags = action.payload;
        },
        setCurrentStep(state, action: PayloadAction<number>) {
            state.currentStep = action.payload;
        },
        setTotalStep(state, action: PayloadAction<number>) {
            state.totalStep = action.payload;
        },
        setVariableCount(state, action: PayloadAction<number>) {
            state.variableCount = action.payload;
        }
    },
});

export const {
    setContent,
    setDifficulty,
    setLanguage,
    setTestcases,
    setTitle,
    setVariableName,
    setCurrentStep,
    setTotalStep,
    setTags,
    setVariableCount
} = StudyFormSlice.actions;

export default StudyFormSlice.reducer;
