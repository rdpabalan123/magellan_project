import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function TopNav() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const [financeOpen, setFinanceOpen] = useState(false);
  const financeRef = useRef(null);

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
    <header
      className="bg-white/5 backdrop-blur sticky top-0 z-30"
      style={{ paddingLeft: '24px', paddingRight: '24px' }}
    >
      <div
        className="max-w-7xl mx-auto"
        style={{ paddingLeft: '24px', paddingRight: '24px' }}
      >
        <div
          className="flex justify-between items-center"
          style={{ height: '120px' }}
        >
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center flex-shrink-0"
              style={{ height: '120px', width: '160px', margin: 0, padding: 0 }}
            >
              <img
                src="/images/Car Financing Logo.png"
                alt="Magellan Logo"
                style={{
                  height: '120px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  margin: 0,
                  padding: 0,
                }}
              />
            </Link>

            <nav
              className="hidden md:flex gap-6 items-center relative ml-8 font-bold text-lg"
              ref={financeRef}
              style={{ color: 'var(--text)' }}
            >
              <Link to="/" className="px-3 py-1 rounded hover:bg-white/5">
                Home
              </Link>

              {/* Wrap Finance button in relative div */}
              <div className="relative">
                <button
                  onClick={() => setFinanceOpen(!financeOpen)}
                  className="px-3 py-1 rounded hover:bg-white/5 flex items-center gap-1"
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {financeOpen && (
                  <div
                    className="absolute bg-panel rounded shadow-md w-48 ring-1 ring-black ring-opacity-5 z-20"
                    style={{ top: '100%', left: 0 }}
                  >
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
              </div>

              <Link to="/client" className="px-3 py-1 rounded hover:bg-white/5">
                Client Portal
              </Link>
              <Link to="/company" className="px-3 py-1 rounded hover:bg-white/5">
                Company Portal
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 font-bold text-lg">
            {user ? (
              <>
                <div className="text-sm">{user.email}</div>
                <button
                  onClick={logout}
                  className="px-4 py-1 rounded bg-red-600 text-white text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1 rounded bg-sky-600 text-white text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
