import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { auth, googleProvider, discordProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';

window.addEventListener('trigger-signin', async (e) => {
  if (e.detail === 'google') {
    await signInWithPopup(auth, googleProvider);
  } else if (e.detail === 'discord') {
    await signInWithPopup(auth, discordProvider);
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 