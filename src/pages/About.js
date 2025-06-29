import React from 'react';
import { Link } from 'react-router-dom';
import Particles from '../components/Particles';

const About = () => {
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
            About <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-md">HiddenNexus</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 font-medium">
            A safe space for anonymous confessions and genuine connections.
          </p>
        </section>

        {/* Mission Section */}
        <section className="w-full max-w-4xl mx-auto mb-16 bg-transparent">
          <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 px-8 py-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
              HiddenNexus was created with a simple yet powerful vision: to provide a judgment-free 
              environment where people can share their deepest thoughts, fears, and experiences 
              without fear of being identified or judged. We believe that everyone deserves a 
              safe space to be vulnerable and authentic.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 bg-transparent">
          {[
            {
              title: "Privacy First",
              desc: "Your anonymity is sacred. We've built this platform with privacy at its core, ensuring your confessions remain truly anonymous.",
              icon: "🔒"
            },
            {
              title: "No Judgment",
              desc: "This is a space free from judgment, criticism, or discrimination. Every voice matters and every story is valid.",
              icon: "🤝"
            },
            {
              title: "Real Connections",
              desc: "Beyond anonymity, we foster genuine human connections through shared experiences and mutual understanding.",
              icon: "💫"
            }
          ].map((card) => (
            <div
              key={card.title}
              className="flex flex-col justify-between items-center rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 px-8 py-10 min-h-[250px] transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 group text-center"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-200">
                {card.title}
              </h3>
              <p className="text-slate-300 text-base font-medium">
                {card.desc}
              </p>
            </div>
          ))}
        </section>

        {/* How It Works Section */}
        <section className="w-full max-w-4xl mx-auto mb-16 bg-transparent">
          <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 px-8 py-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Share Anonymously",
                  desc: "Write your confession without revealing any personal information. Your identity stays completely hidden."
                },
                {
                  step: "02",
                  title: "Connect & Relate",
                  desc: "Read others' confessions and find comfort in knowing you're not alone in your experiences."
                },
                {
                  step: "03",
                  title: "Find Peace",
                  desc: "Release your burdens in a safe space and discover a community that understands without judgment."
                }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-2xl mx-auto text-center bg-transparent">
          <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 px-8 py-12">
            <h2 className="text-2xl font-bold text-white mb-6">Ready to Share Your Story?</h2>
            <p className="text-slate-300 mb-8">
              Join thousands of others who have found comfort and connection through anonymous sharing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                Read Confessions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default About; 