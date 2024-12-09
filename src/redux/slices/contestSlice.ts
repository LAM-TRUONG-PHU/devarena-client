import { createSlice, PayloadAction } from "@reduxjs/toolkit";



type Contest = {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
    status: string;
    participants: number;
};


interface ContestState {
    contests: Contest[];
}

const initialState: ContestState = {
    contests: [],
};

const contestSlice = createSlice({
    name: "contest",
    initialState,
    reducers: {
        createContest(state, action: PayloadAction<Contest>) {
            state.contests.push(action.payload);
        },
        updateContest(state, action: PayloadAction<Contest>) {
            const index = state.contests.findIndex((contest) => contest._id === action.payload._id);
            state.contests[index] = action.payload;
        },
        deleteContest(state, action: PayloadAction<string>) {
            state.contests = state.contests.filter((contest) => contest._id !== action.payload);
        },
    },
});

export const { createContest, updateContest, deleteContest } = contestSlice.actions;
export default contestSlice.reducer;
