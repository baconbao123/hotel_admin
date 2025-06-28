import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import "./ResetPassword.scss";
import $axios from "@/axios";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

    setIsLoading(true);

    try {
      const response = await $axios.post(
        `/auth/reset-password-profile?token=${token}&newPassword=${newPassword}`
      );

      if (response.status == 200) {
        setSuccess("Password reset successfully! You can now log in.");
        navigate("/");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {success && <p className="success">{success}</p>}
      {!success && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="newPassword">New Password</label>
            <InputText
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <InputText
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error mt-1">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
