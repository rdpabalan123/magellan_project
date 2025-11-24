import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function CostCalculator() {
  const navigate = useNavigate();
  const summaryRef = useRef(null);

  // Fixed values
  const vehicleValue = 1000000;
  const insurance = 3000;
  const licenseFee = 1200;
  const adminFee = 350;
  const terms = 24; // months
  const interestRate = 0.12;
  const downpaymentPercent = 0.2;

  // Calculations
  const interestAmount = vehicleValue * interestRate * (terms / 12);
  const totalFixedFees = insurance + licenseFee + adminFee;
  const financingValue = vehicleValue + totalFixedFees + interestAmount;
  const downpayment = financingValue * downpaymentPercent;
  const balance = financingValue - downpayment;
  const monthlyRentalFee = balance / terms;

  // Export PDF function
  const generatePDF = () => {
    if (!summaryRef.current) return;
    html2canvas(summaryRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 40;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth, pdfHeight);
      pdf.save('financing_summary.pdf');
    });
  };

  // Reusable row for info boxes
  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-1">
      <span className="font-semibold">{label}</span>
      <span className="font-bold bg-slate-700 px-3 py-1 rounded">{value}</span>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-3xl p-6 bg-panel rounded-lg shadow-lg mx-auto">
        {/* Buttons row */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => navigate('/finance')}
            className="px-3 py-1 text-xs bg-sky-600 text-white rounded hover:bg-sky-700 transition shadow-sm"
            aria-label="Back to Finance Application"
          >
            &larr; Back
          </button>
          <button
            onClick={generatePDF}
            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition shadow-sm"
            aria-label="Export Financing Summary as PDF"
          >
            Export PDF
          </button>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-text">Cost Calculator</h2>

        {/* Vehicle Value */}
        <div className="mb-6 text-lg font-semibold text-sky-600">
          Vehicle Value (USD): ${vehicleValue.toLocaleString()}
        </div>

        {/* Fixed Fees and Loan Terms */}
        <div className="grid grid-cols-2 gap-6 mb-8 text-text text-sm">
          <div className="bg-bg p-4 rounded shadow-inner">
            <h3 className="font-semibold mb-4 text-lg border-b border-slate-700 pb-2">
              Fixed Fees
            </h3>
            <InfoRow label="Insurance (3 yrs)" value={`$${insurance.toLocaleString()}`} />
            <InfoRow label="License Fee" value={`$${licenseFee.toLocaleString()}`} />
            <InfoRow label="Admin Fee" value={`$${adminFee.toLocaleString()}`} />
            <hr className="my-3 border-slate-700" />
            <InfoRow label="Total Fixed Fees" value={`$${totalFixedFees.toLocaleString()}`} />
          </div>

          <div className="bg-bg p-4 rounded shadow-inner">
            <h3 className="font-semibold mb-4 text-lg border-b border-slate-700 pb-2">
              Loan Terms
            </h3>
            <InfoRow label="Terms" value={`${terms} months`} />
            <InfoRow label="Interest Rate" value={`${(interestRate * 100).toFixed(0)}%`} />
            <InfoRow label="Interest Amount" value={`$${interestAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}`} />
            <InfoRow label="Downpayment" value={`${(downpaymentPercent * 100).toFixed(0)}%`} />
            <InfoRow label="Downpayment Amount" value={`$${downpayment.toLocaleString(undefined, {minimumFractionDigits: 2})}`} />
          </div>
        </div>

        {/* Financing Summary */}
        <div
          ref={summaryRef}
          className="bg-bg p-6 rounded shadow-md text-text mb-10"
        >
          <h3 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">
            Financing Summary
          </h3>
          <div className="space-y-3 text-base font-medium">
            <InfoRow label="Financing Value" value={`$${financingValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`} />
            <InfoRow label="Downpayment Amount" value={`$${downpayment.toLocaleString(undefined, {minimumFractionDigits: 2})}`} />
            <InfoRow label="Balance" value={`$${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}`} />
            <InfoRow label="Monthly Rental Fee" value={`$${monthlyRentalFee.toFixed(2)}`} />
          </div>
        </div>

        {/* Additional Information */}
        <div className="text-text text-sm border-t border-slate-700 pt-6 space-y-4">
            <h4 className="font-bold text-lg mb-3">Additional Information</h4>
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
            <div key={label} className="border border-slate-700 rounded p-3">
                <div className="font-bold mb-1">{label}:</div>
                <div>{value}</div>
            </div>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
