import { useState, useEffect } from "react";
import $axios from "@/axios";
import { setUser, type UserLogin } from "@/store/slices/userDataSlice";
import { useAppDispatch } from "@/store";

interface ErrorResponse {
  code: number;
  message: string;
}

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const res = await $axios.get("/user/profile");
      const result = res.data.result;

      const userDataLoad: UserLogin = {
        id: result.id || 0,
        fullname: result.fullName || "",
        email: result.email || "",
        phoneNumber: result.phoneNumber || "",
        avatarUrl: result.avatarUrl || "",
        roles: result.roles || [],
        loading: false,
      };
      dispatch(setUser(userDataLoad));
      setError(null);
    } catch (err: any) {
      const errorResponse = err.response?.data as ErrorResponse;
      setError(errorResponse?.message || "Failed to fetch user info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return { loading, error, fetchUserInfo };
}
