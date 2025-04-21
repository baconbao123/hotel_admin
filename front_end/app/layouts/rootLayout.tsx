import { Outlet } from "react-router";
import { useEffect } from "react";
import Sidebar from "../components/shared//Sidebar";


export default function RootLayout() {
  // Handle authentication check
  useEffect(() => {
    // Add authentication check logic here
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden text-black">
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
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
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
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