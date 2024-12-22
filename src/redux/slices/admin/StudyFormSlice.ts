import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IExercise, ITestCase } from "@/types/Exercise";

const initialState: IExercise = {
  content: "",
  difficulty: "",
  language: "",
  testcases: [], // Initially null or an empty array
  title: "",
};

const StudyFormSlice = createSlice({
  name: "StudyForm",
  initialState,
  reducers: {
    setContent(state, action: PayloadAction<string>) {
      state.content = action.payload;
    },
    setDifficulty(state, action: PayloadAction<string>) {
      state.difficulty = action.payload;
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    setTestcase(state, action: PayloadAction<ITestCase[]>) {
        state.testcases=action.payload
      },
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
  },
});

export const { setContent, setDifficulty, setLanguage, setTestcase, setTitle } = StudyFormSlice.actions;

export default StudyFormSlice.reducer;
