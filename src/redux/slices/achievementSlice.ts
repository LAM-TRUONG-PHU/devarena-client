import { IAchievement } from "@/types/IAchievement";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";

interface AchievementState {
    achievements: IAchievement[];
    achievement: IAchievement | null;
    yourPreAchievement: IAchievement | null;
    loading: boolean;
    error: string;
}

interface IAchievementPayload {
    data: IAchievement[];
}

const initialState: AchievementState = {
    achievements: [],
    achievement: null,
    yourPreAchievement: null,
    loading: false,
    error: "",
};

export const fetchAchievementsByRefIdAndRequiredScore = createAsyncThunk<{
    data: {
        achievement: IAchievement;
        yourPreAchievement: IAchievement;
    };
}, {
    axiosInstance: AxiosInstance;
    id: string;
    totalSolvedScore: number;
}, { rejectValue: string }>(
    "achievement/fetchAchievementsByRefIdAndTotalSolvedScore",
    async ({ axiosInstance, id, totalSolvedScore }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/achievement/refId/${id}/score/${totalSolvedScore}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchAchievementsByRefId = createAsyncThunk<IAchievementPayload, {
    axiosInstance: AxiosInstance;
    refId: string;
}, { rejectValue: string }>(
    "achievement/fetchAchievementsByRefId",
    async ({ axiosInstance, refId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/achievement/refId/${refId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
)




const achievementSlice = createSlice({
    name: "achievement",
    initialState,
    reducers: {
        addAchievement(state, action: PayloadAction<IAchievement>) {
            state.achievements.push(action.payload);
        },
        updateAchievement(state, action: PayloadAction<IAchievement>) {
            const index = state.achievements.findIndex((achievement) => achievement._id === action.payload._id);
            state.achievements[index] = action.payload;
        },
        deleteAchievement(state, action: PayloadAction<string>) {
            state.achievements = state.achievements.filter((achievement) => achievement._id !== action.payload);
        }

    },
    extraReducers: (builder) => {
        builder.addCase(fetchAchievementsByRefId.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAchievementsByRefId.fulfilled, (state, action) => {
            state.loading = false;
            state.achievements = action.payload.data;
        });
        builder.addCase(fetchAchievementsByRefId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload!;
        });
        builder.addCase(fetchAchievementsByRefIdAndRequiredScore.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAchievementsByRefIdAndRequiredScore.fulfilled, (state, action) => {
            state.loading = false;
            state.achievement = action.payload.data.achievement;
            state.yourPreAchievement = action.payload.data.yourPreAchievement;
        });
        builder.addCase(fetchAchievementsByRefIdAndRequiredScore.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload!;
        });
    }
});

export const { addAchievement, updateAchievement, deleteAchievement } = achievementSlice.actions;

export default achievementSlice.reducer;