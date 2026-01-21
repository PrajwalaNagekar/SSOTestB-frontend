import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    handleLogin();
  };

  // 🔐 NORMAL LOGIN (B AUTH)
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        form,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
        { withCredentials: true }
      );

      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // 🌐 SSO LOGIN (REDIRECT TO A)
  const loginWithSSO = () => {
    console.log("SSO button clicked");
    
    // Get SSO URL from env, fallback to localhost:5174 if not set
    const ssoUrl = import.meta.env.VITE_SSO_A_URL || 'http://localhost:5174';
    const redirectUri = `${window.location.origin}/sso/callback`;
    
    console.log("Redirect URI:", redirectUri);
    console.log("SSO URL:", ssoUrl);
    console.log("Current origin:", window.location.origin);
    
    // Construct the SSO URL
    const ssoRedirectUrl = `${ssoUrl}/login?redirect_uri=${encodeURIComponent(redirectUri)}`;
    console.log("Full SSO redirect URL:", ssoRedirectUrl);
    
    // Redirect to SSO provider
    window.location.href = ssoRedirectUrl;
  };

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: "60px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Login to App B</h2>

      {error && (
        <div style={{ 
          color: "white", 
          backgroundColor: "#f44336", 
          padding: "10px", 
          borderRadius: "4px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input 
            name="email" 
            placeholder="Email" 
            value={form.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px"
            }}
          />
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            value={form.password}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px"
            }}
          />
        </div>

        <button 
          type="submit"
          onClick={handleLogin} 
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            marginBottom: "20px"
          }}
        >
          {loading ? "Logging in..." : "Login with Email"}
        </button>
      </form>

      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        margin: "20px 0" 
      }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }}></div>
        <span style={{ padding: "0 10px", color: "#666" }}>OR</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }}></div>
      </div>

      <button 
        onClick={loginWithSSO}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#f0f0f0",
          color: "#333",
          border: "1px solid #ddd",
          borderRadius: "4px",
          fontSize: "16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px"
        }}
      >
        <span>🔐</span>
        Login with App A (SSO)
      </button>

      <div style={{ 
        marginTop: "30px", 
        padding: "15px", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "4px",
        fontSize: "14px",
        color: "#666"
      }}>
        <strong>Debug Info:</strong>
        <div>App B: {window.location.origin}</div>
        <div>SSO URL: {import.meta.env.VITE_SSO_A_URL || 'http://localhost:5174'}</div>
      </div>
    </div>
  );
}