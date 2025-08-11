import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api';

function Login() {
  const [email, setEmail] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, motdepasse });
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      setErreur("Email ou mot de passe incorrect");
    }
  };

  return (/* ... */);
}
export default Login;
