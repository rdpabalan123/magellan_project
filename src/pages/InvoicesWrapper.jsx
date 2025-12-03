import React, { useState, useEffect } from 'react';
import InvoicesModule from '../components/InvoicesModule';

export default function InvoicesWrapper() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    setInvoices(storedInvoices);
  }, []);

  // Example of a method to update invoice status (adjust as needed)
  const updateInvoiceStatus = (id, status) => {
    setInvoices((prevInvoices) => {
      const updatedInvoices = prevInvoices.map((invoice) =>
        invoice.id === id ? { ...invoice, status } : invoice
      );
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
      return updatedInvoices;
    });
  };

  return (
    <InvoicesModule invoices={invoices} updateInvoiceStatus={updateInvoiceStatus} />
  );
}
