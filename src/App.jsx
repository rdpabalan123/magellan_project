import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AuthProvider from './context/AuthContext';
import ThemeProvider from './context/ThemeContext';

import Home from './pages/Home';
import CostCalculator from './pages/CostCalculator';
import FinanceApplication from './pages/FinanceApplication';
import ClientPortal from './pages/ClientPortal';

import CompanyPortalHome from './pages/CompanyPortalHome';
import ApplicationsWrapper from './pages/ApplicationsWrapper';
import InvoicesModule from './components/InvoicesModule';
import InvoiceSummary from './components/InvoiceSummary';
import InvoiceSummaryWrapper from './pages/InvoiceSummaryWrapper';
import CompanyDashboard from './pages/CompanyDashboard';
import DashboardLayout from './layouts/DashboardLayout';

import VehicleDatabase from './pages/VehicleDatabase';
import UserDatabase from './pages/UserDatabase'; // <-- Import UserDatabase

import Login from './pages/auth/Login';
import Register from './pages/auth/register';

import { seedVehicles } from './utils/vehicleStorage';

export default function App() {

  // ✅ Seed vehicles once on app load (safe + idempotent)
  useEffect(() => {
    seedVehicles();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/finance" element={<FinanceApplication />} />
          <Route path="/finance/calculator" element={<CostCalculator />} />
          <Route path="/client" element={<ClientPortal />} />

          {/* Company Portal with nested routes */}
          <Route
            path="/company/*"
            element={
              <DashboardLayout>
                <CompanyPortalHome />
              </DashboardLayout>
            }
          >
            <Route index element={<CompanyDashboard />} />
            <Route path="vehicles" element={<VehicleDatabase />} />
            <Route path="users" element={<UserDatabase />} /> {/* <-- Added user database route */}
            <Route path="applications" element={<ApplicationsWrapper />} />
            <Route path="invoices" element={<InvoicesModule />} />
            <Route path="summary" element={<InvoiceSummary />} />
            <Route path="invoice-summary" element={<InvoiceSummaryWrapper />} />
          </Route>

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}
