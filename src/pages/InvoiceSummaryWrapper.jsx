import React, { useState, useEffect } from 'react';
import InvoiceSummary from '../components/InvoiceSummary';

export default function InvoiceSummaryWrapper() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    setInvoices(storedInvoices);
  }, []);

  return (
    <div className="p-4">
      {invoices.length === 0 ? (
        <p>No invoice data available.</p>
      ) : (
        <InvoiceSummary invoices={invoices} />
      )}
    </div>
  );
}
