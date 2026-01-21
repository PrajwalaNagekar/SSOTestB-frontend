import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SsoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ssoToken = params.get("token");

    if (!ssoToken) {
      navigate("/login");
      return;
    }

    const login = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/sso/login`,
          { ssoToken },
          { withCredentials: true }
        );

        await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
          { withCredentials: true }
        );

        navigate("/home", { replace: true });
      } catch {
        navigate("/login");
      }
    };

    login();
  }, []);

  return <p>Signing you in…</p>;
}
