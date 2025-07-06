import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import $axios from "~/axios";
import type { RootState } from "..";

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
  owners?: any[];
  userTypes?: any[];
}

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
  owners?: any[];
  usertypes?: any[];
}

interface CommonDataState {
  data: CommonData;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: CommonDataState = {
  data: {},
  status: "idle",
};

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
  owners: "owners",
  usertypes: "userTypes",
};

const reverseTypeMapping: Record<string, keyof CommonData> = Object.entries(
  typeMapping
).reduce((acc, [requestType, responseType]) => {
  acc[responseType] = requestType as keyof CommonData;
  return acc;
}, {} as Record<string, keyof CommonData>);

export const fetchCommonData = createAsyncThunk(
  "commonData/fetchCommonData",
  async (
    {
      types,
      force = false,
      params = {},
    }: {
      types: (keyof CommonData)[];
      force?: boolean;
      params?: Record<string, any>;
    },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const typesToFetch = force
      ? types
      : types.filter((type) => !state.commonData.data[type]);

    if (typesToFetch.length === 0) {
      return {};
    }

    try {
      const searchParams = new URLSearchParams();

      typesToFetch.forEach((type) => {
        searchParams.append("types", type);
      });

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await $axios.get(
        `/common-data?${searchParams.toString()}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch common data");
      }

      const responseData: CommonDataResponse = response.data.result;
      const currentData = state.commonData.data; // Get current Redux state

      const mappedData = Object.entries(responseData).reduce(
        (acc, [responseKey, value]) => {
          const requestKey = reverseTypeMapping[responseKey];
          if (requestKey && typesToFetch.includes(requestKey)) {
            // Only update if value is a non-empty array; otherwise, keep existing data
            if (Array.isArray(value) && value.length > 0) {
              acc[requestKey] = value;
            } else {
              // Preserve existing data if it exists
              acc[requestKey] = currentData[requestKey] || [];
            }
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

const commonDataSlice = createSlice({
  name: "commonData",
  initialState,
  reducers: {
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
