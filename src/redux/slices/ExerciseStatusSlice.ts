import { ICourseStatus } from "@/types/ICourseStatus";
import { IExerciseStatus } from "@/types/IExerciseStatus";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IExerciseStatusForm {
  courseStatus: ICourseStatus|null;
  exerciseSelected: IExerciseStatus|null;

}

const initialState: IExerciseStatusForm = {
  // exercises: [],
  // courseId: "",
  // _id: "",
  // status: "",
  // progress: 0,
  exerciseSelected: null,
  courseStatus: null
};

const ExerciseStatusFormSlice = createSlice({
  name: "ExerciseStatusForm",
  initialState,
  reducers: {
    // setExercises: (state, action: PayloadAction<IExerciseStatus[]>) => {
    //   state.exercises = action.payload;
    // },
    // setCourseStatus: (state, action: PayloadAction<IExerciseStatusForm>) => {
    //   state.courseId = action.payload.courseId;
    //   state._id = action.payload._id;
    //   state.status = action.payload.status;
    //   state.progress = action.payload.progress;
    //   state.exercises = action.payload.exercises;

    // },
    setCourseStatus: (state, action: PayloadAction<ICourseStatus|null>) => {
      state.courseStatus = action.payload;
    },
    setExerciseSelected: (state, action: PayloadAction<IExerciseStatus|null>) => {
      state.exerciseSelected = action.payload;
    },

  },
});

export const {
  // setExercises,
  setCourseStatus,
  setExerciseSelected
} = ExerciseStatusFormSlice.actions;

export default ExerciseStatusFormSlice.reducer;
