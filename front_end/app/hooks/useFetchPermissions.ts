import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPermissions, startLoading } from "@/store/slices/permissionSlice";
import { fetchUserResources } from "@/components/service/api";
import Cookies from "js-cookie"; // Import Cookies để theo dõi token

export const useFetchPermissions = () => {
  const dispatch = useDispatch();
  const permissions = useSelector(
    (state: any) => state.permissions.permissions
  );
  const loading = useSelector((state: any) => state.permissions.loading);
  const currentToken = Cookies.get("token"); 

  useEffect(() => {
    const loadResources = async () => {
      if (
        !loading &&
        (!permissions || permissions.length === 0 || !currentToken)
      ) {
        try {
          dispatch(startLoading());
          console.log("Starting permission fetch for token:", currentToken);
          const response = await fetchUserResources();
          console.log("Permission fetch response:", response);
          dispatch(setPermissions(response.result || response));
        } catch (error) {
          console.error("Permission fetch failed:", error);
          dispatch(setPermissions([]));
        }
      }
    };

    loadResources();
  }, [dispatch, permissions, loading, currentToken]); 

  return permissions;
};
