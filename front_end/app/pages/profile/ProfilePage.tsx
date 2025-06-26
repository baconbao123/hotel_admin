import { useState } from "react";
import {
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import EditProfile from "./EditProfile";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);

  // Nếu đang trong chế độ chỉnh sửa, hiển thị EditProfile
  if (editing) {
    return <EditProfile onBack={() => setEditing(false)} />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white shadow-md rounded-xl p-8">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <UserCircleIcon className="w-16 h-16 text-gray-400" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Austin Robertson
            </h2>
            <p className="text-sm text-gray-500">Administrator</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Email</p>
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-gray-400" />
              <p className="font-medium text-gray-800">administrator@hotel.com</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Role</p>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
              <p className="font-medium text-gray-800">Administrator</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Account Created</p>
            <p className="font-medium text-gray-800">January 1, 2024</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Status</p>
            <p className="inline-block px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full font-medium">
              Active
            </p>
          </div>
        </div>

        <div className="mt-8 text-right">
          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
