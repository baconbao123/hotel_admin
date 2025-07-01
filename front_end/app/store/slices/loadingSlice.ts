import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    isLoading: true,
  },
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
    },
    setLoaded: (state) => {
      state.isLoading = false;
    },
  },
});

export const { setLoading, setLoaded } = loadingSlice.actions;
export default loadingSlice.reducer;
