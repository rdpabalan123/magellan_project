import React from 'react';
import { Routes, Route } from 'react-router-dom';

import CompanyPortalHome from './CompanyPortalHome';
import ApplicationsModule from '../components/ApplicationsModule';
import InvoicesModule from '../components/InvoicesModule';
import InvoiceSummary from '../components/InvoiceSummary';

export default function CompanyPortal() {
  return (
    <Routes>
      <Route path="/company" element={<CompanyPortalHome />}>
        <Route index element={<CompanyPortalHome />} />
        <Route path="applications" element={<ApplicationsModule />} />
        <Route path="invoices" element={<InvoicesModule />} />
        <Route path="summary" element={<InvoiceSummary />} />
      </Route>
    </Routes>
  );
}
