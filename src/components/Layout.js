import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from './AuthContext';
import Particles from './Particles';

const Footer = () => (
  <footer className="w-full flex justify-center items-center sticky bottom-0 z-40 select-none pointer-events-auto" style={{ background: 'none' }}>
    <div className="py-4 text-center text-sm font-medium text-white/70 flex items-center gap-1">
      Made With <span className="mx-1 text-pink-400">♥</span> By
      <a
        href="https://github.com/lavsarkari"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1 underline underline-offset-2 text-purple-300 hover:text-purple-400 transition-colors"
      >
        LavSarkari
      </a>
    </div>
  </footer>
);

const Layout = () => {
  const { message, setMessage } = useAuth();
  return (
    <div className="min-h-screen sm:h-screen w-full flex flex-col items-center bg-transparent px-1 sm:px-4 sm:overflow-hidden">
      {/* Fullscreen Particles Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, width: '100vw', height: '100vh', background: '#000' }}>
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <div className="relative z-10">
        <Navbar />
        {message && (
          <div className="max-w-2xl mx-auto mt-4 mb-0 px-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded" role="alert">
              <span className="block sm:inline">{message}</span>
              <button
                onClick={() => setMessage('')}
                className="ml-4 text-yellow-700 font-bold"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        <main className="flex-1 w-full max-w-full sm:max-w-4xl flex flex-col items-center">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout; 