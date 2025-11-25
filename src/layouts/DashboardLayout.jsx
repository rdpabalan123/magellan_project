import React from 'react';
import CollapsibleSidebar from '../components/CollapsibleSidebar';
import TopNav from '../components/TopNav';

export default function DashboardLayout({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/images/Car Financing Logo with Compass Icon.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover', // or 'contain' depending on what you want
        // optional: add a background color or overlay if needed
        // backgroundColor: 'rgba(0,0,0,0.1)',
      }}
    >
      <TopNav />
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        <CollapsibleSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
