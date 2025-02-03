import { IContest } from "@/types/IContest";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";

// type Contest = {
//     _id: string;
//     title: string;
//     description: string;
//     startDate: string;
//     endDate: string;
//     imageUrl: string;
//     status: string;
//     participants: number;
// };
export type ExerciseCard = {
  _id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  content: string;
  score: number;
};
interface ContestState {
  inCommingContests: IContest[];
  pastContests: IContest[];
  incomingLoading: "idle" | "loading" | "failed";
  pastLoading: "idle" | "loading" | "failed";
  exerciseCard: ExerciseCard[];
  error: string | null;
}

const initialState: ContestState = {
  inCommingContests: [],
  pastContests: [],
  incomingLoading: "idle",
  pastLoading: "idle",
  exerciseCard: [],
  error: null,
};
export const fetchIncomingContests = createAsyncThunk(
    'contest/fetchIncoming',
    async ({axiosInstance}: {axiosInstance: AxiosInstance}) => {
        const response = await axiosInstance.get('/contest-description/status/published');
        return await response.data.data;
    }
);

export const fetchPastContests = createAsyncThunk(
    'contest/fetchPast',
    async ({axiosInstance}: {axiosInstance: AxiosInstance}) => {
        const response = await axiosInstance.get('/contest-description/status/published');
        return await response.data.data;
    }
);

export const fetchContestExercises = createAsyncThunk(
    'contest/fetchContestExercises',
    async ({axiosInstance,contestId}: {axiosInstance: AxiosInstance,contestId: string}) => {
        const response = await axiosInstance.get(`/contest-exercise/contest/${contestId}`);
        console.log(response.data.data);
        return await response.data.data;
    }
);

const contestClientSlice = createSlice({
  name: "contest",
  initialState,
  reducers: {
    createContest(state, action: PayloadAction<IContest>) {
      state.inCommingContests.push(action.payload);
    },
    updateContest(state, action: PayloadAction<IContest>) {
      const index = state.inCommingContests.findIndex(
        (contest) => contest._id === action.payload._id
      );
      state.inCommingContests[index] = action.payload;
    },
    deleteContest(state, action: PayloadAction<string>) {
      state.inCommingContests = state.inCommingContests.filter(
        (contest) => contest._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Incoming contests
      .addCase(fetchIncomingContests.pending, (state) => {
        state.incomingLoading = "loading";
        state.error = null;
      })
      .addCase(fetchIncomingContests.fulfilled, (state, action) => {
        state.incomingLoading = "idle";
        state.inCommingContests = action.payload;
        state.error = null;
      })
      .addCase(fetchIncomingContests.rejected, (state, action) => {
        state.incomingLoading = "failed";
        state.error =
          action.error.message || "Failed to fetch incoming contests";
      })
      // Past contests
      .addCase(fetchPastContests.pending, (state) => {
        state.pastLoading = "loading";
        state.error = null;
      })
      .addCase(fetchPastContests.fulfilled, (state, action) => {
        state.pastLoading = "idle";
        state.pastContests = action.payload;
        state.error = null;
      })
      .addCase(fetchPastContests.rejected, (state, action) => {
        state.pastLoading = "failed";
        state.error = action.error.message || "Failed to fetch past contests";
      })
      //fetch exercise card
      .addCase(fetchContestExercises.pending, (state) => {
        // state.exerciseCardLoading = "loading";
        state.error = null;
      })
      .addCase(fetchContestExercises.fulfilled, (state, action) => {
        // state.exerciseCardLoading = "idle";
        state.exerciseCard = action.payload;
        state.error = null;
      })
      .addCase(fetchContestExercises.rejected, (state, action) => {
        // state.exerciseCardLoading = "failed";
        state.error = action.error.message || "Failed to fetch exercise card";
      });
    },
});

export const { createContest, updateContest, deleteContest } =
  contestClientSlice.actions;
export default contestClientSlice.reducer;
