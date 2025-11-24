import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'


function InvoiceList({ client }){
    const [invoices, setInvoices] = useState(()=> JSON.parse(localStorage.getItem('invoices')||'[]'))
    useEffect(()=>{ localStorage.setItem('invoices', JSON.stringify(invoices)) }, [invoices])
    const my = invoices.filter(i=>!i.client || i.client===client)
    return <div>{my.length===0? <p>No invoices yet.</p> : my.map(i=> (<div key={i.id} className="border p-2 rounded mb-2">Invoice #{i.id} - {i.status} - PHP {i.amount}</div>))}</div>
}


function ServiceRequests({ client }){
    const [reqs, setReqs] = useState(()=> JSON.parse(localStorage.getItem('serviceRequests')||'[]'))
    const [text, setText] = useState('')
    useEffect(()=>{ localStorage.setItem('serviceRequests', JSON.stringify(reqs)) }, [reqs])
    const submit=()=>{ if(!text) return; setReqs(r=>[{id:Date.now(),client,text,status:'Open'},...r]); setText('') }
    return (
        <div>
            <textarea className="input h-20" value={text} onChange={e=>setText(e.target.value)} placeholder="Describe issue" />
            <div className="flex justify-end mt-2"><button onClick={submit} className="px-3 py-1 bg-sky-600 text-white rounded">Request Service</button></div>
            <div className="mt-3">{reqs.filter(r=>r.client===client).map(r=> <div key={r.id} className="border p-2 rounded mb-2">{r.text} <div className="text-xs text-slate-400">{r.status}</div></div>)}</div>
        </div>
    )
}


export default function ClientPortal(){
    const { user } = useAuth()
    if(!user) return <DashboardLayout><div>Please login to access client portal.</div></DashboardLayout>


    const [profile, setProfile] = useState(()=> JSON.parse(localStorage.getItem(`client_${user.email}`)) || { name: user.email, phone:'', address:'' })
    useEffect(()=>{ localStorage.setItem(`client_${user.email}`, JSON.stringify(profile)) }, [profile, user])


    return (
        <DashboardLayout>
        <h2 className="text-2xl mb-4">Client Portal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4 rounded">
                <h3 className="font-semibold">Account</h3>
                <p>Name: {profile.name}</p>
                <p>Phone: {profile.phone || '—'}</p>
                <p>Address: {profile.address || '—'}</p>
                <button className="mt-2 px-3 py-1 bg-sky-600 text-white rounded" onClick={()=>{const n=prompt('New phone'); if(n) setProfile(p=>({...p, phone:n}))}}>Edit</button>
            </div>


            <div className="card p-4 rounded">
                <h3 className="font-semibold">Statements & Invoices</h3>
                <InvoiceList client={user.email} />
            </div>


            <div className="card p-4 rounded">
                <h3 className="font-semibold">Service Requests</h3>
                <ServiceRequests client={user.email} />
            </div>
        </div>


        <div className="card p-4 rounded mt-4">
            <h3 className="font-semibold">Knowledge Base / FAQ</h3>
            <details className="mt-2 p-2 border rounded"><summary>How do I make payments?</summary><p className="mt-2 text-sm">Payments are handled by our accounting department. Future releases will support online payments.</p></details>
        </div>
        </DashboardLayout>
    )
}