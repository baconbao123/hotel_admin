import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "..";
import { setLoading } from "./commonSlince";

interface Permission {
  resourceName: string;
  actionNames: string[];
}

interface PermissionState {
  permissions: Permission[];
  loadPermisison: Boolean
}

const initialState: PermissionState = {
  permissions: [],
  loadPermisison: false
};

const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissions(state, action: PayloadAction<Permission[]>) {
      state.permissions = action.payload || [];
      state.loadPermisison = true
    },
    setLoadedPermission(state) {
      state.loadPermisison = true
    }
  },
});

export const { setPermissions, setLoadedPermission } = permissionSlice.actions;
export default permissionSlice.reducer;

