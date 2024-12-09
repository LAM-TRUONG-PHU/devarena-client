import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Contest = {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
    status: string;
    participants: number;
};

const initialState: Contest = {
    id: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
    status: "",
    participants: 0,
};

const contestSlice = createSlice({
    name: "contest",
    initialState,
    reducers: {
        setContest: (state, action: PayloadAction<Contest>) => {
            state.id = action.payload.id;
            state.title = action.payload.title;
            state.description = action.payload.description;
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
            state.imageUrl = action.payload.imageUrl;
            state.status = action.payload.status;
            state.participants = action.payload.participants;
        },
    },
});
