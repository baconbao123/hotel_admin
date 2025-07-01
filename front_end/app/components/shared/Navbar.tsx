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
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import useAuth from "@/hooks/useAuth";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { handleLogout } = useLogout();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const user = useSelector((state: RootState) => state.userData);

  const { loading, error, fetchUserInfo } = useAuth();

  useEffect(() => {
    if (!user.id && !loading && !error) {
      fetchUserInfo();
    }
  }, [loading, error, fetchUserInfo]);

  const handleLogoutClick = () => {
    setIsProfileOpen(false);
    setShowLogoutConfirm(true);
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
                  }/${user?.avatarUrl}`}
                  alt="User profile"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-700">
                    {user?.fullname ?? "Austin Robertson"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.roles ?? "Administrator"}
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
                src={user?.avatarUrl}
                alt="User profile"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-700">
                  {user?.email ?? "Austin Robertson"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.roles ?? "Administrator"}
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
