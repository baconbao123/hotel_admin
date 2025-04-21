import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "./Login.css"; // dùng chung CSS

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    console.log("Email for password reset:", email);
    // Gọi API gửi mail reset password tại đây
  };

  return (
    <div className="loginx-container">
      <h1 className="login-title">
        <i className="pi pi-unlock login-title-icon" /> Forgot Password
      </h1>

      <p style={{ marginBottom: "1.5rem", textAlign: "center", color: "#666" }}>
        Enter your registered email address and we’ll send you instructions to reset your password.
      </p>

      <div className="form-group">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-envelope" />
          <InputText
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </IconField>
      </div>

      <Button
        label="Send Reset Link"
        icon="pi pi-send"
        className="p-button-rounded p-button-info"
        onClick={handleSubmit}
      />
    </div>
  );
};

export default ForgotPassword;
