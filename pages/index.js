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
      <div className="auth-container">
        <div className="auth-card">
          <h2>Login</h2>
          <p className="subtitle">Please log in to access your TaskBoards.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input
                className="form-input"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                id="email-login" // Unique ID
                name="email-login" // Different from standard names
              />
            </div>
            
            <div className="form-group">
              <input
                className="form-input"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password" // Prevent autofill
                id="password-login" // Unique ID
                name="password-login" // Different from standard names
              />
            </div>
            
            {err && <p className="error-message">{err}</p>}
            
            <button className="auth-btn" type="submit">
              Login
            </button>
          </form>

          <p className="auth-link">
            No account?{" "}
            <Link href="/register" className="link">
              Register
            </Link>
          </p>
        </div>
      </div>

     

      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 120px);
          padding: 20px;
        }
        
        .auth-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 400px;
        }
        
        .auth-card h2 {
          margin: 0 0 8px 0;
          text-align: center;
        }
        
        .subtitle {
          color: #64748b;
          text-align: center;
          margin: 0 0 20px 0;
        }
        
        .auth-form {
          margin-bottom: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 16px;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #4f46e5;
        }
        
        .auth-btn {
          width: 100%;
          background: #4f46e5;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 10px;
        }
        
        .auth-btn:hover {
          background: #4338ca;
        }
        
        .error-message {
          color: #dc2626;
          font-size: 14px;
          margin: 10px 0;
          text-align: center;
        }
        
        .auth-link {
          text-align: center;
          color: #64748b;
        }
        
        .link {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 500;
        }
        
        .link:hover {
          text-decoration: underline;
        }
      `}</style>
    </Layout>
  );
}