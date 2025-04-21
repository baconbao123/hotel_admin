import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Đảm bảo import theme
import "primereact/resources/primereact.min.css";
import "./Login.css";
import axios from "axios";
import Cookies from "js-cookie";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState<boolean>(false);

  const handleSubmit = async (e: any): Promise<void> => {
    e.preventDefault();
    const loginData: LoginForm = { email, password, remember };
    try {
      const response = await axios.post(
        "http://localhost:9898/hotel/api/auth/login",
        loginData
      );
      if (response.data.code == 200) {
        Cookies.set("token", response.data.result.token);
        Cookies.set("refreshtoken", response.data.result.refreshToken);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="loginx-container">
      <h1 className="login-title">
        <i className="pi pi-shield login-title-icon" /> Welcome Admin Login
      </h1>

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

      <div className="form-group">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-lock" />
          <InputText
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </IconField>
      </div>

      <div className="remember-forgot-container">
        <div className="remember-me">
          <Checkbox
            inputId="remember"
            checked={remember}
            onChange={(e) => setRemember(e.checked ?? false)}
          />
          <label htmlFor="remember" style={{ marginLeft: "8px" }}>
            Remember Me
          </label>
        </div>
        <div className="forgot-password">
          <i className="pi pi-question-circle" /> Forgotten Password
        </div>
      </div>

      <Button
        label="Login"
        icon="pi pi-sign-in"
        className="p-button-rounded p-button-info"
        onClick={handleSubmit}
      />
    </div>
  );
};

export default Login;
