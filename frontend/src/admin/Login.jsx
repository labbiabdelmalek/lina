import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        motdepasse
      });

      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      setErreur("Email ou mot de passe incorrect");
    }
  };

  return (
    <div>
      <h2>Connexion Admin</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motdepasse}
          onChange={(e) => setMotdepasse(e.target.value)}
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        />
        <button type="submit">Se connecter</button>
      </form>

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
    </div>
  );
}

export default Login;
