// src/pages/CostCalculator.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTheme } from '../context/ThemeContext';  // <-- Import your theme context hook

const fallbackImage = '/mnt/data/2402fabf-39d0-49ce-9ef7-b7116e8ddcad.png';

const VEHICLES = [
  { name: 'Kio Seltos', amount: 25000, img: 'https://cdn.jdpower.com/Models/640x480/2021-Kia-Seltos-SX.jpg' },
  { name: 'Suzuki Swift', amount: 26000, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkIfysA8Ahwn_DAxcpztBQtEDQf8Slx79d8Q&s' },
  { name: 'Suzuki Ciaz', amount: 27000, img: 'https://www.autodeal.com.ph/custom/car-model-photo/original/2022-suzuki-ciaz-front-quarter-philippines-60e7cc4701283.jpg' },
  { name: 'Hyundai Storia', amount: 28000, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvzDu55nJpY7Bb6i-gS5fQtedYFOlOYnp1lQ&s' },
  { name: 'Jeep Wrangler', amount: 29000, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5QYP7i0WkB4PSNdMWHpE02qaVRE5hHiXQzw&s' },
  { name: 'Suzuki Ignis', amount: 30000, img: 'https://www.suzukiauto.co.za/hubfs/Ignis%20-%20Glistening%20Grey%20Metallic.png' },
  { name: 'Nissan Terra', amount: 31000, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkgq38v4Sc2ulvkCUWxsBDwv9hIFhTjVrXdg&s' },
  { name: 'Suzuki Dzire', amount: 32000, img: 'https://www.autodeal.com.ph/custom/car-model-photo/original/suzuki-dzire-637b2efcc7f9b.jpg' },
  { name: 'Nissan Almera', amount: 33000, img: 'https://www-asia.nissan-cdn.net/content/dam/Nissan/th/vehicles/VLP/almera-my23/new/spec/vl-spec.jpg' },
];


function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="font-semibold text-sm">{label}</span>
      <span className="font-bold bg-white px-3 py-1 rounded text-sm text-black">{value}</span>
    </div>
  );
}


export default function CostCalculator() {
  const navigate = useNavigate();
  const summaryRef = useRef(null);
  const { theme } = useTheme();   // <-- Get theme from context
  const isDarkTheme = theme === 'dark';

  // UI state
  const [selectedName, setSelectedName] = useState('');
  const [vehicleValue, setVehicleValue] = useState(0);
  const [interestRate, setInterestRate] = useState(12); // percent, whole number
  const [terms, setTerms] = useState(24); // months
  const [downpaymentPercent, setDownpaymentPercent] = useState(20); // percent, whole number

  // Fixed fees - fixed values, non-editable
  const insurance = 3000;
  const licenseFee = 1200;
  const adminFee = 350;

  const vehicle = VEHICLES.find((v) => v.name === selectedName) || null;

  // Sync vehicleValue with selected vehicle amount on selection change
  useEffect(() => {
    if (vehicle) {
      setVehicleValue(vehicle.amount);
    } else {
      setVehicleValue(0);
    }
  }, [vehicle]);

  // Calculations
  const interestAmount = vehicleValue * (interestRate / 100) * (terms / 12);
  const totalFixedFees = insurance + licenseFee + adminFee;
  const financingValue = vehicleValue + totalFixedFees + interestAmount;
  const downpayment = financingValue * (downpaymentPercent / 100);
  const balance = financingValue - downpayment;
  const monthlyPayment = terms > 0 ? balance / terms : 0;

  // Inject PDF style for black text
  useEffect(() => {
    const id = 'cost-calc-pdf-forced-style';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.innerHTML = `
        .pdf-export * { color: black !important; }
        .pdf-export { background: white !important; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const generatePDF = async () => {
    if (!summaryRef.current) return;
    const el = summaryRef.current;
    el.classList.add('pdf-export');
    await new Promise((r) => setTimeout(r, 60));
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 40; // margin 20
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth, pdfHeight);
      pdf.save('financing_summary.pdf');
    } catch (err) {
      console.error('PDF export error', err);
      alert('PDF generation failed — see console for details.');
    } finally {
      el.classList.remove('pdf-export');
    }
  };

  // Common label class for dynamic theme
  const labelClass = `text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-black'}`;

  // Common button styles (dynamic text color)
  const buttonClass =
    `px-3 py-1 text-sm rounded-md bg-sky-600 hover:bg-sky-700 transition font-semibold ` +
    (isDarkTheme ? 'text-white' : 'text-white');

  const exportButtonClass =
    `px-3 py-2 text-sm rounded-md bg-green-400 hover:bg-green-500 transition font-semibold ` +
    (isDarkTheme ? 'text-slate-900' : 'text-slate-900'); // text dark for export button

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-panel rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/finance')} className={buttonClass}>
                  ← Back
                </button>
                <h1 className={`text-2xl md:text-3xl font-extrabold ml-2 ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                  Cost Calculator
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={generatePDF} className={exportButtonClass}>
                  Export PDF
                </button>
              </div>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LEFT: Vehicle selector, image, price display */}
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Select Vehicle</label>
                  <select
                    className="w-full p-3 rounded border border-slate-600 bg-white text-black"
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                  >
                    <option value="">-- Choose Vehicle --</option>
                    {VEHICLES.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} — ${v.amount.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-lg border border-slate-700 overflow-hidden bg-white/5 p-3">
                  {vehicle ? (
                    <img
                      src={vehicle.img}
                      alt={vehicle.name}
                      className="w-full h-64 object-cover rounded-md mb-3"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-slate-800 rounded-md text-muted">
                      <span>Select a vehicle to preview</span>
                    </div>
                  )}

                  <div className="mt-2">
                    <div className={`font-semibold text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                      {vehicle ? vehicle.name : 'No vehicle selected'}
                    </div>
                    <div className="text-sky-600 font-bold">${vehicleValue.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Inputs and live result */}
              <div>
                <div className="bg-bg rounded-lg p-4 space-y-4">
                  {/* Inputs row 1 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Interest Rate (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        className="w-full mt-2 p-2 rounded border border-slate-600 bg-bg text-black"
                        value={interestRate}
                        onChange={(e) => {
                          let val = Math.min(100, Math.max(0, Number(e.target.value)));
                          if (isNaN(val)) val = 0;
                          setInterestRate(Math.round(val));
                        }}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Terms (months)</label>
                      <select
                        className="w-full mt-2 p-2 rounded border border-slate-600 bg-bg text-black"
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

                  {/* Inputs row 2 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Downpayment (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        className="w-full mt-2 p-2 rounded border border-slate-600 bg-bg text-black"
                        value={downpaymentPercent}
                        onChange={(e) => {
                          let val = Math.min(100, Math.max(0, Number(e.target.value)));
                          if (isNaN(val)) val = 0;
                          setDownpaymentPercent(Math.round(val));
                        }}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Insurance (total)</label>
                      <input
                        type="number"
                        className="w-full mt-2 p-2 rounded border border-slate-600 bg-white text-black cursor-not-allowed"
                        value={insurance}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Inputs row 3 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>License Fee</label>
                      <input
                        type="number"
                        className="w-full mt-2 p-2 rounded border border-slate-600 bg-white text-black cursor-not-allowed"
                        value={licenseFee}
                        disabled
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Admin Fee</label>
                      <input
                        type="number"
                        className="w-full mt-2 p-2 rounded border border-slate-600 bg-bg text-black cursor-not-allowed"
                        value={adminFee}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Live result box */}
                  <div className="mt-3 p-4 bg-slate-800 rounded text-text">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-white">Interest Amount</span>
                      <span className="font-bold text-sky-400">${interestAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-white">Total Fixed Fees</span>
                      <span className="font-bold text-sky-400">${totalFixedFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-white">Financing Value</span>
                      <span className="font-bold text-sky-400">${financingValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-white">Downpayment Amount</span>
                      <span className="font-bold text-sky-400">${downpayment.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-white">Monthly Payment</span>
                      <span className="font-extrabold text-2xl text-sky-300">${monthlyPayment.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-white/70">
                    <div className="font-semibold mb-1">Amortization (preview)</div>
                    <div>
                      First month approx. payment: <strong>${monthlyPayment.toFixed(2)}</strong>
                    </div>
                    <div className="text-xs">Estimates exclude taxes or other external fees.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Printable Summary */}
            <div className="mt-8" ref={summaryRef}>
              <div className={`bg-bg p-6 rounded-lg border border-slate-700 ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                <h3 className="text-lg font-bold mb-4">Financing Summary</h3>

                <div className="grid grid-cols-1 gap-3">
                  <InfoRow label="Vehicle" value={vehicle ? vehicle.name : '—'} />
                  <InfoRow label="Vehicle Price" value={`$${vehicleValue.toLocaleString()}`} />
                  <InfoRow label="Interest Amount" value={`$${interestAmount.toFixed(2)}`} />
                  <InfoRow label="Total Fixed Fees" value={`$${totalFixedFees.toLocaleString()}`} />
                  <InfoRow label="Financing Value" value={`$${financingValue.toFixed(2)}`} />
                  <InfoRow label="Downpayment" value={`${downpaymentPercent}%`} />
                  <InfoRow label="Downpayment Amount" value={`$${downpayment.toFixed(2)}`} />
                  <InfoRow label="Balance" value={`$${balance.toFixed(2)}`} />
                  <InfoRow label="Monthly Payment" value={`$${monthlyPayment.toFixed(2)}`} />
                </div>
              </div>

              {/* Additional Information */}
              <div className={`mt-6 grid grid-cols-1 gap-3 ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                {[
                  ['Authorized Repair Facility', 'Bayview Motors, Ltd.'],
                  ['Authorized Use of Vehicle', 'Private'],
                  ['Authorized Island of Use', 'Providenciales'],
                  ['Warranty', '1 year or 10,000 kms whichever comes first'],
                  ['Option to Purchase', 'After 12 months'],
                  ['Fee', '$250'],
                  ['Payment Due Date', 'First of each month'],
                  [
                    'Payment Instructions',
                    'Please make cheque payable to MAGELLAN FINANCIAL SERVICES, LTD. Payment should be made at Bayview Motors, Ltd. Office',
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="border border-slate-700 rounded p-3 bg-white/5">
                    <div className="font-bold mb-1">{label}:</div>
                    <div>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
