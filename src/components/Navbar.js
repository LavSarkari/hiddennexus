import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Dock from './Dock';

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="sticky top-4 z-50 w-full flex justify-center">
      <div className="relative w-full flex justify-center">
        <Dock className="max-w-4xl w-full mx-auto rounded-full backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl px-2 py-1 flex-nowrap">
          {/* Left: Logo */}
          <Dock.Left>
            <Link to="/" className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors">
              <span className="text-2xl text-blue-500 drop-shadow-[0_0_8px_rgba(80,120,255,0.7)]">🌀</span>
              <span className="font-bold text-white text-lg">HiddenNexus</span>
            </Link>
          </Dock.Left>
          {/* Center: Empty */}
          <Dock.Center />
          {/* Right: Navigation Links */}
          <Dock.Right className="gap-2 pr-2">
            <Link
              to="/confess"
              className={`px-4 py-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 text-sm font-semibold ${location.pathname === '/confess' ? 'bg-white/20 text-white' : ''}`}
            >
              Confess
            </Link>
            <Link
              to="/confessions"
              className={`px-4 py-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 text-sm font-semibold ${location.pathname === '/confessions' ? 'bg-white/20 text-white' : ''}`}
            >
              View All
            </Link>
          </Dock.Right>
        </Dock>
        {/* Reflection/Glow */}
        <div className="absolute left-0 right-0 mx-auto -bottom-3 h-4 max-w-4xl rounded-b-full pointer-events-none opacity-60 blur-md" style={{background: 'linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.01) 80%)'}} />
      </div>
    </nav>
  );
};

export default Navbar; 