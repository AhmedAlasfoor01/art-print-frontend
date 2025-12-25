// src/components/NavBar/NavBar.jsx

import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { UserContext } from '../contexts/Contexts';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);//to show or hide the menu or the dropdown 

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={isActive(to) ? 'btn btnPrimary' : 'btn'}
      style={{ textDecoration: 'none' }}
    >
      {children}
    </Link>
  );

  return (
    <nav className="nav">
      <div className="container">
        <div className="navInner">
          
          <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'var(--text)' }}>
            <h1 style={{ margin: 0, fontSize: '20px' }}>The Art Gallery</h1>
          </Link>

          <div className="navRight">
            {user ? (
              <>
                <NavLink to="/products">Products</NavLink>
                <NavLink to="/orders">Your Orders</NavLink>
                <button
                  onClick={handleSignOut}
                  className="btn"
                  style={{ color: '#dc2626' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/sign-up">Sign Up</NavLink>
                <Link
                  to="/sign-in"
                  className="btn btnPrimary"
                  style={{ textDecoration: 'none' }}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;