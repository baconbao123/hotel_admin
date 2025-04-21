
import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Hotel Admin Dashboard" },
  ];
}

export default function Dashboard() {
  return (
    <div>
      <h1>This is Dashboard</h1>
      <div>
        <h2>Quick Stats</h2>
        <ul>
          <li>Total Rooms: 50</li>
          <li>Available Rooms: 30</li>
          <li>Bookings Today: 5</li>
        </ul>
      </div>
    </div>
  );
}
