import React, { useEffect, useState } from 'react';

export default function CompanyDashboard() {
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    const apps = JSON.parse(localStorage.getItem('applications') || '[]');
    setApplicationsCount(apps.length);

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setUsersCount(users.length);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Company Portal Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded shadow">
          <h3 className="text-xl text-sky-600 font-medium mb-2">Finance Applications</h3>
          <p className="text-5xl font-bold text-sky-600">{applicationsCount}</p>
          <p className="text-gray-600 mt-1">Total applications submitted</p>
        </div>

        <div className="p-6 bg-white rounded shadow">
          <h3 className="text-xl text-green-600 font-medium mb-2">Registered Users</h3>
          <p className="text-5xl font-bold text-green-600">{usersCount}</p>
          <p className="text-gray-600 mt-1">Total users registered</p>
        </div>
      </div>
    </div>
  );
}
