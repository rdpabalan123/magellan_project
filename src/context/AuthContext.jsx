import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

// --- PRELOAD 3 TEST ACCOUNTS INTO localStorage.users --- //
const defaultUsers = [
  { email: "admin@example.com", password: "admin123", role: "admin" },
  { email: "dev@example.com", password: "dev123", role: "dev" },
  { email: "user@example.com", password: "user123", role: "client" }
];

const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
if (existingUsers.length === 0) {
  localStorage.setItem('users', JSON.stringify(defaultUsers));
  console.log("Test users loaded into localStorage.users");
}
// ------------------------------------------------------- //

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mag_user'));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('mag_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mag_user');
    }
  }, [user]);

  // VALID LOGIN FUNCTION
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) return { success: false, message: "Invalid email or password" };

    setUser(foundUser);
    return { success: true, user: foundUser };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
