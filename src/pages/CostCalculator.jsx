// src/pages/CostCalculator.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTheme } from '../context/ThemeContext';

const fallbackImage = '/mnt/data/2402fabf-39d0-49ce-9ef7-b7116e8ddcad.png';

const VEHICLES = [
  { name: '162255 - 2026 - RAM - PICKUP - WHITE - 8 6.4L V8', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2026-Ram-2500-Tradesman.jpg' },
  { name: '252801 - 2026 - SUZUKI - SUV - GREEN - 0', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Jimny.jpg' },

  { name: '653057 - 2025 - JEEP - SUV - BRANCO P - 4 1.3L', amount: 42500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Renegade-Latitude.jpg' },
  { name: '664387 - 2025 - JEEP - SUV - WHITE - 4 1.3', amount: 42900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Renegade-Latitude.jpg' },
  { name: '664762 - 2025 - JEEP - SUV - GRANITE - 4 1.3', amount: 42900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Renegade-Latitude.jpg' },

  { name: "565448 - 2025 - JEEP - SUV - '41 DRAB - 4 2.0L L4", amount: 77500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Wrangler-Sport.jpg' },
  { name: "565449 - 2025 - JEEP - SUV - MOJITO G - 4 2.0L L4", amount: 75900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Wrangler-Sport.jpg' },
  { name: "507882 - 2025 - JEEP - SUV - BRIGHT W - 4 2.0L L4", amount: 75900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Wrangler-Sport.jpg' },
  { name: "591753 - 2025 - JEEP - WAGON 4DO - ORANGE - 4 2.0L L4", amount: 75900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Wrangler-Sport.jpg' },

  { name: '649761 - 2025 - RAM - PICKUP - WHITE - 6 3.6L V6', amount: 65500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
  { name: '550876 - 2025 - RAM - PICKUP - WHITE - 6 3.6L V6', amount: 68500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
  { name: '555635 - 2025 - RAM - PICKUP - BILLETS - 6 3.6L V6', amount: 64900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
  { name: '555130 - 2025 - RAM - PICKUP - BILLETS - 6 3.6L V6', amount: 64900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
  { name: '649760 - 2025 - RAM - PICKUP - WHITE - 6 3.6L V6', amount: 65500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
  { name: '565269 - 2025 - RAM - PICKUP - WHITE - 6 3.6L V6', amount: 68900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
  { name: '554771 - 2025 - RAM - PICKUP - SILVER - 6 3.6L V6', amount: 68900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },

  { name: '654848 - 2025 - RAM - PICKUP - WHITE - 6 3.6L V6', amount: 63900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-Tradesman.jpg' },
  { name: '654896 - 2025 - RAM - NIGHT EDIT - BRIGHT W - 6 3.6L V6', amount: 69900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-Tradesman.jpg' },
  { name: '654849 - 2025 - RAM - PICKUP - WHITE - 6 3.6L V6', amount: 63900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-Tradesman.jpg' },

  { name: '88033 - 2025 - RAM - PICKUP - SILVER - 3 1.0L', amount: 38900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-700.jpg' },
  { name: '99878 - 2025 - RAM - TRUCK - SILVER - 4 2.0', amount: 58900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-Rampage.jpg' },

  { name: '271285 - 2025 - SUZUKI - TRUCK - WHITE - 0', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Carry.jpg' },
  { name: '271282 - 2025 - SUZUKI - TRUCK - WHITE - 0', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Carry.jpg' },

  { name: '492884 - 2025 - SUZUKI - GRANDEUR - 0 1.5', amount: 33500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Fronx.jpg' },
  { name: '104389 - 2025 - SUZUKI - SUV - SPLENDID - 0 1.5', amount: 38900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Grand-Vitara.jpg' },
  { name: '187453 - 2025 - SUZUKI - SUV - KINETIC - 0', amount: 39500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Jimny.jpg' },

  { name: '337175 - 2025 - SUZUKI - PICK UPTR - WHITE - 3 1.2L', amount: 27500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Super-Carry.jpg' },
  { name: '316532 - 2025 - SUZUKI - TRUCK - WHITE - 0', amount: 27500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Super-Carry.jpg' },
  { name: '337208 - 2025 - SUZUKI - TRUCK - WHITE - 3 1.2L', amount: 27500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Super-Carry.jpg' },
  { name: '337355 - 2025 - SUZUKI - TRUCK - WHITE - 3 1.2L', amount: 27500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Super-Carry.jpg' },

  { name: '107641 - 2025 - SUZUKI - SUV - SNOW WHI - 0 1.5', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-XL7.jpg' },
  { name: '107737 - 2025 - SUZUKI - SUV - SNOW WHI - 0', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-XL7.jpg' },
  { name: '107618 - 2025 - SUZUKI - SUV - MAGMA GR - 0', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-XL7.jpg' },
  { name: '108019 - 2025 - SUZUKI - SUV - EYP SAVA - 0', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-XL7.jpg' },
  { name: '107603 - 2025 - SUZUKI - SUV - RISING0 - 0 1.5', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-XL7.jpg' },
  { name: '107630 - 2025 - SUZUKI - SUV - MAGMAGR - 0 1.5', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-XL7.jpg' },

  { name: '239516 - 2025 - TOYOTA - DOUBLECAB - WHITE - 0 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '240102 - 2025 - TOYOTA - TRUCK DOUB - WHITE - 4 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '855986 - 2025 - TOYOTA - TRUCKSING - WHITE - 0 2.4', amount: 41900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '239960 - 2025 - TOYOTA - DOUBLE CAB - WHITE - 0', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '558431 - 2025 - TOYOTA - TRUCK DOUB - WHITE - 4 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '855988 - 2025 - TOYOTA - TRUCK SING - WHITE - 0 2.4', amount: 41900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '239799 - 2025 - TOYOTA - TRUCK DOUB - WHITE - 4 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '558120 - 2025 - TOYOTA - DOUBLECA - WHITE - 0 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '557914 - 2025 - TOYOTA - DOUBLE CAB - WHITE - 0', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '238864 - 2025 - TOYOTA - TRUCK DOUB - WHITE - 4 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '558262 - 2025 - TOYOTA - TRUCKDOUB - WHITE - 4 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '558428 - 2025 - TOYOTA - TRUCK DOUB - WHITE - 4 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
];


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

  const [selectedName, setSelectedName] = useState('');
  const [vehicleValue, setVehicleValue] = useState(0);
  const [interestRate, setInterestRate] = useState(12); // %
  const [terms, setTerms] = useState(24); // months
  const [downpaymentPercent, setDownpaymentPercent] = useState(20); // %

  // Fixed fees
  const insurance = 4443.39;
  const licenseFee = 1260.0;
  const adminFee = 350.0;

  const vehicle = VEHICLES.find((v) => v.name === selectedName) || null;

  useEffect(() => {
    if (vehicle) setVehicleValue(vehicle.amount);
    else setVehicleValue(0);
  }, [vehicle]);

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
  const showValues = !!vehicle;

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

  // Render
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
                {VEHICLES.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} — ${money(v.amount)}
                  </option>
                ))}
              </select>

              <div className="rounded-lg border border-slate-700 p-3 bg-white/5">
                {vehicle ? (
                  <img
                    src={vehicle.img}
                    alt={vehicle.name}
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

                <div className="text-lg font-bold">
                  {vehicle ? vehicle.name : '--'}
                </div>
                <div className="font-bold text-sky-300">
                  {vehicle ? `$${money(vehicleValue)}` : '$0.00'}
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

              <InfoRow label="Vehicle" value={vehicle ? vehicle.name : '--'} />
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

              <p className="font-semibold text-gray-800 mb-6">
                Hit <span className="italic">'Apply Now'</span> and let us get you on the road!
              </p>

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
