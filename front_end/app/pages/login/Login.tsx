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
    <div className="login-wrapper">
    <div className="hidden-logo">
      <i className="fas fa-hotel"></i>
    </div>
    <div className="login-card">
      <div className="login-header">
        <h1 className="login-title">
          <img src="app/asset/images/minilogo.png" alt="Hotel Logo" className="header-logo" />
          Portal Hotel Management
        </h1>
        <p className="subtitle">Sign in to stay connected.</p>
      </div>  

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-envelope" />
              <InputText
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </IconField>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-lock" />
              <InputText
                id="password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
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
              <label htmlFor="remember">Remember me?</label>
            </div>
            <a href="#" className="forgot-password">
              Forgot Password
            </a>
          </div>

          <Button label="Sign in" className="sign-in-button" type="submit" />

          <div className="or-divider">
            <span>or sign in with other accounts?</span>
          </div>

          <div className="social-login">
    <Button
      icon="pi pi-google"
      className="google-login-button"
      aria-label="Google"
     
    />
  </div>

          <div className="sign-up-prompt">
            Don't have an account? <a href="/signup">Click here to sign up.</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
