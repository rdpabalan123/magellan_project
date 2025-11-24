import React from 'react'
import CollapsibleSidebar from '../components/CollapsibleSidebar'
import TopNav from '../components/TopNav'


export default function DashboardLayout({ children }){
    return (
        <div className="min-h-screen flex flex-col">
            <TopNav />
            <div className="flex flex-1 max-w-7xl mx-auto w-full">
                <CollapsibleSidebar />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}