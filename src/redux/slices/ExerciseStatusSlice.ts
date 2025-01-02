import { ITestCase, StatusCompile } from "@/types/Exercise";
import { ICompileRes } from "@/types/ICompileRes";
import { ICourseStatus } from "@/types/ICourseStatus";
import { IExerciseStatus } from "@/types/IExerciseStatus";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IExerciseStatusForm {
  courseStatus: ICourseStatus|null;
  exerciseSelected: IExerciseStatus|null;
  testCases:ITestCase[]

}

const initialState: IExerciseStatusForm = {
  // exercises: [],
  // courseId: "",
  // _id: "",
  // status: "",
  // progress: 0,
  exerciseSelected: null,
  courseStatus: null,
  testCases:[]
};

const ExerciseStatusFormSlice = createSlice({
  name: "ExerciseStatusForm",
  initialState,
  reducers: {
  
    setCourseStatus: (state, action: PayloadAction<ICourseStatus|null>) => {
      state.courseStatus = action.payload;
    },
    setExerciseSelected: (state, action: PayloadAction<IExerciseStatus|null>) => {
      state.exerciseSelected = action.payload;
    },
    setTestCases: (state, action: PayloadAction<ITestCase[]>) => {
      state.testCases = action.payload;
    },
    addTestCase: (state, action: PayloadAction<ITestCase>) => {
      state.testCases = [...state.testCases!, action.payload];
      console.log(state.testCases)
    },
    removeTestCase: (state, action: PayloadAction<string>) => {
      state.testCases = state.testCases!.filter((testCase) => testCase._id !== action.payload);
    },
    setRunningTestCase: (state, action: PayloadAction<string>) => {
      state.testCases.forEach((testCase)=>{
        testCase.statusCompile = StatusCompile.COMPILE_RUNNING
      })
      // state.testCases = state.testCases!.map((testCase) => testCase._id === action.payload ? { ...testCase, statusCompile: StatusCompile.COMPILE_RUNNING } : testCase);
    },
    updateStatusTestCase: (state, action: PayloadAction<{ index: number; res: ICompileRes  }>) => {
      state.testCases[action.payload.index].statusCompile = action.payload.res.isCorrect ? StatusCompile.COMPILE_SUCCESS : StatusCompile.COMPILE_FAILED
      state.testCases[action.payload.index].output = action.payload.res.output
      state.testCases[action.payload.index].outputExpected = action.payload.res.outputExpect
    },
    handleChangeInputTestCase: (
      state,
      action: PayloadAction<{ id: string; key: string; value: string }>
    ) => {
      const { id, key, value } = action.payload;
      console.log(value)
      // Tìm chỉ mục của testCase trong mảng state.testCases
      const index = state.testCases.findIndex((testCase) => testCase._id === id);
      const updatedTestCase = JSON.parse(JSON.stringify(state.testCases[index])) as ITestCase;
      console.log(updatedTestCase)
      updatedTestCase.input.map((obj)=>{
        if(obj[key]!==undefined){
          obj[key]=value
          console.log(obj)
        }
      })
      state.testCases[index]=updatedTestCase

      return state;
    }
    

  },
});


export const {
  // setExercises,
  setCourseStatus,
  setExerciseSelected,
  setTestCases,
  addTestCase,
  setRunningTestCase,
  updateStatusTestCase,
  removeTestCase,
  handleChangeInputTestCase
} = ExerciseStatusFormSlice.actions;

export default ExerciseStatusFormSlice.reducer;
