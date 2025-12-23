import React, { useEffect, useState } from 'react';

export default function CompanyDashboard() {
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [showApplicationsList, setShowApplicationsList] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);

  useEffect(() => {
    const apps = JSON.parse(localStorage.getItem('applications') || '[]');
    setApplications(apps);

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(users);
  }, []);

  // Counts of user roles
  const corporateCount = users.filter((u) => u.userRole === 'corporate').length;
  const individualCount = users.filter((u) => u.userRole === 'individual').length;
  const inhouseCount = users.filter((u) => u.userRole === 'inhouse').length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">Company Portal Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Finance Applications */}
        <div
          className="p-6 bg-white rounded shadow cursor-pointer hover:shadow-lg transition"
          onClick={() => setShowApplicationsList((prev) => !prev)}
          title="Click to toggle applications list"
        >
          <h3 className="text-xl text-sky-600 font-medium mb-2">Finance Applications</h3>
          <p className="text-5xl font-bold text-sky-600">{applications.length}</p>
          <p className="text-gray-600 mt-1 underline">Total applications submitted (click to view)</p>
        </div>

        {/* Registered Users */}
        <div
          className="p-6 bg-white rounded shadow cursor-pointer hover:shadow-lg transition"
          onClick={() => setShowUsersList((prev) => !prev)}
          title="Click to toggle users list"
        >
          <h3 className="text-xl text-green-600 font-medium mb-4">Registered Users</h3>
          <div className="grid grid-cols-3 text-center gap-4">
            <div>
              <p className="text-3xl font-bold text-green-600">{corporateCount}</p>
              <p className="text-gray-600">Corporate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{individualCount}</p>
              <p className="text-gray-600">Individual</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{inhouseCount}</p>
              <p className="text-gray-600">Inhouse</p>
            </div>
          </div>
          <p className="text-gray-600 mt-2 underline text-sm">Click to view users list</p>
        </div>
      </div>

      {/* Applications Details List */}
      {showApplicationsList && (
        <div className="bg-white rounded shadow p-6 max-h-96 overflow-y-auto mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-black">Applications Details</h3>
          {applications.length === 0 ? (
            <p className="text-black-600">No applications submitted yet.</p>
          ) : (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left text-black">Applicant Name</th>
                  <th className="border px-4 py-2 text-left text-black">Email</th>
                  <th className="border px-4 py-2 text-left text-black">Application Date</th>
                  <th className="border px-4 py-2 text-left text-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="border px-4 py-2 text-black">{app.fullName || 'N/A'}</td>
                    <td className="border px-4 py-2 text-black">{app.email || 'N/A'}</td>
                    <td className="border px-4 py-2 text-black">{app.applicationDate || 'N/A'}</td>
                    <td className="border px-4 py-2 text-black">{app.status || 'Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Users List */}
      {showUsersList && (
        <div className="bg-white rounded shadow p-6 max-h-96 overflow-y-auto">
          <h3 className="text-2xl font-semibold mb-4 text-black">Registered Users</h3>
          {users.length === 0 ? (
            <p className="text-black-600">No users registered yet.</p>
          ) : (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left text-black">Full Name</th>
                  <th className="border px-4 py-2 text-left text-black">Email</th>
                  <th className="border px-4 py-2 text-left text-black">User Role</th>
                  <th className="border px-4 py-2 text-left text-black">Phone</th>
                  <th className="border px-4 py-2 text-left text-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="border px-4 py-2 text-black">{user.fullName || 'N/A'}</td>
                    <td className="border px-4 py-2 text-black">{user.email || 'N/A'}</td>
                    <td className="border px-4 py-2 text-black">{user.userRole || 'N/A'}</td>
                    <td className="border px-4 py-2 text-black">{user.phone || 'N/A'}</td>
                    <td className="border px-4 py-2 text-black">{user.isActive === false ? 'Inactive' : 'Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
