import React from 'react';

export default function InvoiceSummary({ invoices }) {
  const today = new Date();

  const clients = [...new Set(invoices.map(i => i.client))];

  const clientSummaries = clients.map(client => {
    const list = invoices.filter(i => i.client === client);
    return {
      client,
      totalPaid: list.filter(i => i.status === 'Paid').reduce((s, i) => s + Number(i.amount), 0),
      totalOutstanding: list.filter(i => i.status === 'Outstanding').reduce((s, i) => s + Number(i.amount), 0),
      totalDue: list
        .filter(i => i.status === 'Outstanding' && i.dueDate && new Date(i.dueDate) <= today)
        .reduce((s, i) => s + Number(i.amount), 0),
    };
  });

  return (
    <section>
      <h3 className="text-xl font-semibold mb-4 text-black">Invoice Summary Per Client</h3>

      {clientSummaries.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="border border-gray-300 p-2">Client</th>
              <th className="border border-gray-300 p-2">Total Paid</th>
              <th className="border border-gray-300 p-2">Total Outstanding</th>
              <th className="border border-gray-300 p-2">Total Due</th>
            </tr>
          </thead>

          <tbody>
            {clientSummaries.map(cs => (
              <tr key={cs.client} className="border-t">
                <td className="border border-gray-300 p-2">{cs.client}</td>
                <td className="border border-gray-300 p-2">{cs.totalPaid.toLocaleString()}</td>
                <td className="border border-gray-300 p-2">{cs.totalOutstanding.toLocaleString()}</td>
                <td className="border border-gray-300 p-2">{cs.totalDue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
