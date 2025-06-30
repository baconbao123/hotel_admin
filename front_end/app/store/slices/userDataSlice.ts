import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserLogin {
  id: number;
  email: string;
  fullname: string;
  phoneNumber: string;
  avatar: string;
  loading: boolean;
  role: [];
}

const initialState: UserLogin = {
  id: 0,
  email: "",
  fullname: "",
  phoneNumber: "",
  avatar: "",
  loading: false,
  role: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserLogin>) {
      state.id = action.payload.id || 0;
      state.email = action.payload.email || "";
      state.fullname = action.payload.fullname || "";
      state.phoneNumber = action.payload.phoneNumber || "";
      state.avatar = action.payload.avatar || "";
      state.loading = false;
      state.role = action.payload.role || [];
    },
    startLoading(state) {
      state.loading = true;
    },
    logout(state) {
      state.id = initialState.id;
      state.email = initialState.email;
      state.fullname = initialState.fullname;
      state.phoneNumber = initialState.phoneNumber;
      state.avatar = initialState.avatar;
      state.role = initialState.role;
    },
  },
});

export const { setUser, startLoading } = userSlice.actions;
export default userSlice.reducer;
