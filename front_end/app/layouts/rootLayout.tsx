import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Sidebar from "../components/shared/Sidebar";
import Navbar from "../components/shared/Navbar";
import { fetchCommonData } from "@/store/slices/commonDataSlice";
import { useAppDispatch, type RootState } from "@/store";
import { useFetchPermissions } from "@/hooks/useFetchPermissions";
import { useSelector } from "react-redux";
import { setUser, type UserLogin } from "@/store/slices/userDataSlice";
import Cookies from "js-cookie";
import $axios from "@/axios";
import Loading from "@/components/shared/Loading";

const fetchUser = async (id: number) => {
  const res = await $axios.get(`/user/${id}`);
  console.log("fetchUser response:", res.data.result);
  return res.data.result;
};

export default function RootLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userData);
  const [isInitializing, setIsInitializing] = useState(true);
  useFetchPermissions();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(
          fetchCommonData({
            types: [
              "roles",
              "provinces",
              "facility-types",
              "resource-actions",
              "hotel-documents",
              "hotel-types",
              "hotel-facilities",
            ],
            forceRefresh: true,
          })
        ).unwrap();
      } catch (err) {
        console.error("Fetch common data error:", err);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const initializeUser = async () => {
      const token = Cookies.get("token");

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));

          const userId = payload.userId || payload.id || payload.sub || 0;
          if (!userId) {
            throw new Error("No valid userId found in token payload");
          }

          const res = await fetchUser(userId);

          const userDataLoad: UserLogin = {
            id: res.id || 0,
            email: res.email || "",
            fullname: res.fullName || res.fullname || "",
            phoneNumber: res.phoneNumber || "",
            avatar: res.avatarUrl || res.avatar || "",
            role: res.roles || res.role || [],
            loading: false,
          };

          dispatch(setUser(userDataLoad));
        } catch (error) {
          console.error("Failed to restore user:", error);
          Cookies.remove("token");
          Cookies.remove("refreshToken");
          navigate("/login");
        }
      } else {
        console.log("No token found, redirecting to login");
        navigate("/login");
      }

      setIsInitializing(false);
    };

    initializeUser();
  }, [dispatch, navigate]);

  // Hiển thị loading khi đang khởi tạo
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <Loading />
      </div>
    );
  }

  if (!user.id) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden text-black">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="w-full px-4 py-4">
            <Outlet />
          </div>
        </main>
        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="w-full mx-auto">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                © 2024 Hotel Management System
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
