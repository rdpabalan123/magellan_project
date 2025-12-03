// src/components/InvoiceSummaryWrapper.jsx
import React, { useState, useEffect } from 'react';
import InvoiceSummary from './InvoiceSummary';

export default function InvoiceSummaryWrapper() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    // Load invoices from localStorage or empty array if not found
    const storedInvoices = localStorage.getItem('invoices');
    if (storedInvoices) {
      try {
        setInvoices(JSON.parse(storedInvoices));
      } catch (error) {
        console.error('Failed to parse invoices from localStorage:', error);
        setInvoices([]);
      }
    } else {
      setInvoices([]);
    }
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
