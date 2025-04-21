import Login from "~/pages/login/Login";
import type { Route } from "./+types/home";
import Dashboard from "~/pages/admin/dashboard/Dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Route() {
  return <Login />;
}
