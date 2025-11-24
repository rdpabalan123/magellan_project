import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function TopNav() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const [financeOpen, setFinanceOpen] = useState(false);
  const financeRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (financeRef.current && !financeRef.current.contains(event.target)) {
        setFinanceOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/5 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold" style={{ color: 'var(--text)' }}>
              Magellan
            </Link>

            <nav className="hidden md:flex gap-3 text-sm items-center relative" ref={financeRef}>
              <Link to="/" className="px-2 py-1 rounded hover:bg-white/5">
                Home
              </Link>

              {/* Finance dropdown trigger */}
              <button
                onClick={() => setFinanceOpen(!financeOpen)}
                className="px-2 py-1 rounded hover:bg-white/5 flex items-center gap-1"
                aria-haspopup="true"
                aria-expanded={financeOpen}
                type="button"
              >
                Finance
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    financeOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {/* Dropdown menu */}
              {financeOpen && (
                <div className="absolute mt-8 bg-panel rounded shadow-md w-48 ring-1 ring-black ring-opacity-5 z-20">
                  <Link
                    to="/finance/calculator"
                    onClick={() => setFinanceOpen(false)}
                    className="block px-4 py-2 text-sm text-text hover:bg-sky-600 hover:text-white"
                  >
                    Cost Calculator
                  </Link>
                  <Link
                    to="/finance"
                    onClick={() => setFinanceOpen(false)}
                    className="block px-4 py-2 text-sm text-text hover:bg-sky-600 hover:text-white"
                  >
                    Finance Application
                  </Link>
                </div>
              )}

              <Link to="/client" className="px-2 py-1 rounded hover:bg-white/5">
                Client Portal
              </Link>
              <Link to="/company" className="px-2 py-1 rounded hover:bg-white/5">
                Company Portal
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-2 py-1 rounded border"
            >
              Theme
            </button>
            {user ? (
              <>
                <div className="text-sm">{user.email}</div>
                <button onClick={logout} className="px-3 py-1 rounded bg-red-600 text-white text-sm">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-3 py-1 rounded bg-sky-600 text-white text-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
