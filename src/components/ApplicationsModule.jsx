import React, { useState, useMemo } from 'react';
import useSortableData from '../hooks/useSortableData';

const PAGE_SIZE = 5;

export default function ApplicationsModule({ apps, updateApplicationStatus }) {
  const [appTab, setAppTab] = useState('awaiting');
  const [appPage, setAppPage] = useState(1);
  const [appSearch, setAppSearch] = useState('');

  const filteredApps = useMemo(() => {
    return apps.filter((a) => {
      const matchesSearch =
        a.email.toLowerCase().includes(appSearch.toLowerCase()) ||
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(appSearch.toLowerCase());

      const mappedStatus =
        a.status.toLowerCase() === 'submitted'
          ? 'awaiting'
          : a.status.toLowerCase();

      return mappedStatus === appTab && matchesSearch;
    });
  }, [apps, appTab, appSearch]);

  const { items: sortedApps, requestSort, sortConfig } = useSortableData(filteredApps);

  const appPageCount = Math.ceil(sortedApps.length / PAGE_SIZE);
  const appsToShow = sortedApps.slice((appPage - 1) * PAGE_SIZE, appPage * PAGE_SIZE);

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
      <h3 className="text-xl font-semibold mb-2 text-black">Finance Applications</h3>

      <div className="flex gap-4 mb-3">
        {['awaiting', 'approved', 'declined'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setAppTab(tab);
              setAppPage(1);
              setAppSearch('');
            }}
            className={`px-4 py-2 rounded ${
              appTab === tab ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}

        <input
          type="text"
          placeholder="Search by name or email..."
          value={appSearch}
          onChange={(e) => {
            setAppSearch(e.target.value);
            setAppPage(1);
          }}
          className="ml-auto px-3 py-1 border rounded"
        />
      </div>

      {appsToShow.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <>
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead className="bg-gray-100 text-black">
              <tr>
                <SortableHeader label="ID" sortKey="id" />
                <SortableHeader label="Name" sortKey="firstName" />
                <SortableHeader label="Email" sortKey="email" />
                <SortableHeader label="Status" sortKey="status" />
                {appTab === 'awaiting' && <th className="border border-gray-300 p-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {appsToShow.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="border border-gray-300 p-2">{a.id}</td>
                  <td className="border border-gray-300 p-2">{a.firstName} {a.lastName}</td>
                  <td className="border border-gray-300 p-2">{a.email}</td>
                  <td className="border border-gray-300 p-2 capitalize">{a.status}</td>
                  {appTab === 'awaiting' && (
                    <td className="border border-gray-300 p-2 space-x-2">
                      <button
                        onClick={() => updateApplicationStatus(a.id, 'approved')}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(a.id, 'declined')}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Decline
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {appPageCount > 1 && (
            <div className="flex justify-center mt-2 gap-2">
              <button
                disabled={appPage === 1}
                onClick={() => setAppPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {appPage} of {appPageCount}
              </span>
              <button
                disabled={appPage === appPageCount}
                onClick={() => setAppPage((p) => p + 1)}
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
