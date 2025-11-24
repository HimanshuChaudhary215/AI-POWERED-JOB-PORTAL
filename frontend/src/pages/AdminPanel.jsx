import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminPanel() {
  const [stats, setStats] = useState({ users: 0, jobs: 0 });
  const bg = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=60";

  useEffect(() => {
    API.get("/admin-panel/stats/").then(res => setStats(res.data)).catch(() => setStats({ users: 0, jobs: 0 }));
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundImage: `linear-gradient(120deg, rgba(17,24,39,0.85), rgba(6,78,59,0.6)), url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-4xl mx-auto py-24 px-6">
        <div className="bg-white/95 rounded-xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg shadow">
              <h2 className="text-sm">Total Users</h2>
              <p className="text-2xl font-bold mt-2">{stats.users}</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow">
              <h2 className="text-sm">Total Jobs</h2>
              <p className="text-2xl font-bold mt-2">{stats.jobs}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
