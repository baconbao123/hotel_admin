import { configureStore } from "@reduxjs/toolkit";
import commonDataReducer from "./slices/commonDataSlice";
import permissionReducer from "./slices/permissionSlice";
import userReducer from "./slices/userDataSlice";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";

export const store = configureStore({
  reducer: {
    commonData: commonDataReducer,
    permissions: permissionReducer,
    userData: userReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
