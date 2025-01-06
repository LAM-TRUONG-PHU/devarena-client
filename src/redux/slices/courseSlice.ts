import { ICourse } from "@/types/ICourse";
import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";

interface CourseState {
    currentCourse: ICourse | null;
}

interface FetchCoursesParams {
    axiosInstance: AxiosInstance;
}


const initialState: CourseState = {
    currentCourse: null,
};

export const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        setCurrentCourse(state, action: PayloadAction<ICourse | null>) {
            state.currentCourse = action.payload;
        },
    },

});

export const { setCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;
