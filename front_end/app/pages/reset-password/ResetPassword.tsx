import { useEffect, useState } from "react";
import type { Route } from "../../+types/root";
import { redirect, useSearchParams } from "react-router";
import { useNavigate } from "react-router";
import $axios from "~/axios";
import { disableLoading, setLoading } from "~/store/slice/commonSlince";
import { useDispatch } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reset password" },
    { name: "description", content: "Hotel Admin Reset password" },
  ];
}

export default function Home() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
    useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid or missing token.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    dispatch(setLoading())
    try {
      const response = await $axios.post(
        `/auth/reset-password-profile?token=${token}&newPassword=${newPassword}`
      );

      if (response.status == 200) {
        toast.success("Password reset successfully!");
        navigate("/");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      dispatch(disableLoading());
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100 w-200  ">
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center ">Reset Password</h2>
      {success && <p className="text-green-600 text-center mb-4 font-medium">{success}</p>}
      {!success && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-semibold mb-1 text-gray-700">
              New Password
            </label>
            <InputText
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-1 text-gray-700">
              Confirm Password
            </label>
            <InputText
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {error && <p className="text-red-600 text-center mt-1 font-medium">{error}</p>}
          <div className="flex justify-center">
            <Button type="submit">
              Reset Password
            </Button>
          </div>
        </form>
      )}
    </div>
  </div>
  );
}
