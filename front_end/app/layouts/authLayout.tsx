import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Hotel Admin</h1>
        </div>

        <Outlet />

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 Hotel Management System</p>
        </div>
      </div>
    </div>
  );
}