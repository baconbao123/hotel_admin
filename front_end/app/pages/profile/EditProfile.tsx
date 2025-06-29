import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import ImageUploader from "@/utils/ImageUploader";
import $axios from "@/axios";
import { useNavigate } from "react-router";

interface Props {
  onBack: () => void;
}

export default function EditProfile({ onBack }: Props) {
  const user = useSelector((state: RootState) => state.userData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<Object | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated:", formData);

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.phoneNumber);

    if (selectedFile) {
      formDataToSend.append("avatarUrl", selectedFile);
      formDataToSend.append("keepAvatar", "false");
      formDataToSend.append("keepAvatar", "true");
    }

    try {
      const response = await $axios.put(
        `/user/profile?id=${user.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err.response?.data?.errorMessages || "Failed to update profile");
      throw new Error(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  };

  const [formData, setFormData] = useState({
    name: user.fullname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    avatarUrl: user.avatar,
  });

  const getError = (field: string) =>
    (error &&
      typeof error === "object" &&
      (error as Record<string, string>)[field]) ||
    null;

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
            <ImageUploader
              initialImageUrl={
                formData.avatarUrl
                  ? `${
                      import.meta.env.VITE_REACT_APP_BACK_END_LINK_UPLOAD_USER
                    }/${formData.avatarUrl}`
                  : undefined
              }
              onFileChange={(file) => setSelectedFile(file)}
              maxFileSize={2}
            />
          </div>
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
            {getError("name") && (
              <small className="text-red-500 text-xs">{getError("name")}</small>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
            {getError("email") && (
              <small className="text-red-500 text-xs">
                {getError("email")}
              </small>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
            {getError("phoneNumber") && (
              <small className="text-red-500 text-xs">
                {getError("phoneNumber")}
              </small>
            )}
          </div>

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
