import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ username:"", email:"", password:"", role:"candidate" });

  const submit = async () => {
    await API.post("/users/register/", form);
    alert("Registered!");
  };

  return (
    <div>
      <input placeholder="Username" onChange={(e)=>setForm({...form,username:e.target.value})}/>
      <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <input placeholder="Password" type="password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
      <select onChange={(e)=>setForm({...form,role:e.target.value})}>
        <option value="candidate">Candidate</option>
        <option value="recruiter">Recruiter</option>
      </select>
      <button onClick={submit}>Register</button>
    </div>
  );
}
