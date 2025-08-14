// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // instance ديال axios فيه baseURL و withCredentials مفعّل

function Login() {
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErreur("");

    try {
      // إرسال البيانات للباك (الباك كيتسنى motdepasse ماشي password)
      const res = await api.post("/api/auth/login", {
        email,
        motdepasse
      });

      // تخزين التوكن باش نستعمله في الصفحات المحمية
      localStorage.setItem("token", res.data.token);

      // التوجيه لصفحة الأدمن
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setErreur("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Connexion Admin</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control mb-2"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motdepasse}
          onChange={(e) => setMotdepasse(e.target.value)}
          className="form-control mb-3"
          required
        />
        <button type="submit" className="btn btn-primary w-100">
          Se connecter
        </button>
      </form>
      {erreur && <p className="text-danger mt-3 text-center">{erreur}</p>}
    </div>
  );
}

export default Login;
