import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = e => {
    e.preventDefault();

    // Basic validation
    if (!fullName.trim()) return alert('Please enter your full name');
    if (!email.trim()) return alert('Please enter your email');
    if (!password) return alert('Please enter your password');
    if (password !== confirmPassword) return alert('Passwords do not match');
    if (!termsAccepted) return alert('You must accept the terms and conditions');

    // Retrieve existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return alert('Email already registered');
    }

    // Add new user with default role 'client' and additional info
    const newUser = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      role: 'client'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Log in the new user immediately
    login({ email: newUser.email, role: newUser.role, fullName: newUser.fullName });

    // Navigate to client portal (or homepage)
    navigate('/client');
  };

  return (
    <div className="max-w-md mx-auto mt-12 card p-6">
      <h3 className="text-xl mb-6 text-center font-semibold">Register</h3>
      <form onSubmit={submit} className="space-y-4">

        <input
          className="input"
          placeholder="Full Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          type="text"
          required
        />

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
          placeholder="Phone Number (optional)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          type="tel"
          pattern="[0-9+()-\s]*"
        />

        <input
          className="input"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          required
          minLength={6}
        />

        <input
          className="input"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          type="password"
          required
          minLength={6}
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={e => setTermsAccepted(e.target.checked)}
            required
          />
          <span className="text-sm">
            I accept the <Link to="/terms" className="text-sky-600 underline">terms and conditions</Link>.
          </span>
        </label>

        <div className="flex justify-end">
          <button className="px-4 py-2 bg-sky-600 text-white rounded">Register</button>
        </div>
      </form>

      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-sky-600 underline">Log in here</Link>
      </p>
    </div>
  );
}
