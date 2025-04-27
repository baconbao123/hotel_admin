import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8"></div>

        <Outlet />

        <div className="mt-8 text-center text-sm text-gray-600">
        </div>
      </div>
    </div>
  );
}
