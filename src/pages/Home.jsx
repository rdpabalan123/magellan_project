import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import StatCard from '../components/Card'


export default function Home(){
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <section className="rounded p-6 card">
                    <h1 className="text-2xl font-bold">Let Magellan Finance help you own your dream car</h1>
                    <p className="text-sm text-slate-300 mt-2">Wide choices • Trusted by clients • Fast and Easy Financing</p>
                </section>


                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Wide choices">Huge selection and flexible terms.</StatCard>
                    <StatCard title="Trusted by Clients">Long-standing relationships and transparent process.</StatCard>
                    <StatCard title="Fast and Easy Financing">Quick approvals with minimal paperwork.</StatCard>
                </section>


                <section className="card p-4">
                    <h2 className="font-semibold">Contact Us</h2>
                    <p className="text-sm mt-2">Email: info@magellan.com | Phone: (02) 1234-5678</p>
                </section>
            </div>
        </DashboardLayout>
    )
}