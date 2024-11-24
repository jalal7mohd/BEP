import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ handleLogout }) => {
  const navigate = useNavigate();

  return (
    <nav style={{ padding: '10px', background: '#f4f4f4', borderBottom: '1px solid #ccc' }}>
      <button onClick={() => navigate('/home')} style={{ marginRight: '10px' }}>
        Home
      </button>
      <button onClick={() => navigate('/profile')} style={{ marginRight: '10px' }}>
        Profile
      </button>
      <button onClick={handleLogout} style={{ marginRight: '10px' }}>
        Logout
      </button>
    </nav>
  );
};

export default NavBar;
