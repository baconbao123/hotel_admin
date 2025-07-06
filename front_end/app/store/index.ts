import { configureStore } from "@reduxjs/toolkit";

import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";

import commonSlince from './slice/commonSlince'
import userDataSlice from './slice/userDataSlice'
import permissionSlice from './slice/permissionSlice'
import commonDataReducer from "./slice/commonDataSlice";

export const store = configureStore({
  reducer: {
    commonSlince: commonSlince,
    userDataSlice: userDataSlice,
    permissionSlice: permissionSlice,
    commonData: commonDataReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;