// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import commonDataReducer from "@/store/slices/commonDataSlice";

export const store = configureStore({
  reducer: {
    commonData: commonDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { useDispatch } from "react-redux";
export const useAppDispatch = () => useDispatch<AppDispatch>();
