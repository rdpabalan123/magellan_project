import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import ThemeProvider from './context/ThemeContext'


import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import CostCalculator from './pages/CostCalculator'
import FinanceApplication from './pages/FinanceApplication'
import ClientPortal from './pages/ClientPortal'
import CompanyPortal from './pages/CompanyPortal'
import Invoices from './pages/Invoices'
import Login from './pages/auth/Login'


export default function App(){
    return (
        <AuthProvider>
            <ThemeProvider>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/finance" element={<FinanceApplication/>} />
                    <Route path="/finance/calculator" element={<CostCalculator />} />
                    <Route path="/client" element={<ClientPortal/>} />
                    <Route path="/company" element={<CompanyPortal/>} />


                    <Route path="/login" element={<Login/>} />
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/invoices" element={<Invoices/>} />


                    <Route path="*" element={<Navigate to='/' />} />
                </Routes>
            </ThemeProvider>
        </AuthProvider>
    )
}