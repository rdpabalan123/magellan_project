import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const items = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/invoices', label: 'Invoices' },
];

export default function CollapsibleSidebar() {
    const [collapsed, setCollapsed] = useState(() => JSON.parse(localStorage.getItem('mag_sidebar_collapsed') || 'false'));
    useEffect(() => { localStorage.setItem('mag_sidebar_collapsed', JSON.stringify(collapsed)); }, [collapsed]);
    const loc = useLocation();

    return (
        <aside className={`bg-white/3 p-3 h-screen border-r ${collapsed ? 'w-20' : 'w-64'} transition-all duration-200`}>
            <div className="flex items-center justify-between mb-4">
                {!collapsed && <div className="font-semibold">Menu</div>}
                <button onClick={() => setCollapsed(c => !c)} className="px-2 py-1 text-sm rounded border">
                    {collapsed ? '>' : '<'}
                </button>
            </div>

            <nav className="space-y-1">
                {items.map(it => (
                    <Link
                        key={it.to}
                        to={it.to}
                        className={`block rounded px-2 py-2 text-sm ${loc.pathname === it.to ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                        {/* Removed the dot here */}
                        {!collapsed && <div>{it.label}</div>}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
