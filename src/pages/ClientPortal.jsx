import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import toast, { Toaster } from 'react-hot-toast';

/* ================= HELPERS ================= */
function formatCurrency(amount) {
  return typeof amount === 'number'
    ? amount.toLocaleString('en-US', { minimumFractionDigits: 2 })
    : amount;
}

/* ================= SERVICE REQUESTS ================= */
function ServiceRequests({ client }) {
  const [message, setMessage] = useState('');
  const [requests, setRequests] = useState(() =>
    JSON.parse(localStorage.getItem('serviceRequests') || '[]')
  );

  useEffect(() => {
    localStorage.setItem('serviceRequests', JSON.stringify(requests));
  }, [requests]);

  const submitRequest = () => {
    if (!message.trim()) return;
    setRequests([
      {
        id: Date.now(),
        client,
        message,
        status: 'Open',
        date: new Date().toLocaleString(),
      },
      ...requests,
    ]);
    setMessage('');
    toast.success('Service request submitted');
  };

  return (
    <section className="bg-white border rounded p-6 text-black">
      <h3 className="text-lg font-semibold mb-4 text-black">Service Requests</h3>

      <textarea
        className="w-full border p-3 mb-3 text-black"
        rows={4}
        placeholder="Describe your concern or request"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />

      <button
        onClick={submitRequest}
        className="px-4 py-2 border rounded text-black"
      >
        Submit Request
      </button>

      <div className="mt-6 space-y-3">
        {requests.filter(r => r.client === client).length === 0 && (
          <p className="text-black">No service requests submitted.</p>
        )}

        {requests
          .filter(r => r.client === client)
          .map(r => (
            <div key={r.id} className="border rounded p-3 text-black">
              <p className="font-semibold">{r.message}</p>
              <p>Status: {r.status}</p>
              <p className="text-sm">{r.date}</p>
            </div>
          ))}
      </div>
    </section>
  );
}

/* ================= MAIN ================= */
export default function ClientPortal() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;

  const [avatar, setAvatar] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState({
    fullName: user.fullName || 'Client Name',
    email: user.email,
    phone: '',
    address: '',
  });

  const handleAvatarUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  /* ===== SAMPLE DATA ===== */
  const today = '15/12/2025';
  const lastLogin = '15/12/2025, 16:33:31';

  const invoiceSummary = [
    { month: 'January 2025', invoiceNo: 'INV-1001', dueDate: '2025-01-15', amount: 18000, status: 'Paid' },
    { month: 'February 2025', invoiceNo: 'INV-1002', dueDate: '2025-02-15', amount: 18000, status: 'Paid' },
    { month: 'March 2025', invoiceNo: 'INV-1003', dueDate: '2025-03-15', amount: 18000, status: 'Due' },
  ];

  return (
    <DashboardLayout>
      <Toaster />
      <main className="max-w-6xl mx-auto p-6 space-y-10 text-black">

        {/* ===== AVATAR & PROFILE ===== */}
        <section className="bg-white border rounded p-6 text-black">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 border rounded-full overflow-hidden flex items-center justify-center text-black">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-semibold">HELLO</span>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-black">{profile.fullName}</h2>
              <input type="file" onChange={handleAvatarUpload} className="mt-2 text-black" />
              <button
                onClick={() => setEditMode(!editMode)}
                className="ml-4 px-4 py-1 border rounded text-black"
              >
                Edit Settings
              </button>
            </div>
          </div>

          {editMode && (
            <div className="grid md:grid-cols-2 gap-4 mt-6 text-black">
              <input
                className="border p-2 text-black"
                value={profile.fullName}
                onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="Full Name"
              />
              <input
                className="border p-2 text-black"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Phone"
              />
              <input
                className="border p-2 text-black md:col-span-2"
                value={profile.address}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
                placeholder="Address"
              />
            </div>
          )}
        </section>

        {/* ===== PENDING FINANCE APPLICATION ===== */}
        <section className="bg-white border rounded p-6 text-black">
          <h3 className="font-semibold mb-3 text-black">Pending Finance Application Approval</h3>
          <table className="w-full border text-black">
            <thead>
              <tr>
                <th className="border p-2 text-black">Application ID</th>
                <th className="border p-2 text-black">Status</th>
                <th className="border p-2 text-black">Submitted Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 text-black">FA-2025-001</td>
                <td className="border p-2 text-black">Pending Approval</td>
                <td className="border p-2 text-black">2025-12-10</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ===== VEHICLE & LOAN ===== */}
        <section className="bg-white border rounded p-6 text-black">
          <h3 className="font-semibold mb-4 text-black">Vehicle & Loan Information</h3>
          <p><strong>Vehicle:</strong> Toyota Hilux 2023</p>
          <p><strong>Plate:</strong> TC-10293</p>
          <p><strong>Loan Amount:</strong> USD {formatCurrency(820000)}</p>
          <p><strong>Monthly:</strong> USD {formatCurrency(18000)}</p>
        </section>

        {/* ===== DASHBOARD SUMMARY ===== */}
        <section className="bg-white border rounded p-6 text-black">
          <h2 className="text-xl font-semibold mb-2 text-black">
            Welcome to Your Magellan Financing Account
          </h2>
          <p className="mb-6 text-black">
            Access all your loan details, statements, and support resources below.
            Thank you for being a valued Magellan Financing customer.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="border p-4 text-black">
              <p>Today</p>
              <strong>{today}</strong>
            </div>
            <div className="border p-4 text-black">
              <p>Last Login</p>
              <strong>{lastLogin}</strong>
            </div>
            <div className="border p-4 text-black">
              <p>Next Payment Due</p>
              <strong>USD {formatCurrency(18000)} on 2025-03-15</strong>
            </div>
          </div>

          <table className="w-full border text-black">
            <thead>
              <tr>
                <th className="border p-2 text-black">Month</th>
                <th className="border p-2 text-black">Invoice #</th>
                <th className="border p-2 text-black">Due Date</th>
                <th className="border p-2 text-black">Amount (USD)</th>
                <th className="border p-2 text-black">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoiceSummary.map(inv => (
                <tr key={inv.invoiceNo}>
                  <td className="border p-2 text-black">{inv.month}</td>
                  <td className="border p-2 text-black">{inv.invoiceNo}</td>
                  <td className="border p-2 text-black">{inv.dueDate}</td>
                  <td className="border p-2 text-black">{formatCurrency(inv.amount)}</td>
                  <td className="border p-2 text-black">{inv.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ===== SERVICE REQUESTS ===== */}
        <ServiceRequests client={user.email} />

      </main>
    </DashboardLayout>
  );
}
