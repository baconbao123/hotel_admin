import { setPermissions } from "@/store/slices/permissionSlice";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    dispatch(setPermissions([]));
    navigate("/login");
  };

  return { handleLogout };
};
