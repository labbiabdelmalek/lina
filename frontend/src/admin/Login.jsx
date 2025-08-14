import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // نستعمل instance باش يكون withCredentials مفعّل

function Login() {
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErreur("");

    try {
      // الباكيند كيتسنى motdepasse مش password
      await api.post("/api/auth/login", {
        email,
        motdepasse
      });

      // إذا بغيت تخزن التوكن من الرد
      // localStorage.setItem("token", res.data.token);

      navigate("/admin");
    } catch (err) {
      setErreur("Email ou mot de passe incorrects");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Connexion Admin</h2>
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
        <button type="submit" className="btn btn-primary">
          Se connecter
        </button>
      </form>
      {erreur && <p className="text-danger mt-3">{erreur}</p>}
    </div>
  );
}

export default Login;
