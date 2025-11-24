import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'


export default function Login(){
    const [email, setEmail] = useState('')
    const { login } = useAuth()
    const nav = useNavigate()
    const submit = e => { e.preventDefault(); if(!email) return alert('Enter email'); login(email); nav('/client') }
    return (
        <div className="max-w-md mx-auto mt-12 card p-6">
            <h3 className="text-xl mb-4">Login (mock)</h3>
            <form onSubmit={submit} className="space-y-3">
                <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
                <div className="flex justify-end"><button className="px-4 py-2 bg-sky-600 text-white rounded">Login</button></div>
            </form>
        </div>
    )
}