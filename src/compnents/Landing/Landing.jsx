// src/components/Landing.jsx

import { useNavigate } from 'react-router';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <div className="inline-block bg-blue-600 p-3 rounded-lg mb-6">
            <span className="text-4xl">💰</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            Welcome to The Art Gallery
          </h1>
          
          <h2 className="text-xl md:text-2xl text-slate-700 mb-4">
            The Art Gallery Makes Your Art Prints Near To You 
          </h2>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            With The Art Galley, You Can Create Your Account and Grab Your Fav Art Print 
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/sign-up')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/sign-in')}
              className="bg-white hover:bg-slate-100 text-slate-700 font-medium py-3 px-6 rounded-lg border border-slate-300 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Key Features
          </h2>

          <div className="space-y-6">
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;