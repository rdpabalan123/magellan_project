import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = e => {
    e.preventDefault();
    setErrorMessage('');

    // Basic validation
    if (!email.trim()) {
      setErrorMessage('Please enter your email');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Find matching user by email and password
    const user = users.find(
      u => u.email === email.trim() && u.password === password.trim()
    );

    if (!user) {
      setErrorMessage('Invalid email or password');
      return;
    }

    // Normalize role key (handle both role and userRole)
    const role = user.role || user.userRole || 'client';

    // Login with the full user data object expected by AuthContext
    login({
      email: user.email,
      role,
      fullName: user.fullName || ''
    });

    navigate('/home');
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      {/* Header with logo + address */}
      <div className="flex items-center border-b-4 border-blue-800 pb-4 mb-6 bg-white">
        <div className="bg-white p-2 rounded">
          <img
            src="/images/Car Financing Logo.png"
            alt="Company Logo"
            className="w-24 mr-6"
          />
        </div>
        <div className="flex-grow text-center text-sm text-blue-900 leading-tight">
          <p><strong>Magellan Financial Services, Ltd.</strong></p>
          <p>1063 Leeward Highway, Providenciales</p>
          <p>Turks and Caicos Islands, TKCA1ZZ</p>
          <p>
            Email: <a href="mailto:customerservice@magellanfinancialservices.tc" className="underline">customerservice@magellanfinancialservices.tc</a> | Phone: +1 649 232 6211
          </p>
        </div>
      </div>

      <h2 className="text-center text-2xl font-semibold text-blue-900 mb-8">LOGIN</h2>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={submit} className="space-y-5" noValidate>
        <label className="block font-semibold text-black">Email *</label>
        <input
          type="email"
          className="input input-bordered w-full"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label className="block font-semibold text-black">Password *</label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition"
          >
            Login
          </button>

          {/* Register Button */}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="px-6 py-2 border border-blue-800 text-blue-800 rounded-md hover:bg-blue-100 transition"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
