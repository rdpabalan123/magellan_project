import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = e => {
    e.preventDefault();
    if (!email || !password) return alert('Please enter email and password');

    // Retrieve existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return alert('Email already registered');
    }

    // Add new user with default role 'client'
    const newUser = { email, password, role: 'client' };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Log in the new user immediately
    login({ email, role: 'client' });

    // Navigate to homepage (or client portal if you want)
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-12 card p-6">
      <h3 className="text-xl mb-4 text-center font-semibold">Register</h3>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="input"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          required
        />
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-sky-600 text-white rounded">Register</button>
        </div>
      </form>
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-sky-600">Log in here</Link>
      </p>
    </div>
  );
}
