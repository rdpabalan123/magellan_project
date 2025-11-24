import React, { useState, useEffect } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'


export default function Invoices(){
    const [invoices, setInvoices] = useState(()=> JSON.parse(localStorage.getItem('invoices')||'[]'))
    const [form, setForm] = useState({ client:'', amount:'' })
    useEffect(()=>{ localStorage.setItem('invoices', JSON.stringify(invoices)) }, [invoices])
    const create = ()=>{ setInvoices(i=>[{ id: Date.now(), ...form, status:'Outstanding'}, ...i]); setForm({client:'', amount:''}) }


    return (
        <DashboardLayout>
            <h2 className="text-2xl mb-4">Invoices</h2>
            <div className="card p-4 mb-4">
                <input className="input mr-2" placeholder="Client email" value={form.client} onChange={e=>setForm(f=>({...f, client:e.target.value}))} />
                <input className="input mr-2" placeholder="Amount" value={form.amount} onChange={e=>setForm(f=>({...f, amount:e.target.value}))} />
                <button onClick={create} className="px-3 py-1 bg-sky-600 text-white rounded">Create Invoice</button>
            </div>


            <div className="card p-4">
                {invoices.map(inv=> <div key={inv.id} className="border-b py-2 flex justify-between"><div>#{inv.id} — {inv.client}</div><div>{inv.amount} — {inv.status}</div></div>)}
            </div>
        </DashboardLayout>
    )
}