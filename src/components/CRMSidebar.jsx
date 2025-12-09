import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function CRMSidebar() {
  const [collapsed, setCollapsed] = useState(() =>
    JSON.parse(localStorage.getItem('mag_sidebar_collapsed') || 'false')
  );

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('mag_sidebar_collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  // CRM modules menu list
  const crmModules = [
    { to: '/company', label: '🏢 Company Portal Home' },
    { to: '/company/applications', label: '📄 All Applications' },
    { to: '/company/invoices', label: '🧾 All Invoices' },
    { to: '/company/outstanding', label: '📌 Corporate' },
    { to: '/company/near-due', label: '⚠️ Individual' },
    { to: '/company/near-due', label: '⚠️ Employee' },
    { to: '/company/summary', label: '📊 Client Summary' },
    { to: '/company/notifications', label: '🔔 Notifications' },
  ];

  return (
    <aside
      className={`bg-white/5 p-3 h-screen border-r shadow-sm
        ${collapsed ? 'w-20' : 'w-64'} transition-width duration-200 flex flex-col`}
    >
      {/* Header with collapse button */}
      <div className="flex items-center justify-between mb-4">
        {!collapsed && <div className="font-semibold text-lg select-none">CRM Menu</div>}

        <button
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="px-2 py-1 text-sm rounded border hover:bg-gray-100"
          type="button"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-col space-y-1 mt-4 flex-grow overflow-auto">
        {crmModules.map(({ to, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`block rounded px-2 py-2 text-sm font-medium whitespace-nowrap
                ${isActive ? 'bg-white/20 text-sky-500' : 'hover:bg-white/10'}
                transition-colors duration-150
              `}
            >
              {!collapsed ? label : label.charAt(0)} {/* Show first char only if collapsed */}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
