import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile" },
    { name: "description", content: "User Profile" },
  ];
}

export default function Profile() {
  return (
    <div>
      <h1>User Profile</h1>
      <div>
        <p>Name: Admin User</p>
        <p>Email: admin@hotel.com</p>
        <p>Role: Administrator</p>
      </div>
    </div>
  );
}
