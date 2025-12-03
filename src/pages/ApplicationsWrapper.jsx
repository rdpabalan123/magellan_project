// src/pages/ApplicationsWrapper.jsx
import React, { useState, useEffect } from 'react';
import ApplicationsModule from '../components/ApplicationsModule';

export default function ApplicationsWrapper() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const storedApps = JSON.parse(localStorage.getItem('applications') || '[]');
    setApps(storedApps);
  }, []);

  const updateApplicationStatus = (id, status) => {
    setApps((prevApps) => {
      const updatedApps = prevApps.map((app) =>
        app.id === id ? { ...app, status } : app
      );
      localStorage.setItem('applications', JSON.stringify(updatedApps));
      return updatedApps;
    });
  };

  return (
    <ApplicationsModule apps={apps} updateApplicationStatus={updateApplicationStatus} />
  );
}
