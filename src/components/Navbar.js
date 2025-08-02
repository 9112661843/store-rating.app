import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Store Ratings
        </Link>
        <ul className="navbar-nav">
          {user ? (
            <>
              {user.role === 'admin' && (
                <>
                  <li><Link to="/admin/dashboard" className="nav-link">Dashboard</Link></li>
                  <li><Link to="/admin/users" className="nav-link">Users</Link></li>
                  <li><Link to="/admin/stores" className="nav-link">Stores</Link></li>
                </>
              )}
              {user.role === 'user' && (
                <>
                  <li><Link to="/stores" className="nav-link">Stores</Link></li>
                  <li><Link to="/profile" className="nav-link">Profile</Link></li>
                </>
              )}
              {user.role === 'store_owner' && (
                <>
                  <li><Link to="/store-owner/dashboard" className="nav-link">Dashboard</Link></li>
                </>
              )}
              <li>
                <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="nav-link">Login</Link></li>
              <li><Link to="/register" className="nav-link">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 