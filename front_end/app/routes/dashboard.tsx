import type { Route } from "./+types/home";
import Dashboard from "~/pages/admin/dashboard/Dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Admin" },
    { name: "description", content: "Admin dashboard page" },
  ];
}

export default function Route() {
  return <Dashboard />;
}
