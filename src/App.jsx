import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import ThemeProvider from './context/ThemeContext';

import Home from './pages/Home';
import CostCalculator from './pages/CostCalculator';
import FinanceApplication from './pages/FinanceApplication';
import ClientPortal from './pages/ClientPortal';

import CompanyPortalHome from './pages/CompanyPortalHome';
import ApplicationsWrapper from './pages/ApplicationsWrapper';  // <-- import wrapper
import InvoicesModule from './components/InvoicesModule';
import InvoiceSummary from './components/InvoiceSummary';
import InvoiceSummaryWrapper from './pages/InvoiceSummaryWrapper';
import Login from './pages/auth/Login';
import Register from './pages/auth/register';

import DashboardLayout from './layouts/DashboardLayout';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
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
            <Route index element={<CompanyPortalHome />} />
            <Route path="applications" element={<ApplicationsWrapper />} />
            <Route path="invoices" element={<InvoicesModule />} />
            <Route path="summary" element={<InvoiceSummary />} />
            <Route path="invoice-summary" element={<InvoiceSummaryWrapper />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}
