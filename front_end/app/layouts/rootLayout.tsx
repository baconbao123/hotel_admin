import { Outlet } from "react-router";
import { useEffect } from "react";
import Sidebar from "../components/shared//Sidebar";
import Navbar from "../components/shared/Navbar";

export default function RootLayout() {
  useEffect(() => {
    console.log("RootLayout mounted");
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden text-black">
        <Navbar />
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="px-4 py-8 mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                &copy; 2024 Hotel Management System
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
