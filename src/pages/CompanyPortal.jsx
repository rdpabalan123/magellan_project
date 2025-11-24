import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'

export default function CompanyPortal(){
  const [apps, setApps] = useState(()=> JSON.parse(localStorage.getItem('applications')||'[]'))
  const [invoices, setInvoices] = useState(()=> JSON.parse(localStorage.getItem('invoices')||'[]'))
  useEffect(()=>{ localStorage.setItem('applications', JSON.stringify(apps)); localStorage.setItem('invoices', JSON.stringify(invoices)) }, [apps, invoices])

  return (
    <DashboardLayout>
      <h2 className="text-2xl mb-4">Company Portal</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="card p-4">Awaiting: {invoices.filter(i=>i.status==='Awaiting').length}</div>
        <div className="card p-4">Outstanding: {invoices.filter(i=>i.status==='Outstanding').length}</div>
        <div className="card p-4">Paid: {invoices.filter(i=>i.status==='Paid').length}</div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold">Applications</h3>
        {apps.length===0? <p>No apps yet.</p> : (
          <table className="w-full text-sm"><thead className="bg-white/5"><tr><th className="p-2">ID</th><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Status</th></tr></thead>
            <tbody>{apps.map(a=> <tr key={a.id} className="border-t"><td className="p-2">{a.id}</td><td className="p-2">{a.firstName} {a.lastName}</td><td className="p-2">{a.email}</td><td className="p-2">{a.status}</td></tr>)}</tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  )
}