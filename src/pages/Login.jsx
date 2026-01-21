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

  // 🔐 NORMAL LOGIN (B AUTH)
  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        form,
        { withCredentials: true }
      );

      await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
        { withCredentials: true }
      );

      navigate("/home", { replace: true });
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // 🌐 SSO LOGIN (REDIRECT TO A)
const loginWithSSO = () => {
  console.log("SSO button clicked");

  const redirectUri = encodeURIComponent(
    `${window.location.origin}/sso/callback`
  );

  console.log("Redirect URI:", redirectUri);
  console.log("SSO A URL:", import.meta.env.VITE_SSO_A_URL);

  window.location.href =
    `${import.meta.env.VITE_SSO_A_URL}/login?redirect_uri=${redirectUri}`;
};


  return (
    <div style={{ maxWidth: 400, margin: "60px auto" }}>
      <h2>Login to App B</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <button onClick={handleLogin} disabled={loading}>
        Login with Email
      </button>

      <hr />

      <button onClick={loginWithSSO}>
        Login with App A (SSO)
      </button>
    </div>
  );
}
