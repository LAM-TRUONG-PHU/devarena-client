import { EDifficulty, EStatus } from "@/components/sort";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
    Difficulty: { label: string; value: EDifficulty }[];
    Status: { label: string; value: EStatus }[];
    Filter: { label: string; value: string }[];
    Skills: { label: string; value: string }[];
}

const initialState: FilterState = {
    Difficulty: [
        { label: "Easy", value: EDifficulty.Easy },
        { label: "Medium", value: EDifficulty.Medium },
        { label: "Hard", value: EDifficulty.Hard },
    ],
    Status: [
        { label: "In Progress", value: EStatus.InProgress },
        { label: "Solved", value: EStatus.Solved },
        { label: "Unsolved", value: EStatus.Unsolved },
    ],
    Filter: [],
    Skills: [],
};

export const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setFilter(state, action: PayloadAction<{ label: string; value: string }[]>) {
            state.Filter = action.payload;
        },
        setSkills(state, action: PayloadAction<{ label: string; value: string }[]>) {
            state.Skills = action.payload;
        },
    },
});

export const { setFilter, setSkills } = filterSlice.actions;
export default filterSlice.reducer;
