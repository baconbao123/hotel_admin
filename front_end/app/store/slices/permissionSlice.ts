import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "..";

interface Permission {
  resourceName: string;
  actionNames: string[];
}

interface PermissionState {
  permissions: Permission[];
  loading: boolean;
}

const initialState: PermissionState = {
  permissions: [],
  loading: false, 
};

const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissions(state, action: PayloadAction<Permission[]>) {
      state.permissions = action.payload || [];
      state.loading = false; 
    },
    startLoading(state) {
      state.loading = true;
    },
  },
});

export const { setPermissions, startLoading } = permissionSlice.actions;
export default permissionSlice.reducer;

export const selectHasPermission = (
  state: RootState,
  resourceName: string | undefined,
  actionName: string | undefined
) => {
  if (!resourceName || !actionName) return false;
  const resource = state.permissions.permissions.find(
    (p) =>
      p.resourceName &&
      p.resourceName.toLowerCase() === resourceName.toLowerCase()
  );
  if (!resource) return false;
  return resource.actionNames.includes(actionName.toLowerCase());
};

// Selector to check if permissions are loading
export const selectPermissionsLoading = (state: RootState) =>
  state.permissions.loading;
