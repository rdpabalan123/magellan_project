import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';

// Toasts
import toast, { Toaster } from 'react-hot-toast'; 

// PDF generation
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { motion } from 'framer-motion';  // <--- Import framer-motion

// ---------- Helpers ----------
function daysUntil(dateString) {
  if (!dateString) return Infinity;
  const today = new Date();
  // normalize times
  const a = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const b = new Date(dateString);
  const diff = Math.ceil((b - a) / (1000 * 60 * 60 * 24));
  return diff;
}

function formatCurrency(amount) {
  return typeof amount === 'number' ? amount.toLocaleString() : amount;
}

// Ensure we only show a given toastKey once per day (persisted in localStorage)
function showDailyToast(key, message, opts = {}) {
  try {
    const storeKey = 'lastToastDates_v1';
    const data = JSON.parse(localStorage.getItem(storeKey) || '{}');
    const today = new Date().toISOString().slice(0, 10);
    if (data[key] === today) return; // already shown today
    data[key] = today;
    localStorage.setItem(storeKey, JSON.stringify(data));
    toast(message, opts);
  } catch (err) {
    // fallback: just show toast
    toast(message, opts);
  }
}

// ---------- PDF Export ----------
function downloadInvoicePDF(invoice, profile, vehicleData) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginLeft = 40;
  let cursorY = 40;

  doc.setFontSize(18);
  doc.text('Magellan Financial Services', marginLeft, cursorY);
  doc.setFontSize(12);
  doc.text('Statements & Invoice', marginLeft, cursorY + 22);

  cursorY += 50;
  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoice.id}`, marginLeft, cursorY);
  doc.text(`Date Issued: ${invoice.issuedDate || ''}`, marginLeft + 250, cursorY);
  cursorY += 16;
  doc.text(`Due Date: ${invoice.dueDate || ''}`, marginLeft, cursorY);
  doc.text(`Status: ${invoice.status}`, marginLeft + 250, cursorY);

  cursorY += 28;
  doc.setFontSize(11);
  doc.text('Billed To:', marginLeft, cursorY);
  doc.setFontSize(10);
  doc.text(profile.fullName || '', marginLeft, cursorY + 14);
  if (profile.address) doc.text(profile.address, marginLeft, cursorY + 28);
  if (profile.phone) doc.text(`Phone: ${profile.phone}`, marginLeft, cursorY + 42);

  // Vehicle info
  cursorY += 80;
  doc.setFontSize(11);
  doc.text('Vehicle Information', marginLeft, cursorY);
  doc.setFontSize(10);
  if (vehicleData) {
    doc.text(`Vehicle: ${vehicleData.vehicle || ''}`, marginLeft, cursorY + 14);
    doc.text(`Plate: ${vehicleData.plate || ''}`, marginLeft + 250, cursorY + 14);
  }

  // Invoice table
  cursorY += 40;
  const tableColumn = ['Description', 'Qty', 'Unit', 'Total'];
  const tableRows = [];

  // If invoice has items array, use that; otherwise create fallback
  if (Array.isArray(invoice.items) && invoice.items.length > 0) {
    invoice.items.forEach(it => {
      tableRows.push([it.description || '', it.qty || 1, formatCurrency(it.unit || 0), formatCurrency(it.total || 0)]);
    });
  } else {
    // fallback single line
    tableRows.push([invoice.description || 'Invoice Charge', 1, formatCurrency(invoice.amount || 0), formatCurrency(invoice.amount || 0)]);
  }

  // autoTable will manage starting position
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: cursorY,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [44, 62, 80] },
  });

  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : cursorY + 80;
  doc.setFontSize(11);
  doc.text(`Total: PHP ${formatCurrency(invoice.amount || 0)}`, marginLeft, finalY + 18);

  // Footer
  doc.setFontSize(9);
  doc.text('Thank you for your business.', marginLeft, 760);

  doc.save(`invoice_${invoice.id}.pdf`);
}

// ---------- Components ----------

function InvoiceList({ client, profile, vehicleData, onMarkPaid }) {
  const [invoices, setInvoices] = useState(() => JSON.parse(localStorage.getItem('invoices') || '[]'));

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Filter for this client
  const myInvoices = invoices.filter(i => !i.client || i.client === client);

  // Notifications logic: invoice due in <=15 days, daily reminder, and overdue
  useEffect(() => {
    myInvoices.forEach(inv => {
      if (inv.status === 'Paid') return;
      const remaining = daysUntil(inv.dueDate);
      const toastKeySoon = `invoice_soon_${inv.id}`;
      const toastKeyOver = `invoice_over_${inv.id}`;

      if (remaining <= 15 && remaining >= 1) {
        showDailyToast(toastKeySoon, `Invoice #${inv.id} is due in ${remaining} day(s).`, { icon: '⚠️' });
      } else if (remaining <= 0) {
        showDailyToast(toastKeyOver, `Invoice #${inv.id} is overdue!`, { icon: '❗', style: { background: '#fff1f0' } });
      }
    });
  }, [myInvoices]);

  const markPaid = (id) => {
    const updated = invoices.map(inv => (inv.id === id ? { ...inv, status: 'Paid' } : inv));
    setInvoices(updated);
    toast.success(`Invoice #${id} marked as Paid.`);
    if (onMarkPaid) onMarkPaid(id);
  };

  const deleteInvoice = (id) => {
    if (!window.confirm('Delete this invoice?')) return;
    const updated = invoices.filter(inv => inv.id !== id);
    setInvoices(updated);
    toast.success(`Invoice #${id} deleted.`);
  };

  // Sort: Pending, Due, Paid — with clear ranking
  const sortRank = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Due': return 2;
      case 'Paid': return 3;
      default: return 4;
    }
  };

  const sorted = [...myInvoices].sort((a, b) => {
    const r = sortRank(a.status) - sortRank(b.status);
    if (r !== 0) return r;
    // then by due date ascending, missing dates go last
    const dateA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
    const dateB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
    return dateA - dateB;
  });

  if (sorted.length === 0) {
    return <p className="text-gray-500 italic">No invoices available.</p>;
  }

  return (
    <div className="space-y-4">
      {sorted.map(i => {
        const remaining = daysUntil(i.dueDate);
        const statusClass =
          i.status === 'Paid'
            ? 'bg-green-100 text-green-700'
            : remaining <= 0
            ? 'bg-red-100 text-red-700'
            : remaining <= 15
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-gray-100 text-gray-700';

        return (
          <div key={i.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-white">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-semibold text-lg">Invoice #{i.id}</span>
                <div className="text-sm text-gray-500">Issued: {i.issuedDate || '—'}</div>
              </div>

              <div className="text-right">
                <span className={`px-2 py-1 rounded text-sm font-semibold ${statusClass}`}>
                  {i.status}
                </span>
                <div className="text-xs text-gray-400">Due: {i.dueDate || '—'}</div>
              </div>
            </div>

            <p className="text-gray-700">
              Amount: <span className="font-medium">PHP {formatCurrency(i.amount || 0)}</span>
            </p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => downloadInvoicePDF(i, profile, vehicleData)}
                className="px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50"
              >
                Download PDF
              </button>

              {i.status !== 'Paid' && (
                <button
                  onClick={() => markPaid(i.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Mark Paid
                </button>
              )}

              <button
                onClick={() => deleteInvoice(i.id)}
                className="px-3 py-1 bg-red-50 text-red-700 border rounded text-sm hover:bg-red-100"
              >
                Delete
              </button>
            </div>

            {i.status !== 'Paid' && (
              <p className="text-sm mt-2">
                <span className={remaining <= 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                  {remaining <= 0 ? `${Math.abs(remaining)} day(s) overdue` : `${remaining} day(s) remaining`}
                </span>
              </p>
            )}
          </div>
        );
      })}
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
    toast.success('Service request submitted.');
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
        {reqs.length === 0 && <p className="text-gray-500 italic">No service requests submitted.</p>}
        {reqs
          .filter(r => r.client === client)
          .map(r => (
            <div key={r.id} className="mb-4 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
              <p className="mb-1">{r.text}</p>
              <span className="text-xs font-semibold text-gray-400">{r.status}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

// Vehicle & Loan + Compliance tracker
function VehicleLoanSection({ clientEmail }) {
  // saved key per client
  const storageKey = `vehicleLoan_${clientEmail}`;
  const [data, setData] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved) return saved;
    // default sample data
    return {
      vehicle: 'Toyota Hilux 2023',
      plate: 'TC-10293',
      loanAmount: 820000,
      remaining: 245000,
      term: '36 months',
      monthly: 18000,
      insuranceExpiry: new Date(new Date().setDate(new Date().getDate() + 40)).toISOString().slice(0,10), // sample +40 days
      registrationExpiry: new Date(new Date().setDate(new Date().getDate() + 75)).toISOString().slice(0,10), // sample +75 days
    };
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data, storageKey]);

  // Notify for insurance and registration nearing expiry (30 days)
  useEffect(() => {
    const insDays = daysUntil(data.insuranceExpiry);
    const regDays = daysUntil(data.registrationExpiry);

    if (insDays <= 30 && insDays >= 1) {
      showDailyToast(`ins_exp_${clientEmail}`, `Insurance expires in ${insDays} day(s).`, {icon: '🛈'});
    } else if (insDays <= 0) {
      showDailyToast(`ins_over_${clientEmail}`, `Insurance is expired!`, {icon: '⚠️'});
    }

    if (regDays <= 30 && regDays >= 1) {
      showDailyToast(`reg_exp_${clientEmail}`, `Registration expires in ${regDays} day(s).`, {icon: '🛈'});
    } else if (regDays <= 0) {
      showDailyToast(`reg_over_${clientEmail}`, `Registration is expired!`, {icon: '⚠️'});
    }
  }, [data.insuranceExpiry, data.registrationExpiry, clientEmail]);

  // Simple UI to update expiry dates
  const updateField = (key, val) => setData(d => ({ ...d, [key]: val }));

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-xl font-semibold mb-2 border-b pb-2 text-gray-800">Vehicle & Loan Information</h3>

      <div className="grid grid-cols-1 gap-2">
        <p className="text-gray-700"><strong>Vehicle:</strong> {data.vehicle}</p>
        <p className="text-gray-700"><strong>Plate No.:</strong> {data.plate}</p>
        <p className="text-gray-700"><strong>Loan Amount:</strong> PHP {formatCurrency(data.loanAmount)}</p>
        <p className="text-gray-700"><strong>Remaining Balance:</strong> PHP {formatCurrency(data.remaining)}</p>
        <p className="text-gray-700"><strong>Term:</strong> {data.term}</p>
        <p className="text-gray-700"><strong>Monthly Payment:</strong> PHP {formatCurrency(data.monthly)}</p>
      </div>

      <hr />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded border">
          <p className="text-sm text-gray-600"><strong>Insurance Expiry</strong></p>
          <p className="mt-1 text-gray-800">{data.insuranceExpiry}</p>
          <p className="text-xs text-gray-500">{daysUntil(data.insuranceExpiry) <= 0 ? `${Math.abs(daysUntil(data.insuranceExpiry))} day(s) ago` : `${daysUntil(data.insuranceExpiry)} day(s) remaining`}</p>
          <div className="mt-2">
            <input
              type="date"
              className="input border rounded p-1 text-sm"
              value={data.insuranceExpiry || ''}
              onChange={(e) => updateField('insuranceExpiry', e.target.value)}
            />
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded border">
          <p className="text-sm text-gray-600"><strong>Registration Expiry</strong></p>
          <p className="mt-1 text-gray-800">{data.registrationExpiry}</p>
          <p className="text-xs text-gray-500">{daysUntil(data.registrationExpiry) <= 0 ? `${Math.abs(daysUntil(data.registrationExpiry))} day(s) ago` : `${daysUntil(data.registrationExpiry)} day(s) remaining`}</p>
          <div className="mt-2">
            <input
              type="date"
              className="input border rounded p-1 text-sm"
              value={data.registrationExpiry || ''}
              onChange={(e) => updateField('registrationExpiry', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Component ----------
export default function ClientPortal() {
  const { user } = useAuth();

  // Redirect if not logged in
  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-gray-600 text-lg">Please log in to access the client portal.</div>
      </DashboardLayout>
    );
  }

  // Only allow access to specific roles
  if (!['client', 'admin', 'dev', 'user'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  const [profile, setProfile] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(`client_${user.email}`));
    return saved || {
      fullName: user.fullName || user.email,
      phone: '',
      address: '',
      avatar: null, // base64 image string or null
    };
  });

  // Keep profile saved
  useEffect(() => {
    localStorage.setItem(`client_${user.email}`, JSON.stringify(profile));
  }, [profile, user.email]);

  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);
  const [editMode, setEditMode] = useState(false);

  const firstName = profile.fullName.split(' ')[0] || 'Client';

  // When avatar file chosen, convert to base64
  const onAvatarChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setProfile(p => ({ ...p, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Save changes and exit edit mode
  const saveProfile = () => {
    setEditMode(false);
    toast.success('Profile updated.');
  };

  // Vehicle data for invoice demo
  const vehicleData = {
    vehicle: 'Toyota Hilux 2023',
    plate: 'TC-10293',
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" />

      <main className="max-w-5xl mx-auto p-4">
        {/* Welcome Block with animation */}
        <section className="flex items-center gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border border-gray-300"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">No Avatar</div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            {editMode ? (
              <>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
                  className="input border p-2 rounded mb-2 max-w-xs"
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  value={profile.phone}
                  onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                  className="input border p-2 rounded mb-2 max-w-xs"
                  placeholder="Phone"
                />
                <input
                  type="text"
                  value={profile.address}
                  onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
                  className="input border p-2 rounded mb-2 max-w-xs"
                  placeholder="Address"
                />
                <input type="file" accept="image/*" onChange={onAvatarChange} className="mb-2" />
                <div>
                  <button
                    onClick={saveProfile}
                    className="mr-2 px-4 py-1 bg-sky-600 text-white rounded hover:bg-sky-700"
                  >
                    Save
                  </button>
                  <button onClick={() => setEditMode(false)} className="px-4 py-1 rounded border hover:bg-gray-100">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-gray-800">Welcome, {firstName}!</h2>
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-1 px-4 py-1 bg-sky-600 text-white rounded hover:bg-sky-700"
                >
                  Edit Profile
                </button>
              </>
            )}
          </motion.div>
        </section>

        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Invoices</h3>
          <InvoiceList client={user.email} profile={profile} vehicleData={vehicleData} />
        </section>

        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Service Requests</h3>
          <ServiceRequests client={user.email} />
        </section>

        <section className="mb-10">
          <VehicleLoanSection clientEmail={user.email} />
        </section>
      </main>
    </DashboardLayout>
  );
}
