import React from 'react';
import { useLocation } from 'react-router-dom';
import CRMSidebar from '../components/CRMSidebar';
import TopNav from '../components/TopNav';

export default function DashboardLayout({ children }) {
  const location = useLocation();

  // Paths where sidebar should be hidden
  const hideSidebarPaths = ['/', '/finance','/finance/calculator', '/client'];

  // Determine if sidebar should be hidden
  const hideSidebar = hideSidebarPaths.includes(location.pathname);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/images/Car Financing Logo with Compass Icon.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
      }}
    >
      <TopNav />
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {!hideSidebar && <CRMSidebar />}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
