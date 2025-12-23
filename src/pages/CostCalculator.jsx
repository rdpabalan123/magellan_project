// src/pages/CostCalculator.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTheme } from '../context/ThemeContext';

const STORAGE_KEY = 'crm_vehicles';

const fallbackImage = '/mnt/data/2402fabf-39d0-49ce-9ef7-b7116e8ddcad.png';

// Format numbers with commas and 2 decimals
const money = (val) =>
  Number(val).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Single row for summary info
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-slate-600 pb-2">
      <span className="font-semibold text-sm w-1/2">{label}</span>
      <span className="font-bold text-sm bg-white px-3 py-1 rounded text-black w-1/2 text-right whitespace-nowrap">
        {value}
      </span>
    </div>
  );
}

export default function CostCalculator() {
  const navigate = useNavigate();
  const summaryRef = useRef(null);
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  // Vehicles state loaded from localStorage
  const [vehicles, setVehicles] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [vehicleValue, setVehicleValue] = useState(0);
  const [interestRate, setInterestRate] = useState(12); // %
  const [terms, setTerms] = useState(24); // months
  const [downpaymentPercent, setDownpaymentPercent] = useState(20); // %

  // Fixed fees
  const insurance = 4443.39;
  const licenseFee = 1260.0;
  const adminFee = 350.0;

  // Load vehicles from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setVehicles(parsed);
      }
    } catch {
      setVehicles([]);
    }
  }, []);

  // Update vehicleValue when selection changes
  useEffect(() => {
    const vehicle = vehicles.find((v) => {
      // Build the full name string as in your original VehicleDatabase or your own logic
      // Here, let's replicate a "name" by combining fields (adjust as needed):
      return `${v.stockNo} - ${v.year} - ${v.make} - ${v.model} - ${v.color} - ${v.price}` === selectedName;
    });
    if (vehicle) setVehicleValue(vehicle.price || 0);
    else setVehicleValue(0);
  }, [selectedName, vehicles]);

  // Rebuild a name string for display and selection
  const vehicleOptions = vehicles.map((v) => ({
    name: `${v.stockNo} - ${v.year} - ${v.make} - ${v.model} - ${v.color} - ${v.price}`,
    price: v.price,
    img: v.image || fallbackImage,
  }));

  // Calculations
  const miscFees = insurance + licenseFee;

  const yearlyInterest = vehicleValue * (interestRate / 100);
  const totalInterestTerm = yearlyInterest * (terms / 12);

  const totalFinanceAmount = vehicleValue + miscFees + totalInterestTerm;

  const downpayment = totalFinanceAmount * (downpaymentPercent / 100);
  const balance = totalFinanceAmount - downpayment;

  const monthlyInvoice = terms ? balance / terms : 0;
  const totalDueAtSigning = downpayment + monthlyInvoice + adminFee;

  // Show values only if vehicle selected
  const showValues = !!selectedName;

  // PDF styles injection
  useEffect(() => {
    const id = 'cost-calc-pdf-style';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.innerHTML = `.pdf-export * { color:black !important; } .pdf-export { background:white !important; }`;
      document.head.appendChild(style);
    }
  }, []);

  const generatePDF = async () => {
    if (!summaryRef.current) return;
    const el = summaryRef.current;
    el.classList.add('pdf-export');
    await new Promise((r) => setTimeout(r, 80));
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ format: 'a4', unit: 'pt' });
      const w = pdf.internal.pageSize.getWidth() - 40;
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, 'PNG', 20, 20, w, h);
      pdf.save('financing_summary.pdf');
    } finally {
      el.classList.remove('pdf-export');
    }
  };

  const labelClass = `text-sm font-semibold ${isDarkTheme ? 'text-white' : 'text-black'}`;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-panel rounded-xl shadow-lg overflow-hidden p-8">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/finance')}
              className="px-3 py-1 bg-sky-600 text-white rounded-md"
            >
              ← Back
            </button>

            <h1 className="text-3xl font-extrabold text-white">Cost Calculator</h1>

            <button
              onClick={generatePDF}
              className="px-3 py-2 bg-green-400 text-black font-bold rounded-md"
            >
              Export PDF
            </button>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT - VEHICLE */}
            <div className="space-y-4">
              <label className={labelClass}>Select Vehicle</label>
              <select
                className="w-full p-3 rounded bg-white text-black border border-slate-500"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
              >
                <option value="">-- Choose Vehicle --</option>
                {vehicleOptions.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} — ${money(v.price)}
                  </option>
                ))}
              </select>

              <div className="rounded-lg border border-slate-700 p-3 bg-white/5">
                {selectedName ? (
                  <img
                    src={
                      vehicleOptions.find((v) => v.name === selectedName)?.img ||
                      fallbackImage
                    }
                    alt={selectedName}
                    className="w-full h-64 object-cover mb-3 rounded"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-400">
                    Select a vehicle to preview
                  </div>
                )}

                <div className="text-lg font-bold">{selectedName || '--'}</div>
                <div className="font-bold text-sky-300">
                  {showValues ? `$${money(vehicleValue)}` : '$0.00'}
                </div>
              </div>
            </div>

            {/* RIGHT — FORM */}
            <div className="bg-slate-800 p-5 rounded-lg space-y-4 text-white">
              {/* Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Interest Rate (%)</label>
                  <input
                    type="number"
                    className="w-full mt-2 p-2 rounded bg-bg text-black border border-slate-600"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className={labelClass}>Terms (months)</label>
                  <select
                    className="w-full mt-2 p-2 rounded bg-bg text-black border border-slate-600"
                    value={terms}
                    onChange={(e) => setTerms(Number(e.target.value))}
                  >
                    {[12, 18, 24, 36, 48, 60, 72].map((t) => (
                      <option key={t} value={t}>
                        {t} months
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Downpayment (%)</label>
                <input
                  type="number"
                  className="w-full mt-2 p-2 rounded bg-bg text-black border border-slate-600"
                  value={downpaymentPercent}
                  onChange={(e) => setDownpaymentPercent(Number(e.target.value))}
                />
              </div>

              {/* Costing Summary Box */}
              <div className="bg-black/30 p-4 rounded mt-4 border border-slate-600">
                <h2 className="text-lg font-bold mb-2">Costing Summary</h2>

                <InfoRow label="Vehicle Value" value={showValues ? `$${money(vehicleValue)}` : '--'} />
                <InfoRow label="Miscellaneous (Insurance + License)" value={showValues ? `$${money(miscFees)}` : '--'} />
                <InfoRow label="Yearly Interest" value={showValues ? `$${money(yearlyInterest)}` : '--'} />
                <InfoRow label="Total Interest (Term)" value={showValues ? `$${money(totalInterestTerm)}` : '--'} />
                <InfoRow label="Total Finance Amount" value={showValues ? `$${money(totalFinanceAmount)}` : '--'} />
                <InfoRow label="Downpayment" value={showValues ? `$${money(downpayment)}` : '--'} />
                <InfoRow label="Balance" value={showValues ? `$${money(balance)}` : '--'} />
                <InfoRow label="Monthly Invoice Fee" value={showValues ? `$${money(monthlyInvoice)}` : '--'} />
                <InfoRow label="Total Due Upon Signing" value={showValues ? `$${money(totalDueAtSigning)}` : '--'} />
              </div>
            </div>
          </div>

          {/* FINANCING SUMMARY PRINT SECTION */}
          <div className="mt-8" ref={summaryRef}>
            <div className="bg-slate-900 p-6 rounded border border-slate-700 text-white">
              <h3 className="text-xl font-bold mb-4">Financing Summary</h3>

              <InfoRow label="Vehicle" value={selectedName || '--'} />
              <InfoRow label="Vehicle Price" value={showValues ? `$${money(vehicleValue)}` : '--'} />
              <InfoRow label="Miscellaneous Fees" value={showValues ? `$${money(miscFees)}` : '--'} />
              <InfoRow label="Yearly Interest" value={showValues ? `$${money(yearlyInterest)}` : '--'} />
              <InfoRow label="Total Interest for Term" value={showValues ? `$${money(totalInterestTerm)}` : '--'} />
              <InfoRow label="Total Finance Amount" value={showValues ? `$${money(totalFinanceAmount)}` : '--'} />
              <InfoRow label="Downpayment Amount" value={showValues ? `$${money(downpayment)}` : '--'} />
              <InfoRow label="Balance" value={showValues ? `$${money(balance)}` : '--'} />
              <InfoRow label="Monthly Invoice Fee" value={showValues ? `$${money(monthlyInvoice)}` : '--'} />
              <InfoRow label="Total Due Upon Signing" value={showValues ? `$${money(totalDueAtSigning)}` : '--'} />
            </div>

            {/* BOTTOM CTA */}
            <div className="mt-10 p-8 bg-blue-50 rounded-2xl text-center shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                You're Only Minutes Away From Your New Car!
              </h2>

              <p className="text-gray-700 mb-2">
                Stop calculating, start driving. Your estimated payment looks great—now take the final step to secure your lease.
              </p>

              <p className="text-gray-700 mb-4">
                Our simple application is the fastest route to getting the keys.
              </p>

              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Finalize Your Terms</li>
                <li>Secure Your Vehicle</li>
                <li>Get Approved!</li>
              </ul>

              <Link
                to="/finance"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-4 px-10 rounded-xl text-lg font-semibold transition-all"
              >
                APPLY NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
