import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Setting" },
    { name: "description", content: "" },
  ];
}

export default function Setting() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">This is setting page</h2>
    </div>
  );
}