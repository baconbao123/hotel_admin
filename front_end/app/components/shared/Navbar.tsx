import { useState, useEffect } from "react";
import {
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightEndOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useLogout } from "@/hooks/use-logout";
import { Link } from "react-router";
import { Modal } from "./Modal";
import Cookies from "js-cookie";
import $axios from "@/axios";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { handleLogout } = useLogout();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // User info state
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    role: string;
    avatar: string;
    id: number;
  } | null>(null);

  useEffect(() => {
    // Lấy token từ Cookies và decode để lấy userId
    const token = Cookies.get("token");
    let userId: number | null = null;
    if (token) {
      try {
        // Decode JWT để lấy userId
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId =
          payload.userId ||
          payload.userID ||
          payload.userid ||
          payload.user_id ||
          payload.id;
        if (
          !userId &&
          typeof payload === "object" &&
          payload["userId"] !== undefined
        )
          userId = payload["userId"];
      } catch (err) {
        userId = null;
      }
    }

    if (!userId) return;

    $axios
      .get(`/user/2`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: any) => {
        // Nếu $axios đã parse sẵn json thì dùng res.data, còn nếu là fetch thì dùng res.json().
        const res1 = res.data || res;
        console.log("User API data:", res1.result);
        const data = res1.result || res1;
        setUserInfo({
          name: data.fullName ?? "Austin Robertson",
          email: data.email ?? "administrator@hotel.com",
          role: data.roles[0].roleName ?? "Administrator",
          avatar:
            data.avatarUrl ??
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          id: data.id ?? userId,
        });
      })
      .catch((err: any) => {
        console.log("User API error:", err);
        setUserInfo({
          name: "Austin Robertson",
          email: "administrator@hotel.com",
          role: "Administrator",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          id: userId!,
        });
      });
  }, []);

  const handleLogoutClick = () => {
    setIsProfileOpen(false);
    setShowLogoutConfirm(true);
    Cookies.remove("token");
    Cookies.remove("refreshToken");
  };

  const confirmLogout = () => {
    handleLogout();
    setShowLogoutConfirm(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="w-full mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Left side */}
          <h1 className="text-xl font-semibold text-gray-800"></h1>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg relative">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {/* Desktop Profile */}
            <div className="hidden md:flex items-center relative z-5">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src={`${
                    import.meta.env.VITE_REACT_APP_BACK_END_LINK_UPLOAD_USER
                  }/${userInfo?.avatar}`}
                  alt="User profile"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-700">
                    {userInfo?.name ?? "Austin Robertson"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userInfo?.role ?? "Administrator"}
                  </p>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden
                  animate-in fade-in slide-in-from-top-2 duration-200
                  border border-gray-100 origin-top"
                >
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="font-medium text-gray-700">
                      {userInfo?.name ?? "Austin Robertson"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userInfo?.email ?? "administrator@hotel.com"}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2
                        transition-colors duration-150"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2
                        transition-colors duration-150"
                    >
                      <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 space-y-3">
            <div className="flex items-center space-x-2 p-2 z-0">
              <img
                className="w-8 h-8 rounded-full "
                src={userInfo?.avatar}
                alt="User profile"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-700">
                  {userInfo?.name ?? "Austin Robertson"}
                </p>
                <p className="text-xs text-gray-500">
                  {userInfo?.role ?? "Administrator"}
                </p>
              </div>
            </div>
            {/* Menu Drop for Profile and Logout */}
            <div className="flex flex-col gap-1 px-2">
              <Link
                to="/profile"
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserCircleIcon className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogoutClick();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded transition"
              >
                <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
        {/* Replace the Dialog with Modal component */}
        <Modal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={confirmLogout}
          title="Confirm Logout"
          showFooter={true}
          confirmLabel="Logout"
          cancelLabel="Cancel"
          size="small"
          confirmSeverity="danger"
          confirmIcon="pi pi-sign-out"
        >
          <div className="flex flex-col gap-2">
            <p className="m-0">Are you sure you want to logout?</p>
            <p className="text-sm text-gray-500 m-0">
              You will be redirected to the login page.
            </p>
          </div>
        </Modal>
      </div>
    </nav>
  );
}
