import { useState } from "react";
import { supabase } from "./supabase";

export default function Auth() {
    const [mode, setMode] = useState("login"); // login | signup
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        if (mode === "signup") {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: name } },
            });
            if (error) setError(error.message);
            else setMessage("Check your email for a confirmation link!");
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) setError(error.message);
        }

        setLoading(false);
    };

    const CSS = `
         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .auth-card { animation: fadeUp 0.45s ease both; }
    input { border: none; outline: none; width: 100%;
            font-family: 'DM Sans', sans-serif; background: transparent; }
    `;

    return (
        <>
        <style>{CSS}</style>
        
        {/* Background */}
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f1f0ee 0%, #e8e5df 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px",
        }}>
            <div className="auth-card" style={{
                width: "100%", maxWidth: "420px",
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(16px)",
                borderRadius: "22px",
                border: "1px solid rgba(0,0,0,0.07)",
                padding: "44px 40px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            }}>
                {/* Title */}
                <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "32px", fontWeight: "700",
                    color: "#1a1816", textAlign: "center",
                    marginBottom: "6px",
                }}>
                    My Journal
          </h1>
          <p style={{
            textAlign: "center", fontSize: "13px",
            color: "#78716c", marginBottom: "36px",
          }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>

          {/* Name field — signup only */}
          {mode === "signup" && (
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", color: "#78716c", display: "block", marginBottom: "6px" }}>
                First name
              </label>
              <div style={{
                padding: "11px 14px",
                background: "rgba(0,0,0,0.04)",
                borderRadius: "10px",
              }}>
                <input
                  type="text"
                  placeholder="Alex"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ fontSize: "14px", color: "#1a1816" }}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "12px", color: "#78716c", display: "block", marginBottom: "6px" }}>
              Email
            </label>
            <div style={{
              padding: "11px 14px",
              background: "rgba(0,0,0,0.04)",
              borderRadius: "10px",
            }}>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ fontSize: "14px", color: "#1a1816" }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "12px", color: "#78716c", display: "block", marginBottom: "6px" }}>
              Password
            </label>
            <div style={{
              padding: "11px 14px",
              background: "rgba(0,0,0,0.04)",
              borderRadius: "10px",
            }}>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ fontSize: "14px", color: "#1a1816" }}
              />
            </div>
          </div>

          {/* Error / success messages */}
          {error && (
            <p style={{
              fontSize: "13px", color: "#b91c1c",
              background: "#fee2e2", borderRadius: "8px",
              padding: "10px 14px", marginBottom: "16px",
            }}>
              {error}
            </p>
          )}
          {message && (
            <p style={{
              fontSize: "13px", color: "#14532d",
              background: "#dcfce7", borderRadius: "8px",
              padding: "10px 14px", marginBottom: "16px",
            }}>
              {message}
            </p>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "13px",
              background: loading ? "#a8a29e" : "#44403c",
              color: "white", border: "none",
              borderRadius: "12px", cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
              fontWeight: "600", letterSpacing: "0.02em",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>

          {/* Toggle mode */}
          <p style={{
            textAlign: "center", marginTop: "20px",
            fontSize: "13px", color: "#78716c",
          }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}
              style={{ color: "#44403c", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}