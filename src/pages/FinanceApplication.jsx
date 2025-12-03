import React from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../layouts/DashboardLayout';
import { storage } from '../services/storage';

export default function FinanceApplication() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    // Add unique id and initial status "submitted"
    const newApp = {
      id: Date.now(),
      ...data,
      status: 'submitted', // lowercase to match mapping in dashboard
    };

    // Save to localStorage using your storage service
    storage.push('applications', newApp);

    alert('Application submitted successfully!');
    reset();

    // Optional: trigger event or callback to update dashboard if needed
    // For now, dashboard reads from localStorage, so it will pick up new data on refresh
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl mb-4 text-black">Finance Application</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <fieldset className="p-4 border rounded">
            <legend className="font-semibold text-lg">Personal Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <input
                {...register('firstName', { required: true })}
                placeholder="First name"
                className="input"
              />
              <input
                {...register('lastName', { required: true })}
                placeholder="Last name"
                className="input"
              />
              <input
                {...register('email', { required: true })}
                placeholder="Email"
                type="email"
                className="input col-span-2"
              />
              <input {...register('phone')} placeholder="Phone" className="input" />
            </div>
          </fieldset>

          <fieldset className="p-4 border rounded">
            <legend className="font-semibold text-lg">Employment Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <input {...register('employer')} placeholder="Employer" className="input" />
              <input {...register('position')} placeholder="Position" className="input" />
              <input
                {...register('monthlyIncome')}
                placeholder="Monthly Income"
                type="number"
                className="input"
              />
              <input {...register('employmentType')} placeholder="Employment Type" className="input" />
            </div>
          </fieldset>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
