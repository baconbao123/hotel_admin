import { useEffect } from "react";
import type { Route } from "../../+types/root";
import { redirect } from "react-router";
import { useNavigate } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Hotel Admin Home" },
  ];
}

export default function Home() {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/login')
    }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4"></h1>
    </div>
  );
}
