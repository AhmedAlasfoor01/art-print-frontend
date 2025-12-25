// src/components/Landing.jsx

import { useNavigate } from 'react-router';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="hero">
        <div>
          <h1>Welcome to The Art Gallery</h1>
          <p>
            The Art Gallery Makes Your Art Prints Near To You. 
            Create Your Account and Grab Your Favorite Art Print.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/sign-up')}
              className="btn btnPrimary"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/sign-in')}
              className="btn"
            >
              Sign In
            </button>
          </div>
        </div>
        <div className="heroCard">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <span style={{ fontSize: '48px' }}>🎨</span>
            <p style={{ marginTop: '12px', color: 'var(--muted)' }}>
              Discover beautiful art prints
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;