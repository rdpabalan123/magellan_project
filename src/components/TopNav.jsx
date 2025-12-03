import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function TopNav() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  console.log('Current User:', user);

  return (
    <header className="bg-white/5 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">

          {/* LEFT SIDE */}
          <div className="flex items-center">

            {/* LOGO */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src="/images/Car Financing Logo.png"
                alt="Magellan Logo"
                style={{
                  height: '140px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Link>

            {/* NAV MENU */}
            <nav
              className="hidden md:flex gap-6 items-center relative ml-4 font-bold text-lg"
              ref={financeRef}
              style={{ color: 'var(--text)' }}
            >

              {/* Always visible */}
              <Link to="/" className="px-3 py-1 rounded hover:bg-white/5">
                Home
              </Link>

              {/* FINANCE DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setFinanceOpen(!financeOpen)}
                  className="px-3 py-1 rounded hover:bg-white/5 flex items-center gap-1"
                >
                  Finance
                  <svg
                    className={`w-4 h-4 transition-transform ${financeOpen ? 'rotate-180' : 'rotate-0'}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {financeOpen && (
                  <div
                    className="absolute bg-panel w-48 rounded shadow-md z-20 ring-1 ring-black ring-opacity-5"
                    style={{ top: '100%', left: 0 }}
                  >
                    <Link
                      to="/finance/calculator"
                      onClick={() => setFinanceOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-sky-600 hover:text-black"
                    >
                      Cost Calculator
                    </Link>
                    <Link
                      to="/finance"
                      onClick={() => setFinanceOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-sky-600 hover:text-black"
                    >
                      Finance Application
                    </Link>
                  </div>
                )}
              </div>

              {/* ===================== */}
              {/*   ROLE-BASED MENUS   */}
              {/* ===================== */}

              {/* USER / CLIENT */}
              {["user", "client"].includes(user?.role) && (
                <Link to="/client" className="px-3 py-1 rounded hover:bg-white/5">
                  Client Portal
                </Link>
              )}

              {/* ADMIN */}
              {user?.role === "admin" && (
                <Link to="/company" className="px-3 py-1 rounded hover:bg-white/5">
                  Company Portal
                </Link>
              )}

              {/* DEV — sees everything */}
              {user?.role === "dev" && (
                <>
                  <Link to="/client" className="px-3 py-1 rounded hover:bg-white/5">
                    Client Portal
                  </Link>
                  <Link to="/company" className="px-3 py-1 rounded hover:bg-white/5">
                    Company Portal
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4 font-bold text-lg">
            {user ? (
              <>
                <div className="text-sm">
                  {user.email} <span className="text-xs text-gray-400">({user.role})</span>
                </div>
                <button
                  onClick={handleLogout}
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
