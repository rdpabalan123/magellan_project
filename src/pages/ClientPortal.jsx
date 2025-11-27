import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';

function InvoiceList({ client }) {
  const [invoices, setInvoices] = useState(() => JSON.parse(localStorage.getItem('invoices') || '[]'));

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const myInvoices = invoices.filter(i => !i.client || i.client === client);

  return (
    <div className="space-y-4">
      {myInvoices.length === 0 ? (
        <p className="text-gray-500 italic">No invoices available.</p>
      ) : (
        myInvoices.map(i => (
          <div
            key={i.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg">Invoice #{i.id}</span>
              <span
                className={`px-2 py-1 rounded text-sm font-semibold ${
                  i.status === 'Paid'
                    ? 'bg-green-100 text-green-700'
                    : i.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {i.status}
              </span>
            </div>
            <p className="text-gray-700">Amount: <span className="font-medium">PHP {i.amount.toLocaleString()}</span></p>
          </div>
        ))
      )}
    </div>
  );
}

function ServiceRequests({ client }) {
  const [reqs, setReqs] = useState(() => JSON.parse(localStorage.getItem('serviceRequests') || '[]'));
  const [text, setText] = useState('');

  useEffect(() => {
    localStorage.setItem('serviceRequests', JSON.stringify(reqs));
  }, [reqs]);

  const submit = () => {
    if (!text.trim()) return;
    setReqs(r => [{ id: Date.now(), client, text: text.trim(), status: 'Open' }, ...r]);
    setText('');
  };

  return (
    <div className="flex flex-col h-full">
      <textarea
        className="input p-3 border rounded-lg resize-none focus:ring-2 focus:ring-sky-500 focus:outline-none mb-3"
        rows={4}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Describe your issue or request"
      />
      <button
        onClick={submit}
        className="self-end px-5 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition"
      >
        Request Service
      </button>

      <div className="mt-6 overflow-y-auto flex-grow">
        {reqs.length === 0 && (
          <p className="text-gray-500 italic">No service requests submitted.</p>
        )}
        {reqs
          .filter(r => r.client === client)
          .map(r => (
            <div
              key={r.id}
              className="mb-4 p-4 rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <p className="mb-1">{r.text}</p>
              <span className="text-xs font-semibold text-gray-400">{r.status}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function ClientPortal() {
  const { user } = useAuth();

  // Redirect to home if not logged in
  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-gray-600 text-lg">Please log in to access the client portal.</div>
      </DashboardLayout>
    );
  }

  // Only allow access to these roles
  if (!['client', 'admin', 'dev', 'user'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  const [profile, setProfile] = useState(() =>
    JSON.parse(localStorage.getItem(`client_${user.email}`)) || { name: user.email, phone: '', address: '' }
  );

  useEffect(() => {
    localStorage.setItem(`client_${user.email}`, JSON.stringify(profile));
  }, [profile, user]);

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Client Portal</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Account Info */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800">Account Information</h3>
          <p className="mb-2 text-gray-700"><span className="font-semibold">Name:</span> {profile.name}</p>
          <p className="mb-2 text-gray-700"><span className="font-semibold">Phone:</span> {profile.phone || <span className="italic text-gray-400">Not provided</span>}</p>
          <p className="mb-4 text-gray-700"><span className="font-semibold">Address:</span> {profile.address || <span className="italic text-gray-400">Not provided</span>}</p>
          <button
            onClick={() => {
              const newPhone = prompt('Enter new phone number:', profile.phone);
              if (newPhone !== null) setProfile(p => ({ ...p, phone: newPhone.trim() }));
            }}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md transition"
          >
            Edit Phone
          </button>
        </section>

        {/* Invoices */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-6 border-b pb-2 text-gray-800">Statements & Invoices</h3>
          <InvoiceList client={user.email} />
        </section>

        {/* Service Requests */}
        <section className="bg-white rounded-lg shadow p-6 flex flex-col">
          <h3 className="text-xl font-semibold mb-6 border-b pb-2 text-gray-800">Service Requests</h3>
          <ServiceRequests client={user.email} />
        </section>
      </div>

      {/* Knowledge Base / FAQ */}
      <section className="bg-white rounded-lg shadow p-6 mt-10">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800">Knowledge Base / FAQ</h3>
        <details className="mt-2 p-4 rounded border border-gray-200 bg-gray-50">
          <summary className="cursor-pointer font-medium text-gray-700">How do I make payments?</summary>
          <p className="mt-2 text-gray-600 text-sm">
            Payments are handled by our accounting department. Future releases will support online payments.
          </p>
        </details>
      </section>
    </DashboardLayout>
  );
}
