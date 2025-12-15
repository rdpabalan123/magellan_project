import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  // State declarations
  const [userRole, setUserRole] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [civilStatus, setCivilStatus] = useState('');
  const [civilStatusOther, setCivilStatusOther] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employerDetails, setEmployerDetails] = useState('');
  const [employerAddress, setEmployerAddress] = useState('');
  const [driverLicenseFile, setDriverLicenseFile] = useState(null);

  // Password fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status in the Islands
  const [statusTurks, setStatusTurks] = useState(false);
  const [statusCardNo, setStatusCardNo] = useState('');
  const [statusCardDate, setStatusCardDate] = useState('');

  const [statusNaturalized, setStatusNaturalized] = useState(false);
  const [certificateNo, setCertificateNo] = useState('');
  const [certificateDate, setCertificateDate] = useState('');

  const [statusPRC, setStatusPRC] = useState(false);
  const [prcNo, setPrcNo] = useState('');
  const [prcDate, setPrcDate] = useState('');

  const [statusWorkPermit, setStatusWorkPermit] = useState(false);
  const [workPermitRefNo, setWorkPermitRefNo] = useState('');
  const [workPermitExpiry, setWorkPermitExpiry] = useState('');

  // Additional IDs
  const [nibNo, setNibNo] = useState('');
  const [nhipNo, setNhipNo] = useState('');
  const [tciLicenseNo, setTciLicenseNo] = useState('');
  const [driverLicenseExpiry, setDriverLicenseExpiry] = useState('');

  // For error messages
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = e => {
    e.preventDefault();

    setErrorMessage(''); // Clear previous errors

    // Validate top to bottom
    if (!userRole) {
      setErrorMessage('Please select user role');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (!birthday) {
      setErrorMessage('Please enter your birthday');
      return;
    }

    if (!gender) {
      setErrorMessage('Please select your gender');
      return;
    }

    if (!civilStatus) {
      setErrorMessage('Please select your civil status');
      return;
    }

    if (civilStatus === 'others' && !civilStatusOther.trim()) {
      setErrorMessage('Please specify your civil status');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Please enter your phone number');
      return;
    }

    if (!employerDetails.trim()) {
      setErrorMessage('Please enter employer details');
      return;
    }

    if (!employerAddress.trim()) {
      setErrorMessage('Please enter employer address');
      return;
    }

    if (!driverLicenseFile) {
      setErrorMessage('Please attach your driver license picture');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    // Status check: at least one checked
    if (!(statusTurks || statusNaturalized || statusPRC || statusWorkPermit)) {
      setErrorMessage('Please check at least one Status in the Islands');
      return;
    }

    if (statusTurks) {
      if (!statusCardNo.trim()) {
        setErrorMessage('Please enter Status Card #');
        return;
      }
      if (!statusCardDate) {
        setErrorMessage('Please enter Date Issued for Status Card');
        return;
      }
    }

    if (statusNaturalized) {
      if (!certificateNo.trim()) {
        setErrorMessage('Please enter Certificate #');
        return;
      }
      if (!certificateDate) {
        setErrorMessage('Please enter Date Issued for Certificate');
        return;
      }
    }

    if (statusPRC) {
      if (!prcNo.trim()) {
        setErrorMessage('Please enter PRC #');
        return;
      }
      if (!prcDate) {
        setErrorMessage('Please enter Date Issued for PRC');
        return;
      }
    }

    if (statusWorkPermit) {
      if (!workPermitRefNo.trim()) {
        setErrorMessage('Please enter Work Permit Ref #');
        return;
      }
      if (!workPermitExpiry) {
        setErrorMessage('Please enter Expiration Date for Work Permit');
        return;
      }
    }

    if (!nibNo.trim()) {
      setErrorMessage('Please enter NIB #');
      return;
    }

    if (!nhipNo.trim()) {
      setErrorMessage('Please enter NHIP #');
      return;
    }

    if (!tciLicenseNo.trim()) {
      setErrorMessage("Please enter TCI Driver's License #");
      return;
    }

    if (!driverLicenseExpiry) {
      setErrorMessage("Please enter Driver's License Expiry Date");
      return;
    }

    // Retrieve existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    if (users.find(u => u.email === email.trim())) {
      setErrorMessage('Email already registered');
      return;
    }

    // Clear errors on successful submit
    setErrorMessage('');

    const newUser = {
      role: 'client',  // <-- added this line

      userRole,
      fullName: fullName.trim(),
      birthday,
      gender,
      civilStatus: civilStatus === 'others' ? civilStatusOther.trim() : civilStatus,
      email: email.trim(),
      phone: phone.trim(),
      employerDetails: employerDetails.trim(),
      employerAddress: employerAddress.trim(),
      driverLicenseFileName: driverLicenseFile.name,
      statusTurks,
      statusCardNo: statusTurks ? statusCardNo.trim() : '',
      statusCardDate: statusTurks ? statusCardDate : '',
      statusNaturalized,
      certificateNo: statusNaturalized ? certificateNo.trim() : '',
      certificateDate: statusNaturalized ? certificateDate : '',
      statusPRC,
      prcNo: statusPRC ? prcNo.trim() : '',
      prcDate: statusPRC ? prcDate : '',
      statusWorkPermit,
      workPermitRefNo: statusWorkPermit ? workPermitRefNo.trim() : '',
      workPermitExpiry: statusWorkPermit ? workPermitExpiry : '',
      nibNo: nibNo.trim(),
      nhipNo: nhipNo.trim(),
      tciLicenseNo: tciLicenseNo.trim(),
      driverLicenseExpiry,
      password: password.trim(),  // save password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Redirect to login with success message
    navigate('/login', { state: { successMessage: 'Registration successful! Please login.' } });
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      {/* Header with logo + address */}
      <div className="flex items-center border-b-4 border-blue-800 pb-4 mb-6 bg-white">
        <div className="bg-white p-2 rounded">
          <img
            src="/images/Car Financing Logo.png"
            alt="Company Logo"
            className="w-24 mr-6"
          />
        </div>
        <div className="flex-grow text-center text-sm text-blue-900 leading-tight">
          <p><strong>Magellan Financial Services, Ltd.</strong></p>
          <p>1063 Leeward Highway, Providenciales</p>
          <p>Turks and Caicos Islands, TKCA1ZZ</p>
          <p>
            Email: <a href="mailto:customerservice@magellanfinancialservices.tc" className="underline">customerservice@magellanfinancialservices.tc</a> | Phone: +1 649 232 6211
          </p>
        </div>
      </div>

      <h2 className="text-center text-2xl font-semibold text-blue-900 mb-8">REGISTRATION FORM</h2>

      <form onSubmit={submit} className="space-y-5" noValidate>
        {/* Inline error message */}
        {errorMessage && (
          <div className="mb-4 text-red-600 font-semibold">{errorMessage}</div>
        )}

        {/* User Role */}
        <label className="block font-semibold text-black">User Role *</label>
        <select
          className="input input-bordered w-full"
          value={userRole}
          onChange={e => setUserRole(e.target.value)}
          required
        >
          <option value="" disabled>Select Role</option>
          <option value="corporate">Corporate</option>
          <option value="individual">Individual</option>
          <option value="inhouse">In house Employee</option>
        </select>

        {/* Full Name */}
        <label className="block font-semibold text-black">Full Name *</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />

        {/* Birthday */}
        <label className="block font-semibold text-black">Birthday *</label>
        <input
          type="date"
          className="input input-bordered w-full"
          value={birthday}
          onChange={e => setBirthday(e.target.value)}
          required
        />

        {/* Gender */}
        <label className="block font-semibold text-black">Gender *</label>
        <select
          className="input input-bordered w-full"
          value={gender}
          onChange={e => setGender(e.target.value)}
          required
        >
          <option value="" disabled>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* Civil Status */}
        <label className="block font-semibold text-black">Civil Status *</label>
        <select
          className="input input-bordered w-full"
          value={civilStatus}
          onChange={e => setCivilStatus(e.target.value)}
          required
        >
          <option value="" disabled>Select Civil Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="widowed">Widowed</option>
          <option value="others">Others (please specify)</option>
        </select>
        {civilStatus === 'others' && (
          <input
            type="text"
            className="input input-bordered w-full mt-2"
            placeholder="Please specify"
            value={civilStatusOther}
            onChange={e => setCivilStatusOther(e.target.value)}
            required
          />
        )}

        {/* Email */}
        <label className="block font-semibold text-black">Email *</label>
        <input
          type="email"
          className="input input-bordered w-full"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <label className="block font-semibold text-black mt-4">Password *</label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {/* Confirm Password */}
        <label className="block font-semibold text-black mt-4">Confirm Password *</label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />

        {/* Phone Number */}
        <label className="block font-semibold text-black">Phone Number *</label>
        <input
          type="tel"
          className="input input-bordered w-full"
          pattern="[0-9+()-\s]*"
          placeholder="+1 649 000 0000"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />

        {/* Employer Details */}
        <label className="block font-semibold text-black">Employer Details *</label>
        <textarea
          className="textarea textarea-bordered w-full text-black"
          rows={2}
          value={employerDetails}
          onChange={e => setEmployerDetails(e.target.value)}
          placeholder="Employer's name or details"
          required
        ></textarea>

        {/* Employer Address */}
        <label className="block font-semibold text-black">Employer Address *</label>
        <textarea
          className="textarea textarea-bordered w-full text-black"
          rows={2}
          value={employerAddress}
          onChange={e => setEmployerAddress(e.target.value)}
          placeholder="Employer's address"
          required
        ></textarea>

        {/* Driver License */}
        <label className="block font-semibold text-black">Driver License (Attach Picture) *</label>
        <input
          type="file"
          className="file-input file-input-bordered w-full text-black"
          accept="image/*"
          onChange={e => setDriverLicenseFile(e.target.files[0])}
          required
        />

        {/* Status in the Islands */}
        <fieldset className="border p-4 rounded-md mt-6">
          <legend className="font-semibold text-black">Status in the Islands *</legend>
          <p className="mb-2 text-sm italic text-gray-600">Please check the following if applicable.</p>

          {/* Turks Islander */}
          <div className="flex items-center mt-3">
            <input
              id="statusTurks"
              type="checkbox"
              checked={statusTurks}
              onChange={e => setStatusTurks(e.target.checked)}
              className="checkbox"
              required={!statusNaturalized && !statusPRC && !statusWorkPermit}
            />
            <label htmlFor="statusTurks" className="ml-2 text-black">Turks Islander</label>
          </div>
          {statusTurks && (
            <div className="ml-6 mt-2 space-y-2">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Status Card #"
                value={statusCardNo}
                onChange={e => setStatusCardNo(e.target.value)}
                required={statusTurks}
              />
              <input
                type="date"
                className="input input-bordered w-full"
                value={statusCardDate}
                onChange={e => setStatusCardDate(e.target.value)}
                required={statusTurks}
              />
            </div>
          )}

          {/* Naturalized */}
          <div className="flex items-center mt-3">
            <input
              id="statusNaturalized"
              type="checkbox"
              checked={statusNaturalized}
              onChange={e => setStatusNaturalized(e.target.checked)}
              className="checkbox"
              required={!statusTurks && !statusPRC && !statusWorkPermit}
            />
            <label htmlFor="statusNaturalized" className="ml-2 text-black">Naturalized</label>
          </div>
          {statusNaturalized && (
            <div className="ml-6 mt-2 space-y-2">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Certificate #"
                value={certificateNo}
                onChange={e => setCertificateNo(e.target.value)}
                required={statusNaturalized}
              />
              <input
                type="date"
                className="input input-bordered w-full"
                value={certificateDate}
                onChange={e => setCertificateDate(e.target.value)}
                required={statusNaturalized}
              />
            </div>
          )}

          {/* PRC */}
          <div className="flex items-center mt-3">
            <input
              id="statusPRC"
              type="checkbox"
              checked={statusPRC}
              onChange={e => setStatusPRC(e.target.checked)}
              className="checkbox"
              required={!statusTurks && !statusNaturalized && !statusWorkPermit}
            />
            <label htmlFor="statusPRC" className="ml-2 text-black">PRC</label>
          </div>
          {statusPRC && (
            <div className="ml-6 mt-2 space-y-2">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="PRC #"
                value={prcNo}
                onChange={e => setPrcNo(e.target.value)}
                required={statusPRC}
              />
              <input
                type="date"
                className="input input-bordered w-full"
                value={prcDate}
                onChange={e => setPrcDate(e.target.value)}
                required={statusPRC}
              />
            </div>
          )}

          {/* Work Permit */}
          <div className="flex items-center mt-3">
            <input
              id="statusWorkPermit"
              type="checkbox"
              checked={statusWorkPermit}
              onChange={e => setStatusWorkPermit(e.target.checked)}
              className="checkbox"
              required={!statusTurks && !statusNaturalized && !statusPRC}
            />
            <label htmlFor="statusWorkPermit" className="ml-2 text-black">Work Permit</label>
          </div>
          {statusWorkPermit && (
            <div className="ml-6 mt-2 space-y-2">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Work Permit Ref #"
                value={workPermitRefNo}
                onChange={e => setWorkPermitRefNo(e.target.value)}
                required={statusWorkPermit}
              />
              <input
                type="date"
                className="input input-bordered w-full"
                value={workPermitExpiry}
                onChange={e => setWorkPermitExpiry(e.target.value)}
                required={statusWorkPermit}
              />
            </div>
          )}
        </fieldset>

        {/* Other IDs */}
        <label className="block font-semibold text-black mt-6">NIB # *</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={nibNo}
          onChange={e => setNibNo(e.target.value)}
          required
        />

        <label className="block font-semibold text-black">NHIP # *</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={nhipNo}
          onChange={e => setNhipNo(e.target.value)}
          required
        />

        <label className="block font-semibold text-black">TCI Driver's License # *</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={tciLicenseNo}
          onChange={e => setTciLicenseNo(e.target.value)}
          required
        />

        <label className="block font-semibold text-black">Driver's License Expiry Date *</label>
        <input
          type="date"
          className="input input-bordered w-full"
          value={driverLicenseExpiry}
          onChange={e => setDriverLicenseExpiry(e.target.value)}
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary mt-6 w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}
