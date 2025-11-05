import { useState } from "react";
import API from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });

  const submit = async () => {
    const res = await API.post("/users/login/", form);
    localStorage.setItem("token", res.data.access);
    alert("Logged in!");
  };

  return (
    <div>
      <input placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}/>
      <input placeholder="Password" type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}/>
      <button onClick={submit}>Login</button>
    </div>
  );
}
