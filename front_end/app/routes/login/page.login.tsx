import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Login to Hotel Admin" },
  ];
}

export default function Login() {
  return (
    <div>
      <h1 className="text-black">This is Login Page</h1>
      <form>
        
      </form>
    </div>
  );
}