import ForgotPassword from "~/pages/forgot-password/ForgotPassword";
import type { Route } from "./+types/forgot-password";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Forgot Password - Admin Login" },
    { name: "description", content: "Reset your password via email" },
  ];
}

export default function Route() {
  return <ForgotPassword />;
}
