import { IContestExercise } from "@/types/Exercise";
import { IContest } from "@/types/IContest";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosInstance } from "axios";

interface ContestState {
  contests: IContest[];
  loading: boolean;
  error: string | null;
  currentContest: IContest | null;
  loadingAction: boolean;
  exercises: IContestExercise[];
  selectedExercise: IContestExercise | null;
  loadingExercise: boolean;
  errorExercise: string | null;
  currentStep: number;
  totalStep: number;
}

const initialState: ContestState = {
  contests: [],
  loading: false,
  error: null,
  currentContest: null,
  loadingAction: false,
  exercises: [],
  selectedExercise: null,
  loadingExercise: false,
  errorExercise: null,
  currentStep: 0,
  totalStep: 4,
};
interface IContestData {
  contestName: string;
  description: string;
  startDate: string;
  endDate: string;
  axiosInstance: AxiosInstance;
  coverImage: File | null;
}
// Async thunks
export const fetchContests = createAsyncThunk(
  "contest/fetchContests",
  async (
    { axiosInstance }: { axiosInstance: AxiosInstance },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/contest-description");
      return response.data.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const createContest = createAsyncThunk(
  "contest/createContest",
  async (contestData: Partial<IContestData>, { rejectWithValue }) => {
    const formData = new FormData();
    console.log(contestData);
    // Add all fields except axiosInstance to FormData
    if (contestData.contestName)
      formData.append("contestName", contestData.contestName);
    if (contestData.description)
      formData.append("description", contestData.description);
    if (contestData.startDate)
      formData.append("startDate", contestData.startDate);
    if (contestData.endDate) formData.append("endDate", contestData.endDate);
    if (contestData.coverImage)
      formData.append("image", contestData.coverImage);

    try {
      const response = await contestData.axiosInstance!.post(
        "/contest-description",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Có lỗi xảy ra");
    }
  }
);

export const updateContest = createAsyncThunk(
  "contest/updateContest",
  async ({ id, data }: { id: string; data: Partial<IContest> }) => {
    const response = await axios.put(`/api/contests/${id}`, data);
    return response.data;
  }
);

export const deleteContest = createAsyncThunk(
  "contest/deleteContest",
  async (id: string) => {
    await axios.delete(`/api/contests/${id}`);
    return id;
  }
);

export const fetchContestExercises = createAsyncThunk(
  "contest/fetchContestExercises",
  async (
    {
      contestId,
      axiosInstance,
    }: { contestId: string; axiosInstance: AxiosInstance },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/contest-exercise?contest=${contestId}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Có lỗi xảy ra");
    }
  }
);

export const addContestExercise = createAsyncThunk(
  "contest/addContestExercise",
  async (
    {
      contestId,
      exerciseId,
      axiosInstance,
    }: {
      contestId: string;
      exerciseId: string;
      axiosInstance: AxiosInstance;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        `/contest-description/${contestId}/exercises`,
        {
          exerciseId,
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Có lỗi xảy ra");
    }
  }
);

const contestSlice = createSlice({
  name: "contest",
  initialState,
  reducers: {
    setCurrentContest: (state, action) => {
      state.currentContest = action.payload;
    },
    clearCurrentContest: (state) => {
      state.currentContest = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
   
  },
  extraReducers: (builder) => {
    builder
      // Fetch contests
      .addCase(fetchContests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.contests = action.payload;
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch contests";
      })
      // Create contest
      .addCase(createContest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.loadingAction = true;
      })
      .addCase(createContest.fulfilled, (state, action) => {
        state.loading = false;
        state.contests.push(action.payload);
        state.loadingAction = false;
      })
      .addCase(createContest.rejected, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.loadingAction = false;
        state.error = (action.payload as string) || "Failed to create contest";
      })
      // Update contest
      .addCase(updateContest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.loadingAction = true;
      })
      .addCase(updateContest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contests.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.contests[index] = action.payload;
        }
        state.loadingAction = false;
      })
      .addCase(updateContest.rejected, (state, action) => {
        state.loadingAction = false;
        state.error = action.error.message || "Failed to update contest";
      })
      // Delete contest
      .addCase(deleteContest.pending, (state) => {
        state.loadingAction = true;
        state.error = null;
      })
      .addCase(deleteContest.fulfilled, (state, action) => {
        state.loadingAction = false;
        state.contests = state.contests.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteContest.rejected, (state, action) => {
        state.loadingAction = false;
        state.error = action.error.message || "Failed to delete contest";
      })
      // Fetch contest exercises
      .addCase(fetchContestExercises.pending, (state) => {
        state.loadingExercise = true;
        state.errorExercise = null;
      })
      .addCase(fetchContestExercises.fulfilled, (state, action) => {
        state.loadingExercise = false;
        state.exercises = action.payload;
      })
      .addCase(fetchContestExercises.rejected, (state, action) => {
        state.loadingExercise = false;
        state.errorExercise = action.payload as string;
      })

      // Add contest exercise
      .addCase(addContestExercise.pending, (state) => {
        state.loadingExercise = true;
        state.errorExercise = null;
      })
      .addCase(addContestExercise.fulfilled, (state, action) => {
        state.loadingExercise = false;
        state.exercises.push(action.payload);
      })
      .addCase(addContestExercise.rejected, (state, action) => {
        state.loadingExercise = false;
        state.errorExercise = action.payload as string;
      });
  },
});

export const { setCurrentContest, clearCurrentContest, clearError, setCurrentStep } =
  contestSlice.actions;
export default contestSlice.reducer;
