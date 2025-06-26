import { useState } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useLogout } from "@/hooks/use-logout";
import { Link } from "react-router";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Modal } from './Modal';
import Cookies from "js-cookie";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // In your Navbar component, add:
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { handleLogout } = useLogout();
  // Add new state for logout confirmation
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
            {/* Desktop Search */}
            <div className="hidden md:block w-72">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

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
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User profile"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-700">Austin Robertson</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden
                  animate-in fade-in slide-in-from-top-2 duration-200
                  border border-gray-100 origin-top"
                >
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="font-medium text-gray-700">
                      Austin Robertson
                    </p>
                    <p className="text-xs text-gray-500">
                      administrator@hotel.com
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2
                        transition-colors duration-150"
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
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 p-2">
              <img
                className="w-8 h-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User profile"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-700">Austin Robertson</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
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
