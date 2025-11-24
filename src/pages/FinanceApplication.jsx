import React from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '../layouts/DashboardLayout'
import { storage } from '../services/storage'


export default function FinanceApplication(){
    const { register, handleSubmit } = useForm()
    const onSubmit = data => {
        storage.push('applications', { id: Date.now(), ...data, status: 'Submitted' })
        alert('Application submitted (mock)')
    }
    return (
        <DashboardLayout>
            <div className="max-w-3xl">
                <h2 className="text-2xl mb-4">Finance Application</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <fieldset className="p-3 border rounded">
                        <legend className="font-semibold">Personal Information</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                            <input {...register('firstName')} placeholder="First name" className="input" />
                            <input {...register('lastName')} placeholder="Last name" className="input" />
                            <input {...register('email')} placeholder="Email" className="input col-span-2" />
                            <input {...register('phone')} placeholder="Phone" className="input" />
                        </div>
                    </fieldset>


                    <fieldset className="p-3 border rounded">
                        <legend className="font-semibold">Employment Details</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                            <input {...register('employer')} placeholder="Employer" className="input" />
                            <input {...register('position')} placeholder="Position" className="input" />
                            <input {...register('monthlyIncome')} placeholder="Monthly Income" className="input" />
                            <input {...register('employmentType')} placeholder="Employment Type" className="input" />
                        </div>
                    </fieldset>


                    <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded">Submit Application</button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}