// pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "Login failed");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <Layout>
      <div style={{display:"flex", gap:20, alignItems:"flex-start"}}>
        <div className="form">
          <h2>Login</h2>
          <p className="small">Please log in to access your TaskBoards.</p>

          <form onSubmit={handleSubmit}>
            <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input className="input" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" />
            {err && <p style={{color:"crimson"}}>{err}</p>}
            <button className="btn" type="submit">Log in</button>
          </form>

          <p style={{marginTop:12}}>
            No account?{" "}
            <Link href="/register" className="link-text">Register</Link>
          </p>
        </div>

        <div style={{flex:1}}>
         
        </div>
      </div>
    </Layout>
  );
}
