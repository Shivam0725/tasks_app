// pages/register.js
import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "Registration failed");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <Layout>
      <div className="form">
        <h2>Create account</h2>
        <form onSubmit={handleSubmit}>
          <input className="input" placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="input" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" />
          {err && <p style={{color:"crimson"}}>{err}</p>}
          <button className="btn" type="submit">Register</button>
        </form>
        <p style={{marginTop:12}}>Already have an account? <a href="/">Login</a></p>
      </div>
    </Layout>
  );
}
