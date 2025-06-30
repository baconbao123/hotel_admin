import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from ".."; // Adjust import based on your store setup
import $axios from "@/axios";

// Define the response interface (matches API response)
export interface CommonDataResponse {
  facilityTypes?: any[];
  documentTypes?: any[];
  hotelTypes?: any[];
  roles?: any[];
  provinces?: any[];
  resourceActions?: any[];
  hotelFacilities?: any[];
  paymentMethods?: any[];
  roomTypes?: any[];
}

// Define the state interface (matches request and internal usage)
export interface CommonData {
  facilitiestype?: any[];
  hoteldocuments?: any[];
  hoteltypes?: any[];
  roles?: any[];
  provinces?: any[];
  permissions?: any[];
  hotelfacilities?: any[];
  paymentmethods?: any[];
  roomtypes?: any[];
}

// Define the state shape
interface CommonDataState {
  data: CommonData;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: CommonDataState = {
  data: {},
  status: "idle",
};

// Mapping between request types (CommonData keys) and response types (CommonDataResponse keys)
const typeMapping: Record<keyof CommonData, keyof CommonDataResponse> = {
  facilitiestype: "facilityTypes",
  hoteldocuments: "documentTypes",
  hoteltypes: "hotelTypes",
  roles: "roles",
  provinces: "provinces",
  permissions: "resourceActions",
  hotelfacilities: "hotelFacilities",
  paymentmethods: "paymentMethods",
  roomtypes: "roomTypes",
};

// Reverse mapping for request types
const reverseTypeMapping: Record<string, keyof CommonData> = Object.entries(
  typeMapping
).reduce((acc, [requestType, responseType]) => {
  acc[responseType] = requestType as keyof CommonData;
  return acc;
}, {} as Record<string, keyof CommonData>);

// Async thunk to fetch common data
export const fetchCommonData = createAsyncThunk(
  "commonData/fetchCommonData",
  async (
    { types, force = false }: { types: (keyof CommonData)[]; force?: boolean },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    // Filter out types that are already in the store, unless force is true
    const typesToFetch = force
      ? types
      : types.filter((type) => !state.commonData.data[type]);

    if (typesToFetch.length === 0) {
      return {}; // No need to fetch if all data is present and not forced
    }

    try {
      const query = typesToFetch.map((type) => `types=${type}`).join("&");
      const response = await $axios.get(`/common-data?${query}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch common data");
      }

      // Map response data to CommonData structure
      const responseData: CommonDataResponse = response.data.result;
      const mappedData = Object.entries(responseData).reduce(
        (acc, [responseKey, value]) => {
          const requestKey = reverseTypeMapping[responseKey];
          if (requestKey) {
            acc[requestKey] = value;
          }
          return acc;
        },
        {} as CommonData
      );

      return mappedData;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Redux slice
const commonDataSlice = createSlice({
  name: "commonData",
  initialState,
  reducers: {
    // Optional: Add a reducer to clear specific data if needed
    clearCommonData: (state, action: PayloadAction<(keyof CommonData)[]>) => {
      action.payload.forEach((type) => {
        delete state.data[type];
      });
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommonData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCommonData.fulfilled,
        (state, action: PayloadAction<CommonData>) => {
          state.status = "succeeded";
          state.data = { ...state.data, ...action.payload };
        }
      )
      .addCase(fetchCommonData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearCommonData } = commonDataSlice.actions;
export default commonDataSlice.reducer;
