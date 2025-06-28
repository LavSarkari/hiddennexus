import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { rtdb } from '../firebase';

const DISCORD_CLIENT_ID = '1387707232958812302';
const REDIRECT_URI = 'http://localhost:3000/login';
const DISCORD_OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify%20email`;

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      // Exchange code for user info via backend
      fetch('/api/discord-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then(res => res.json())
        .then(async (data) => {
          if (data && data.id) {
            const userInfo = {
              name: data.username,
              email: data.email,
              avatar: data.avatar,
              authSource: 'discord',
            };
            localStorage.setItem('user', JSON.stringify(userInfo));
            await set(ref(rtdb, `/users/discord_${data.id}`), userInfo);
            navigate('/confess');
          }
        });
    }
  }, [navigate]);

  const handleDiscordLogin = () => {
    window.location.href = DISCORD_OAUTH_URL;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Sign in to HiddenNexus</h1>
        <button
          onClick={handleDiscordLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mb-4"
        >
          Sign in with Discord
        </button>
      </div>
    </div>
  );
};

export default Login; 