import {
  createSlice,
  createAsyncThunk,
  type AsyncThunk,
} from "@reduxjs/toolkit";
import $axios from "@/axios";
import type { RootState } from "@/store";

interface CommonData {
  roles: any[];
  provinces: any[];
  facilityTypes: any[];
  resourceActions: any[];
  hotelDocuments: any[];
  hotelTypes: any[];
  hotelFacilities: any[];
  [key: string]: any;
}

type FetchCommonDataReturn = Record<string, any>;

// Define the argument type of the thunk
interface FetchCommonDataArgs {
  types: string[];
  forceRefresh?: boolean;
  retries?: number;
}

// Define the thunk type
type FetchCommonDataThunk = AsyncThunk<
  FetchCommonDataReturn, // Return type
  FetchCommonDataArgs, // Argument type
  { state: RootState } // ThunkAPI config (includes RootState)
>;

interface CommonDataState {
  data: CommonData;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
}

const initialState: CommonDataState = {
  data: {
    roles: [],
    provinces: [],
    facilityTypes: [],
    resourceActions: [],
    hotelDocuments: [],
    hotelTypes: [],
    hotelFacilities: [],
  },
  loading: {},
  error: {},
};

// Thunk để fetch dữ liệu chung
export const fetchCommonData: FetchCommonDataThunk = createAsyncThunk(
  "commonData/fetchCommonData",
  async (
    { types, forceRefresh = false, retries = 3 }: FetchCommonDataArgs,
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const typesToFetch = forceRefresh
      ? types
      : types.filter((type) => {
          const data = state.commonData.data[type];
          return !data || !Array.isArray(data) || data.length === 0;
        });

    if (typesToFetch.length === 0) {
      console.log("All requested types are cached:", types);
      return state.commonData.data;
    }

    try {
      const query = new URLSearchParams();
      query.append("types", typesToFetch.join(","));
      const res = await $axios.get(`/common-data?${query}`);

      if (!res.data?.result) {
        throw new Error("API returned unexpected format");
      }

      return res.data.result;
    } catch (err: any) {
      if (retries > 0) {
        console.warn(`Retrying fetchCommonData, retries left: ${retries}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchCommonData({ types, forceRefresh, retries: retries - 1 });
      }
      const errorMessage =
        err.response?.data?.message || "Failed to fetch common data";
      return rejectWithValue(errorMessage);
    }
  }
);

const commonDataSlice = createSlice({
  name: "commonData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommonData.pending, (state, action) => {
        const types = action.meta.arg.types;
        types.forEach((type) => {
          state.loading[type] = true;
          state.error[type] = null;
        });
      })
      .addCase(fetchCommonData.fulfilled, (state, action) => {
        const types = action.meta.arg.types;
        state.data = { ...state.data, ...action.payload };
        types.forEach((type) => {
          state.loading[type] = false;
          state.error[type] = null;
        });
      })
      .addCase(fetchCommonData.rejected, (state, action) => {
        const types = action.meta.arg.types;
        const errorMessage = action.payload as string;
        types.forEach((type) => {
          state.loading[type] = false;
          state.error[type] = errorMessage;
        });
      });
  },
});

export default commonDataSlice.reducer;
