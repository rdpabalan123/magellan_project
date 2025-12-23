import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useForm } from 'react-hook-form';
import jsPDF from 'jspdf';

const STEPS = [
  'Personal Information',
  'Financial Information',
  'Employment & References',
  'Client Statement & Attachments',
];

const VEHICLES = [
  { name: '162255 - 2026 - RAM - PICKUP - WHITE - 8 6.4L V8', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2026-Ram-2500-Tradesman.jpg' },
  { name: '252801 - 2026 - SUZUKI - SUV - GREEN - 0', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Jimny.jpg' },

  { name: '653057 - 2025 - JEEP - SUV - BRANCO P - 4 1.3L', amount: 42500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Renegade-Latitude.jpg' },
  { name: '664387 - 2025 - JEEP - SUV - WHITE - 4 1.3', amount: 42900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Renegade-Latitude.jpg' },
  { name: '664762 - 2025 - JEEP - SUV - GRANITE - 4 1.3', amount: 42900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Renegade-Latitude.jpg' },

  { name: "565448 - 2025 - JEEP - SUV - '41 DRAB - 4 2.0L L4", amount: 77500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Wrangler-Sport.jpg' },
  { name: "565449 - 2025 - JEEP - SUV - MOJITO G - 4 2.0L L4", amount: 75900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Wrangler-Sport.jpg' },
  { name: "507882 - 2025 - JEEP - SUV - BRIGHT W - 4 2.0L L4", amount: 75900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Wrangler-Sport.jpg' },
  { name: "591753 - 2025 - JEEP - WAGON 4DO - ORANGE - 4 2.0L L4", amount: 75900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Jeep-Wrangler-Sport.jpg' },

  { name: '649761 - 2025 - RAM - PICKUP - WHITE - 6 3.6L V6', amount: 65500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
  { name: '550876 - 2025 - RAM - PICKUP - WHITE - 6 3.6L V6', amount: 68500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
  { name: '555635 - 2025 - RAM - PICKUP - BILLETS - 6 3.6L V6', amount: 64900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
  { name: '555130 - 2025 - RAM - PICKUP - BILLETS - 6 3.6L V6', amount: 64900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
  { name: '649760 - 2025 - RAM - PICKUP - WHITE - 6 3.6L V6', amount: 65500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
  { name: '565269 - 2025 - RAM - PICKUP - WHITE - 6 3.6L V6', amount: 68900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },
  { name: '554771 - 2025 - RAM - PICKUP - SILVER - 6 3.6L V6', amount: 68900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-BigHorn.jpg' },

  { name: '654848 - 2025 - RAM - PICKUP - WHITE - 6 3.6L V6', amount: 63900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-Tradesman.jpg' },
  { name: '654896 - 2025 - RAM - NIGHT EDIT - BRIGHT W - 6 3.6L V6', amount: 69900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-Tradesman.jpg' },
  { name: '654849 - 2025 - RAM - PICKUP - WHITE - 6 3.6L V6', amount: 63900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-1500-Tradesman.jpg' },

  { name: '88033 - 2025 - RAM - PICKUP - SILVER - 3 1.0L', amount: 38900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-700.jpg' },
  { name: '99878 - 2025 - RAM - TRUCK - SILVER - 4 2.0', amount: 58900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Ram-Rampage.jpg' },

  { name: '271285 - 2025 - SUZUKI - TRUCK - WHITE - 0', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Carry.jpg' },
  { name: '271282 - 2025 - SUZUKI - TRUCK - WHITE - 0', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Carry.jpg' },

  { name: '492884 - 2025 - SUZUKI - GRANDEUR - 0 1.5', amount: 33500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Fronx.jpg' },
  { name: '104389 - 2025 - SUZUKI - SUV - SPLENDID - 0 1.5', amount: 38900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Grand-Vitara.jpg' },
  { name: '187453 - 2025 - SUZUKI - SUV - KINETIC - 0', amount: 39500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Jimny.jpg' },

  { name: '337175 - 2025 - SUZUKI - PICK UPTR - WHITE - 3 1.2L', amount: 27500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Super-Carry.jpg' },
  { name: '316532 - 2025 - SUZUKI - TRUCK - WHITE - 0', amount: 27500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Super-Carry.jpg' },
  { name: '337208 - 2025 - SUZUKI - TRUCK - WHITE - 3 1.2L', amount: 27500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Super-Carry.jpg' },
  { name: '337355 - 2025 - SUZUKI - TRUCK - WHITE - 3 1.2L', amount: 27500, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-Super-Carry.jpg' },

  { name: '107641 - 2025 - SUZUKI - SUV - SNOW WHI - 0 1.5', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-XL7.jpg' },
  { name: '107737 - 2025 - SUZUKI - SUV - SNOW WHI - 0', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-XL7.jpg' },
  { name: '107618 - 2025 - SUZUKI - SUV - MAGMA GR - 0', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-XL7.jpg' },
  { name: '108019 - 2025 - SUZUKI - SUV - EYP SAVA - 0', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-XL7.jpg' },
  { name: '107603 - 2025 - SUZUKI - SUV - RISING0 - 0 1.5', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-XL7.jpg' },
  { name: '107630 - 2025 - SUZUKI - SUV - MAGMAGR - 0 1.5', amount: 0, img: 'https://cdn.jdpower.com/Models/640x480/2025-Suzuki-XL7.jpg' },

  { name: '239516 - 2025 - TOYOTA - DOUBLECAB - WHITE - 0 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '240102 - 2025 - TOYOTA - TRUCK DOUB - WHITE - 4 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '855986 - 2025 - TOYOTA - TRUCKSING - WHITE - 0 2.4', amount: 41900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '239960 - 2025 - TOYOTA - DOUBLE CAB - WHITE - 0', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '558431 - 2025 - TOYOTA - TRUCK DOUB - WHITE - 4 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '855988 - 2025 - TOYOTA - TRUCK SING - WHITE - 0 2.4', amount: 41900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '239799 - 2025 - TOYOTA - TRUCK DOUB - WHITE - 4 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '558120 - 2025 - TOYOTA - DOUBLECA - WHITE - 0 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '557914 - 2025 - TOYOTA - DOUBLE CAB - WHITE - 0', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '238864 - 2025 - TOYOTA - TRUCK DOUB - WHITE - 4 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '558262 - 2025 - TOYOTA - TRUCKDOUB - WHITE - 4 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
  { name: '558428 - 2025 - TOYOTA - TRUCK DOUB - WHITE - 4 2.4', amount: 53900, img: 'https://cdn.jdpower.com/Models/640x480/2025-Toyota-Hilux.jpg' },
];

export default function FinanceApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, formState: { errors }, trigger, getValues, setValue, watch, reset } = useForm({
    mode: 'onBlur',
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const pdfRef = useRef();
  const statusTurksIslander = watch('statusTurksIslander');
  const statusNaturalized = watch('statusNaturalized');
  const statusPRC = watch('statusPRC');
  const statusWorkPermit = watch('statusWorkPermit');

  // Watch weekly fields for auto update on monthly fields in Step 2
  const weeklyFieldsMap = [
    ['incomeWork', 'incomeWorkMonthly'],
    ['incomeBusinessWeekly', 'incomeBusinessMonthly'],
    ['incomeRentalWeekly', 'incomeRentalMonthly'],
    ['incomeOtherWeekly', 'incomeOtherMonthly'],
    ['totalIncomeWeekly', 'totalIncomeMonthly'],
    ['expenseMortgageWeekly', 'expenseMortgageMonthly'],
    ['expenseRentWeekly', 'expenseRentMonthly'],
    ['expenseUtilitiesWeekly', 'expenseUtilitiesMonthly'],
    ['expenseOtherLoansWeekly', 'expenseOtherLoansMonthly'],
    ['expenseOtherExpensesWeekly', 'expenseOtherExpensesMonthly'],
    ['totalExpensesWeekly', 'totalExpensesMonthly'],
  ];

  // Use watch to listen for changes in weekly fields
  const watchedFields = watch(weeklyFieldsMap.map(pair => pair[0]));

  useEffect(() => {
    weeklyFieldsMap.forEach(([weekly, monthly], idx) => {
      const weeklyVal = parseFloat(watchedFields[idx]) || 0;
      const monthlyVal = parseFloat(getValues(monthly)) || 0;
      if (monthlyVal !== weeklyVal * 4) {
        setValue(monthly, (weeklyVal * 4).toFixed(2), { shouldValidate: true });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedFields]);

  // Validation fields per step
  const stepFields = [
    [
      'corporate', 'individual', 'inHouseEmployee', 'jointAccount', 'applicationDate', 'agentName', 'clientName',
      'clientOrg', 'homePhone', 'mobileNumber', 'emailAddress', 'addressYears', 'address', 'city', 'country', 'zipCode',
      'occupation', 'gender', 'dob', 'maritalStatus', 'statusTurksIslander', 'statusNaturalized', 'certNumber', 'certDate',
      'statusPRC', 'prcNumber', 'prcDate', 'statusWorkPermit', 'workPermitRef', 'workPermitExpiry', 'statusCardNumber', 'statusCardDate',
      'nibNumber', 'nhipNumber', 'tciDriverLicense', 'driverLicenseExpiry', 'carLoanChoice',
    ],
    [
      'incomeWork', 'incomeWorkMonthly', 'incomeBusinessWeekly', 'incomeBusinessMonthly', 'incomeRentalWeekly', 'incomeRentalMonthly',
      'incomeOtherWeekly', 'incomeOtherMonthly', 'totalIncomeWeekly', 'totalIncomeMonthly',
      'expenseMortgageWeekly', 'expenseMortgageMonthly', 'expenseRentWeekly', 'expenseRentMonthly',
      'expenseUtilitiesWeekly', 'expenseUtilitiesMonthly', 'expenseOtherLoansWeekly', 'expenseOtherLoansMonthly',
      'expenseOtherExpensesWeekly', 'expenseOtherExpensesMonthly', 'totalExpensesWeekly', 'totalExpensesMonthly',
      'bankSavings', 'bankChecking', 'bankCreditCard',
    ],
    [
      'currentEmployer', 'currentPosition', 'currentYears', 'currentSuperior', 'previousEmployer', 'previousPosition',
      'previousYears', 'previousSuperior', 'salary', 'reasonLeaving',
      'refFamilyName1', 'refFamilyOcc1', 'refFamilyComp1', 'refFamilyMobile1',
      'refFamilyName2', 'refFamilyOcc2', 'refFamilyComp2', 'refFamilyMobile2',
      'refFamilyName3', 'refFamilyOcc3', 'refFamilyComp3', 'refFamilyMobile3',
      'refNonFamilyName1', 'refNonFamilyOcc1', 'refNonFamilyComp1', 'refNonFamilyMobile1',
      'refNonFamilyName2', 'refNonFamilyOcc2', 'refNonFamilyComp2', 'refNonFamilyMobile2',
      'refNonFamilyName3', 'refNonFamilyOcc3', 'refNonFamilyComp3', 'refNonFamilyMobile3',
    ],
    [
      'clientStatement', 'clientStatementName', 'clientStatementSignature', 'clientStatementDate',
      // attachments checked are optional
    ],
  ];

  const onSubmit = (data) => {
    alert('Application submitted! Check console for data.');
    console.log('Submitted Data:', data);
    reset();
    setCurrentStep(1);
    setUploadedFile(null);
  };

  const onNext = async () => {
    const valid = await trigger(stepFields[currentStep - 1]);
    if (valid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const onPrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Generate PDF with jsPDF
  const generatePDF = () => {
    const data = getValues();
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Finance Application', 14, 20);
    doc.setFontSize(12);

    doc.text(`Client Name: ${data.clientName || ''}`, 14, 30);
    doc.text(`Agent Name: ${data.agentName || ''}`, 14, 38);
    doc.text(`Application Date: ${data.applicationDate || ''}`, 14, 46);

    doc.text('Selected Vehicle:', 14, 60);
    const vehicle = VEHICLES.find(v => v.name === data.carLoanChoice);
    if (vehicle) {
      doc.text(`${vehicle.name} - $${vehicle.amount.toLocaleString()}`, 14, 68);
    }

    // Add client statement from step 4 if exists
    if(data.clientStatement) {
      doc.text('Client Statement:', 14, 80);
      const splitText = doc.splitTextToSize(data.clientStatement, 180);
      doc.text(splitText, 14, 88);
    }

    doc.save('FinanceApplication.pdf');
  };

  // Handle file upload for signed PDF
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if(file && file.type === "application/pdf"){
      setUploadedFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
        {/* Top logo + details */}
        <div className="flex items-center justify-center border-b-4 border-blue-800 pb-4 mb-6">
          <img src="/images/Car Financing Logo.png" alt="Company Logo" className="w-24 mr-6" />
          <div className="text-center text-black text-sm leading-relaxed max-w-lg">
            <p><strong>Magellan Financial Services, Ltd.</strong></p>
            <p>1063 Leeward Highway, Providenciales</p>
            <p>Turks and Caicos Islands, TKCA1ZZ</p>
            <p>
              Email: <a href="mailto:customerservice@magellanfinancialservices.tc" className="underline text-blue-700">customerservice@magellanfinancialservices.tc</a> | Phone: +1 649 232 6211
            </p>
          </div>
        </div>

        {/* Step Navigation */}
        <nav className="flex justify-between mb-8">
          {STEPS.map((label, i) => {
            const stepNumber = i + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            return (
              <button
                key={label}
                onClick={() => setCurrentStep(stepNumber)}
                className={`flex-1 py-2 border-b-4 font-semibold
                  ${isActive ? 'border-blue-600 text-blue-700' : 'border-gray-300 text-gray-600'}
                  ${isCompleted ? 'opacity-75' : ''}
                  hover:text-blue-500 hover:border-blue-400`}
                type="button"
              >
                {`Step ${stepNumber} - ${label}`}
              </button>
            );
          })}
        </nav>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-black">
          {/* STEP 1: PERSONAL INFORMATION + VEHICLE SELECTION */}
          {currentStep === 1 && (
            <section>
              <h3 className="text-xl font-semibold mb-4">Step 1: Personal Information</h3>

              {/* Vehicle Selection - top */}
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-lg">What car do you want to loan?</label>
                <select
                  {...register('carLoanChoice', { required: true })}
                  className="input"
                  defaultValue=""
                >
                  <option value="" disabled>Select a vehicle</option>
                  {VEHICLES.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} (${v.amount.toLocaleString()})
                    </option>
                  ))}
                </select>
                {errors.carLoanChoice && <p className="text-red-600 text-sm mt-1">Please select a vehicle</p>}
              </div>

              {/* Personal Info Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User Role (auto mapped) */}
              <label className="block">
                <span>Select Client Type</span>
                <select
                  className="mt-1 block w-full rounded border border-gray-300 p-2"
                  {...register('userRole')}
                  defaultValue=""
                >
                  <option value="" disabled>
                  --
                  </option>
                  <option value="corporate">Corporate</option>
                  <option value="individual">Individual</option>
                  <option value="inHouseEmployee">In House Employee</option>
                </select>
              </label>

                <div className="col-span-2">
                  <p className="font-semibold">Is this a Joint Account?</p>
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      value="Yes"
                      {...register('jointAccount', { required: true })}
                      className="mr-1"
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="No"
                      {...register('jointAccount', { required: true })}
                      className="mr-1"
                    />
                    No
                  </label>
                  {errors.jointAccount && (
                    <p className="text-red-600 text-sm">Please select Yes or No</p>
                  )}
                </div>

                <h3 className="col-span-2 text-base font-semibold text-gray-900">
                  Registration Date
                </h3>

                <input
                  type="date"
                  {...register('applicationDate', { required: true })}
                  className="input col-span-2"
                  placeholder="Date"
                />

                {errors.applicationDate && (
                  <p className="col-span-2 text-red-600 text-sm">
                    Date is required
                  </p>
                )}

                <input
                  {...register('agentName', { required: true })}
                  className="input col-span-2"
                  placeholder="Agent/Representative Name"
                />
                {errors.agentName && <p className="text-red-600 text-sm">Agent name is required</p>}

                <input
                  {...register('clientName', { required: true })}
                  className="input col-span-2"
                  placeholder="Client Name"
                />
                {errors.clientName && <p className="text-red-600 text-sm">Client Name is required</p>}

                <input
                  {...register('clientOrg', { required: true })}
                  className="input col-span-2"
                  placeholder="Client Organization/Company Name"
                />
                {errors.clientOrg && <p className="text-red-600 text-sm">Client Organization is required</p>}

                <input
                  {...register('homePhone', { required: true })}
                  className="input"
                  placeholder="Home Phone"
                />
                {errors.homePhone && <p className="text-red-600 text-sm">Home Phone is required</p>}

                <input
                  {...register('mobileNumber', { required: true })}
                  className="input"
                  placeholder="Mobile Number"
                />
                {errors.mobileNumber && <p className="text-red-600 text-sm">Mobile Number is required</p>}

                <input
                  {...register('emailAddress', { required: true })}
                  className="input"
                  type="email"
                  placeholder="Email Address"
                />
                {errors.emailAddress && <p className="text-red-600 text-sm">Email is required</p>}

                <input
                  {...register('address', { required: true })}
                  className="input col-span-2"
                  placeholder="Address"
                />
                {errors.address && <p className="text-red-600 text-sm">Address is required</p>}

                <input
                  {...register('addressYears', { required: true })}
                  className="input col-span-2"
                  placeholder="Number of Years at Address"
                  type="number"
                  min="0"
                />
                {errors.addressYears && <p className="text-red-600 text-sm">Required</p>}

                <input
                  {...register('city', { required: true })}
                  className="input"
                  placeholder="City"
                />
                {errors.city && <p className="text-red-600 text-sm">City is required</p>}

                <input
                  {...register('country', { required: true })}
                  className="input"
                  placeholder="Country"
                />
                {errors.country && <p className="text-red-600 text-sm">Country is required</p>}

                <input
                  {...register('zipCode', { required: true })}
                  className="input"
                  placeholder="ZIP Code"
                />
                {errors.zipCode && <p className="text-red-600 text-sm">ZIP Code is required</p>}

                <input
                  {...register('occupation', { required: true })}
                  className="input"
                  placeholder="Occupation/Business Type"
                />
                {errors.occupation && <p className="text-red-600 text-sm">Occupation is required</p>}

                <div>
                  <p className="font-semibold">Gender</p>
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      value="Male"
                      {...register('gender', { required: true })}
                      className="mr-1"
                    />
                    Male
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="Female"
                      {...register('gender', { required: true })}
                      className="mr-1"
                    />
                    Female
                  </label>
                  {errors.gender && <p className="text-red-600 text-sm">Gender is required</p>}
                </div>

                <label className="block">
                  <span className="block text-sm font-semibold text-gray-800 mb-1">
                    Date Of Birth
                  </span>

                  <input
                    type="date"
                    {...register('dob', { required: true })}
                    className="input"
                  />

                  {errors.dob && (
                    <p className="text-red-600 text-sm mt-1">
                      Date of Birth is required
                    </p>
                  )}
                </label>

                <input
                  {...register('maritalStatus', { required: true })}
                  className="input"
                  placeholder="Marital Status"
                />
                {errors.maritalStatus && <p className="text-red-600 text-sm">Marital Status is required</p>}

                  <div className="col-span-2 mt-6">
                    <p className="font-semibold text-gray-900 mb-3">
                      STATUS in the Islands
                    </p>

                    <div className="flex flex-wrap gap-6">
                      <label className="inline-flex items-center space-x-2">
                        <input type="checkbox" {...register('statusTurksIslander')} />
                        <span>Turks Islander</span>
                      </label>

                      <label className="inline-flex items-center space-x-2">
                        <input type="checkbox" {...register('statusNaturalized')} />
                        <span>Naturalized</span>
                      </label>

                      <label className="inline-flex items-center space-x-2">
                        <input type="checkbox" {...register('statusPRC')} />
                        <span>PRC</span>
                      </label>

                      <label className="inline-flex items-center space-x-2">
                        <input type="checkbox" {...register('statusWorkPermit')} />
                        <span>Work Permit</span>
                      </label>
                    </div>
                  </div>

                  {/* ================= TURKS ISLANDER ================= */}
                  {statusTurksIslander && (
                    <>
                      <div className="col-span-2 mt-4">
                        <h4 className="font-semibold text-gray-700">
                          Turks Islander Details
                        </h4>
                      </div>

                      <input
                        {...register('statusCardNumber')}
                        className="input"
                        placeholder="Status Card Number"
                      />

                      <input
                        type="date"
                        {...register('statusCardDate')}
                        className="input"
                        placeholder="Date Issued"
                      />
                    </>
                  )}

                  {/* ================= NATURALIZED ================= */}
                  {statusNaturalized && (
                    <>
                      <div className="col-span-2 mt-4">
                        <h4 className="font-semibold text-gray-700">
                          Naturalization Details
                        </h4>
                      </div>

                      <input
                        {...register('certNumber')}
                        className="input"
                        placeholder="Certificate Number"
                      />

                      <input
                        type="date"
                        {...register('certDate')}
                        className="input"
                        placeholder="Certificate Date"
                      />
                    </>
                  )}

                  {/* ================= PRC ================= */}
                  {statusPRC && (
                    <>
                      <div className="col-span-2 mt-4">
                        <h4 className="font-semibold text-gray-700">
                          PRC Details
                        </h4>
                      </div>

                      <input
                        {...register('prcNumber')}
                        className="input"
                        placeholder="PRC Number"
                      />

                      <input
                        type="date"
                        {...register('prcDate')}
                        className="input"
                        placeholder="PRC Date"
                      />
                    </>
                  )}

                  {/* ================= WORK PERMIT ================= */}
                  {statusWorkPermit && (
                    <>
                      <div className="col-span-2 mt-4">
                        <h4 className="font-semibold text-gray-700">
                          Work Permit Details
                        </h4>
                      </div>

                      <input
                        {...register('workPermitRef')}
                        className="input"
                        placeholder="Work Permit Reference"
                      />

                      <input
                        type="date"
                        {...register('workPermitExpiry')}
                        className="input"
                        placeholder="Work Permit Expiry"
                      />
                    </>
                  )}

                <input
                  {...register('nibNumber', { required: false })}
                  className="input"
                  placeholder="NIB Number (if applicable)"
                />
                <input
                  {...register('nhipNumber', { required: false })}
                  className="input"
                  placeholder="NHIP Number (if applicable)"
                />

                <input
                  {...register('tciDriverLicense', { required: false })}
                  className="input"
                  placeholder="TCI Driver's License Number (if applicable)"
                />
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-800 mb-1">
                  Driver’s License Expiry Date
                </label>

                <input
                  type="date"
                  {...register('driverLicenseExpiry')}
                  className="input"
                />
              </div>
            </div>
          </section>
         )}

          {/* STEP 2: FINANCIAL INFORMATION */}
          {currentStep === 2 && (
            <section>
              <h3 className="text-xl font-semibold mb-4">Step 2: Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <h4 className="col-span-2 font-semibold text-lg">Income Sources (Weekly & Monthly)</h4>

                <input
                  {...register('incomeWork', { required: true })}
                  type="number"
                  placeholder="Work Income Weekly"
                  className="input"
                />
                <input
                  {...register('incomeWorkMonthly', { required: true })}
                  type="number"
                  placeholder="Work Income Monthly"
                  className="input"
                  readOnly
                />

                <input
                  {...register('incomeBusinessWeekly', { required: true })}
                  type="number"
                  placeholder="Business Income Weekly"
                  className="input"
                />
                <input
                  {...register('incomeBusinessMonthly', { required: true })}
                  type="number"
                  placeholder="Business Income Monthly"
                  className="input"
                  readOnly
                />

                <input
                  {...register('incomeRentalWeekly', { required: true })}
                  type="number"
                  placeholder="Rental Income Weekly"
                  className="input"
                />
                <input
                  {...register('incomeRentalMonthly', { required: true })}
                  type="number"
                  placeholder="Rental Income Monthly"
                  className="input"
                  readOnly
                />

                <input
                  {...register('incomeOtherWeekly', { required: true })}
                  type="number"
                  placeholder="Other Income Weekly"
                  className="input"
                />
                <input
                  {...register('incomeOtherMonthly', { required: true })}
                  type="number"
                  placeholder="Other Income Monthly"
                  className="input"
                  readOnly
                />

                <input
                  {...register('totalIncomeWeekly', { required: true })}
                  type="number"
                  placeholder="Total Income Weekly"
                  className="input font-semibold"
                />
                <input
                  {...register('totalIncomeMonthly', { required: true })}
                  type="number"
                  placeholder="Total Income Monthly"
                  className="input font-semibold"
                  readOnly
                />

                <h4 className="col-span-2 font-semibold text-lg mt-6">Expenses (Weekly & Monthly)</h4>

                <input
                  {...register('expenseMortgageWeekly', { required: true })}
                  type="number"
                  placeholder="Mortgage Weekly"
                  className="input"
                />
                <input
                  {...register('expenseMortgageMonthly', { required: true })}
                  type="number"
                  placeholder="Mortgage Monthly"
                  className="input"
                  readOnly
                />

                <input
                  {...register('expenseRentWeekly', { required: true })}
                  type="number"
                  placeholder="Rent Weekly"
                  className="input"
                />
                <input
                  {...register('expenseRentMonthly', { required: true })}
                  type="number"
                  placeholder="Rent Monthly"
                  className="input"
                  readOnly
                />

                <input
                  {...register('expenseUtilitiesWeekly', { required: true })}
                  type="number"
                  placeholder="Utilities Weekly"
                  className="input"
                />
                <input
                  {...register('expenseUtilitiesMonthly', { required: true })}
                  type="number"
                  placeholder="Utilities Monthly"
                  className="input"
                  readOnly
                />

                <input
                  {...register('expenseOtherLoansWeekly', { required: true })}
                  type="number"
                  placeholder="Other Loans Weekly"
                  className="input"
                />
                <input
                  {...register('expenseOtherLoansMonthly', { required: true })}
                  type="number"
                  placeholder="Other Loans Monthly"
                  className="input"
                  readOnly
                />

                <input
                  {...register('expenseOtherExpensesWeekly', { required: true })}
                  type="number"
                  placeholder="Other Expenses Weekly"
                  className="input"
                />
                <input
                  {...register('expenseOtherExpensesMonthly', { required: true })}
                  type="number"
                  placeholder="Other Expenses Monthly"
                  className="input"
                  readOnly
                />

                <input
                  {...register('totalExpensesWeekly', { required: true })}
                  type="number"
                  placeholder="Total Expenses Weekly"
                  className="input font-semibold"
                />
                <input
                  {...register('totalExpensesMonthly', { required: true })}
                  type="number"
                  placeholder="Total Expenses Monthly"
                  className="input font-semibold"
                  readOnly
                />
              </div>

              <h4 className="col-span-2 font-semibold text-lg mt-6">Bank Information</h4>

              <input
                {...register('bankSavings', { required: true })}
                placeholder="Savings Account"
                className="input col-span-2"
              />
              <input
                {...register('bankChecking', { required: true })}
                placeholder="Checking Account"
                className="input col-span-2"
              />
              <input
                {...register('bankCreditCard', { required: true })}
                placeholder="Credit Card"
                className="input col-span-2"
              />

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={onPrevious}
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next Step
                </button>
              </div>
            </section>
          )}

          {/* STEP 3: EMPLOYMENT HISTORY & REFERENCES */}
          {currentStep === 3 && (
            <section>
              <h3 className="text-xl font-semibold mb-4">Step 3: Employment History & References</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <h4 className="col-span-2 font-semibold text-lg">Current Employment</h4>
                <input
                  {...register('currentEmployer', { required: true })}
                  placeholder="Current Employer"
                  className="input col-span-2"
                />
                <input
                  {...register('currentPosition', { required: true })}
                  placeholder="Position | Designation"
                  className="input"
                />
                <input
                  {...register('currentYears', { required: true })}
                  type="number"
                  min="0"
                  placeholder="Years of Service"
                  className="input"
                />
                <input
                  {...register('currentSuperior', { required: true })}
                  placeholder="Name of Immediate Superior"
                  className="input"
                />

                <h4 className="col-span-2 font-semibold text-lg mt-6">Previous Employment</h4>
                <input
                  {...register('previousEmployer', { required: true })}
                  placeholder="Previous Employer"
                  className="input col-span-2"
                />
                <input
                  {...register('previousPosition', { required: true })}
                  placeholder="Position | Designation"
                  className="input"
                />
                <input
                  {...register('previousYears', { required: true })}
                  type="number"
                  min="0"
                  placeholder="Years of Service"
                  className="input"
                />
                <input
                  {...register('previousSuperior', { required: true })}
                  placeholder="Name of Immediate Superior"
                  className="input"
                />

                <input
                  {...register('salary', { required: true })}
                  type="number"
                  placeholder="Salary"
                  className="input col-span-2"
                />
                <input
                  {...register('reasonLeaving', { required: true })}
                  placeholder="Reason for Leaving"
                  className="input col-span-2"
                />

                <h4 className="col-span-2 font-semibold text-lg mt-6">References (Family & Relatives)</h4>
                {[1, 2, 3].map((num) => (
                  <React.Fragment key={`fam-${num}`}>
                    <input
                      {...register(`refFamilyName${num}`, { required: true })}
                      placeholder="Name"
                      className="input"
                    />
                    <input
                      {...register(`refFamilyOcc${num}`, { required: true })}
                      placeholder="Occupation"
                      className="input"
                    />
                    <input
                      {...register(`refFamilyComp${num}`, { required: true })}
                      placeholder="Company"
                      className="input"
                    />
                    <input
                      {...register(`refFamilyMobile${num}`, { required: true })}
                      placeholder="Mobile Number"
                      className="input"
                    />
                  </React.Fragment>
                ))}

                <h4 className="col-span-2 font-semibold text-lg mt-6">References (Non-Relatives)</h4>
                {[1, 2, 3].map((num) => (
                  <React.Fragment key={`nonfam-${num}`}>
                    <input
                      {...register(`refNonFamilyName${num}`, { required: true })}
                      placeholder="Name"
                      className="input"
                    />
                    <input
                      {...register(`refNonFamilyOcc${num}`, { required: true })}
                      placeholder="Occupation"
                      className="input"
                    />
                    <input
                      {...register(`refNonFamilyComp${num}`, { required: true })}
                      placeholder="Company"
                      className="input"
                    />
                    <input
                      {...register(`refNonFamilyMobile${num}`, { required: true })}
                      placeholder="Mobile Number"
                      className="input"
                    />
                  </React.Fragment>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={onPrevious}
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next Step
                </button>
              </div>
            </section>
          )}

          {/* STEP 4: CLIENT STATEMENT & ATTACHMENTS */}
          {currentStep === 4 && (
            <section ref={pdfRef}>
              <h3 className="text-xl font-semibold mb-4">Step 4: Client Statement & Attachments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea
                  {...register('clientStatement', { required: true })}
                  placeholder="I hereby certify that all the above information is correct, and I authorize Magellan Financial Services Ltd. to secure any and all information from any source to determine my credit worthiness."
                  className="input col-span-2 h-28 resize-none"
                />
                {errors.clientStatement && (
                  <p className="text-red-600 text-sm col-span-2">Client statement is required</p>
                )}

                <input
                  {...register('clientStatementName', { required: true })}
                  placeholder="Client's Name"
                  className="input"
                />
                {errors.clientStatementName && (
                  <p className="text-red-600 text-sm">Client's name is required</p>
                )}

                <input
                  {...register('clientStatementSignature', { required: true })}
                  placeholder="Client's Signature"
                  className="input"
                />
                {errors.clientStatementSignature && (
                  <p className="text-red-600 text-sm">Client's signature is required</p>
                )}

                <input
                  type="date"
                  {...register('clientStatementDate', { required: true })}
                  className="input"
                  placeholder="Date (Day/Mo./Year)"
                />
                {errors.clientStatementDate && (
                  <p className="text-red-600 text-sm">Date is required</p>
                )}

                {/* Attach documents checklist */}
                <fieldset className="col-span-2 border rounded p-4 mt-4">
                  <legend className="font-semibold">Please attach the following documents:</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" {...register('attachDriverLicense')} />
                      <span>Valid Driver's License / Valid Passport COPY</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" {...register('attachUtilityBill')} />
                      <span>Most recent Pelican Energy or Provo Water or Internet/Cable Bill</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" {...register('attachInsuranceCard')} />
                      <span>National Insurance Card</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" {...register('attachProofStatus')} />
                      <span>Proof of Status in TCI</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" {...register('attachJobLetter')} />
                      <span>Job Letter</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" {...register('attachBankLetter')} />
                      <span>Bank Letter</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" {...register('attachPaySlip')} />
                      <span>Most recent pay slip</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" {...register('attachSecondaryIncome')} />
                      <span>Secondary Income Document (if applicable)</span>
                    </label>
                  </div>
                </fieldset>

                {/* Upload signed PDF */}
                <div className="col-span-2 mt-4">
                  <label className="block font-semibold mb-2">Upload Signed PDF:</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="input"
                  />
                  {uploadedFile && (
                    <p className="mt-2 text-green-700 font-semibold">Uploaded file: {uploadedFile.name}</p>
                  )}
                </div>

                {/* Export PDF button */}
                <div className="col-span-2 mt-6 flex space-x-4 justify-end">
                  <button
                    type="button"
                    onClick={generatePDF}
                    className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Export PDF
                  </button>
                  <button
                    type="button"
                    onClick={onPrevious}
                    className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    disabled={!uploadedFile}
                    title={uploadedFile ? '' : 'Please upload signed PDF before submitting'}
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            </section>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}
