import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const bg = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=60";

  const submit = async () => {
    try {
      const res = await API.post("/users/login/", form);
      // store token under key expected by axiosInstance
      localStorage.setItem("access_token", res.data.access);
      alert("Logged in!");
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <main className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 w-full max-w-md p-8 bg-white/90 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-center text-2xl font-bold text-gray-900">Sign in to your account</h2>

          <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); submit(); }}>
            <input
              className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <input
              className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">Sign in</button>
          </form>
        </div>
      </section>
    </main>
  );
}
