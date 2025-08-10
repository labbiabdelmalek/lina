import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
      Déconnexion
    </button>
  );
}

export default LogoutButton;
