import React from 'react';
import { Link } from 'react-router-dom';
import Particles from '../components/Particles';

const Home = () => {
  return (
    <>
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
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-transparent">
        {/* Hero Section */}
        <section className="w-full max-w-2xl mx-auto text-center mb-16 bg-transparent">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Welcome to <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-md">HiddenNexus</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 font-medium">
            Confess. Connect. Disappear.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link
              to="/confess"
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-bold hover:from-blue-500 hover:to-cyan-300 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              Make a Confession
            </Link>
            <Link
              to="/confessions"
              className="inline-block px-8 py-3 rounded-full bg-white/10 text-slate-200 font-semibold hover:bg-white/20 hover:text-white hover:scale-105 transition-all duration-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              View Confessions
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 bg-transparent">
          {[
            {
              title: "Anonymous Confession",
              desc: "Share your confessions without revealing your identity. Your privacy is our priority."
            },
            {
              title: "Real Connections",
              desc: "Connect with others who understand. Find comfort in shared experiences."
            },
            {
              title: "Safe & Secure",
              desc: "A judgment-free environment where you can express yourself freely and honestly."
            }
          ].map((card) => (
            <div
              key={card.title}
              className="flex flex-col justify-between items-start rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 px-8 py-10 min-h-[200px] transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 group"
            >
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-200">
                {card.title}
              </h3>
              <p className="text-slate-300 text-base font-medium">
                {card.desc}
              </p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
};

export default Home; 