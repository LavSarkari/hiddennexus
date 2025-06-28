import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, rtdb } from '../firebase';
import { ref, get } from 'firebase/database';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let userInfo = null;
        if (firebaseUser.providerData[0]?.providerId === 'google.com') {
          userInfo = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL,
          };
        } else if (firebaseUser.providerData[0]?.providerId === 'oauth.discord.com') {
          const discordUid = firebaseUser.uid;
          const dbRef = ref(rtdb, `/users/${discordUid}`);
          const snap = await get(dbRef);
          if (snap.exists()) {
            userInfo = { uid: discordUid, ...snap.val() };
          } else {
            userInfo = { uid: discordUid, name: 'Discord User', email: firebaseUser.email, avatar: '' };
          }
        }
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, message, setMessage }}>
      {children}
    </AuthContext.Provider>
  );
}; 