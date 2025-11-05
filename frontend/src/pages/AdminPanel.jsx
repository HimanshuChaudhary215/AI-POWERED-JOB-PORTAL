import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminPanel() {
  const [stats, setStats] = useState({ users: 0, jobs: 0 });

  useEffect(() => {
    API.get("/admin-panel/stats/").then(res => setStats(res.data));
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Total Users: {stats.users}</p>
      <p>Total Jobs: {stats.jobs}</p>
    </div>
  );
}
