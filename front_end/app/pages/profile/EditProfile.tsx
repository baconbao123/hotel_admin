import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface Props {
  onBack: () => void;
}

export default function EditProfile({ onBack }: Props) {
  const [formData, setFormData] = useState({
    name: "Austin Robertson",
    email: "administrator@hotel.com",
    role: "Administrator",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated:", formData);
    onBack(); // Gọi callback để quay lại trang profile
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white shadow-md rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
          <button
            onClick={onBack}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Profile
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              disabled
              className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
            />
          </div> */}

          <div className="text-right">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
