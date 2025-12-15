import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

/* --------------------------------------------------
   PRELOAD DEFAULT TEST USERS (ONLY ONCE)
-------------------------------------------------- */
const defaultUsers = [
  { email: 'admin@example.com', password: 'admin123', role: 'admin', fullName: 'Admin User' },
  { email: 'dev@example.com', password: 'dev123', role: 'dev', fullName: 'Developer User' },
  { email: 'user@example.com', password: 'user123', role: 'client', fullName: 'Client User' }
];

(function preloadUsers() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (!users.length) {
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    console.log('Default users loaded');
  }
})();

/* --------------------------------------------------
   AUTH PROVIDER
-------------------------------------------------- */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mag_user'));
    } catch {
      return null;
    }
  });

  /* Persist logged-in user */
  useEffect(() => {
    if (user) {
      localStorage.setItem('mag_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mag_user');
    }
  }, [user]);

  /* --------------------------------------------------
     LOGIN (accept user object directly)
  -------------------------------------------------- */
  const login = (userData) => {
    setUser(userData);
    return { success: true, user: userData };
  };

  /* --------------------------------------------------
     LOGOUT
  -------------------------------------------------- */
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
