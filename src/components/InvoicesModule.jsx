import React, { useState, useMemo } from 'react';
import useSortableData from '../hooks/useSortableData';

const PAGE_SIZE = 5;

export default function InvoicesModule({ invoices }) {
  const [invoiceTab, setInvoiceTab] = useState('outstanding');
  const [invoicePage, setInvoicePage] = useState(1);
  const [invoiceSearch, setInvoiceSearch] = useState('');

  const today = new Date();

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      let statusMatch = false;

      if (invoiceTab === 'outstanding') statusMatch = inv.status === 'Outstanding';
      else if (invoiceTab === 'paid') statusMatch = inv.status === 'Paid';
      else if (invoiceTab === 'nearDue') {
        if (inv.status !== 'Outstanding' || !inv.dueDate) return false;
        const diffDays = (new Date(inv.dueDate) - today) / (1000 * 60 * 60 * 24);
        statusMatch = diffDays >= 0 && diffDays <= 7;
      }

      const searchMatch =
        inv.client.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
        (inv.id + '').includes(invoiceSearch);

      return statusMatch && searchMatch;
    });
  }, [invoices, invoiceTab, invoiceSearch, today]);

  const { items: sortedInvoices, requestSort, sortConfig } = useSortableData(filteredInvoices);

  const invoicePageCount = Math.ceil(sortedInvoices.length / PAGE_SIZE);

  const invoicesToShow = sortedInvoices.slice((invoicePage - 1) * PAGE_SIZE, invoicePage * PAGE_SIZE);

  const SortableHeader = ({ label, sortKey }) => {
    const direction = sortConfig?.key === sortKey ? sortConfig.direction : null;
    return (
      <th
        className="border border-gray-300 p-2 cursor-pointer select-none"
        onClick={() => requestSort(sortKey)}
      >
        {label} {direction === 'asc' ? '▲' : direction === 'desc' ? '▼' : ''}
      </th>
    );
  };

  return (
    <section>
      <h3 className="text-xl font-semibold mb-2 text-black">Invoices</h3>

      <div className="flex gap-4 mb-3">
        {['outstanding', 'paid', 'nearDue'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setInvoiceTab(tab);
              setInvoicePage(1);
              setInvoiceSearch('');
            }}
            className={`px-4 py-2 rounded ${
              invoiceTab === tab ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tab === 'outstanding' ? 'Pending' : tab === 'paid' ? 'Paid' : 'Near Due'}
          </button>
        ))}

        <input
          type="text"
          placeholder="Search by client or invoice ID..."
          value={invoiceSearch}
          onChange={(e) => {
            setInvoiceSearch(e.target.value);
            setInvoicePage(1);
          }}
          className="ml-auto px-3 py-1 border rounded"
        />
      </div>

      {invoicesToShow.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <>
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead className="bg-gray-100 text-black">
              <tr>
                <SortableHeader label="Invoice ID" sortKey="id" />
                <SortableHeader label="Client" sortKey="client" />
                <SortableHeader label="Amount (PHP)" sortKey="amount" />
                <SortableHeader label="Status" sortKey="status" />
                <SortableHeader label="Due Date" sortKey="dueDate" />
              </tr>
            </thead>

            <tbody>
              {invoicesToShow.map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="border border-gray-300 p-2">{i.id}</td>
                  <td className="border border-gray-300 p-2">{i.client}</td>
                  <td className="border border-gray-300 p-2">
                    {Number(i.amount).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 p-2 capitalize">{i.status}</td>
                  <td className="border border-gray-300 p-2">{i.dueDate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {invoicePageCount > 1 && (
            <div className="flex justify-center mt-2 gap-2">
              <button
                disabled={invoicePage === 1}
                onClick={() => setInvoicePage((p) => p - 1)}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {invoicePage} of {invoicePageCount}
              </span>
              <button
                disabled={invoicePage === invoicePageCount}
                onClick={() => setInvoicePage((p) => p + 1)}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
