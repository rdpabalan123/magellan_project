import React, { useState, useEffect } from 'react';

const emptyUser = {
  userRole: '',
  fullName: '',
  birthday: '',
  gender: '',
  civilStatus: '',
  civilStatusOther: '',
  email: '',
  phone: '',
  employerDetails: '',
  employerAddress: '',
  driverLicenseFileName: '',
  password: '',
  confirmPassword: '',
  statusTurks: false,
  statusCardNo: '',
  statusCardDate: '',
  statusNaturalized: false,
  certificateNo: '',
  certificateDate: '',
  statusPRC: false,
  prcNo: '',
  prcDate: '',
  statusWorkPermit: false,
  workPermitRefNo: '',
  workPermitExpiry: '',
  nibNo: '',
  nhipNo: '',
  tciLicenseNo: '',
  driverLicenseExpiry: '',
  active: true,
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px 16px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: '600',
};

export default function UserDatabase() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyUser);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [driverLicenseFile, setDriverLicenseFile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load users from localStorage on mount
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);
  }, []);

  // Save users to localStorage on change
  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      if (files.length > 0) {
        setDriverLicenseFile(files[0]);
        setForm((prev) => ({ ...prev, driverLicenseFileName: files[0].name }));
      } else {
        setDriverLicenseFile(null);
        setForm((prev) => ({ ...prev, driverLicenseFileName: '' }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate form same as Register
  const validateForm = () => {
    const {
      userRole,
      fullName,
      birthday,
      gender,
      civilStatus,
      civilStatusOther,
      email,
      phone,
      employerDetails,
      employerAddress,
      driverLicenseFileName,
      password,
      confirmPassword,
      statusTurks,
      statusCardNo,
      statusCardDate,
      statusNaturalized,
      certificateNo,
      certificateDate,
      statusPRC,
      prcNo,
      prcDate,
      statusWorkPermit,
      workPermitRefNo,
      workPermitExpiry,
      nibNo,
      nhipNo,
      tciLicenseNo,
      driverLicenseExpiry,
    } = form;

    if (!userRole) return 'Please select user role';
    if (!fullName.trim()) return 'Please enter your full name';
    if (!birthday) return 'Please enter your birthday';
    if (!gender) return 'Please select your gender';
    if (!civilStatus) return 'Please select your civil status';
    if (civilStatus === 'others' && !civilStatusOther.trim()) return 'Please specify your civil status';
    if (!email.trim()) return 'Please enter your email';
    if (!phone.trim()) return 'Please enter your phone number';
    if (!employerDetails.trim()) return 'Please enter employer details';
    if (!employerAddress.trim()) return 'Please enter employer address';
    if (!driverLicenseFileName) return 'Please attach your driver license picture';
    if (!password.trim()) return 'Please enter your password';
    if (password !== confirmPassword) return 'Passwords do not match';

    if (!(statusTurks || statusNaturalized || statusPRC || statusWorkPermit)) return 'Please check at least one Status in the Islands';

    if (statusTurks) {
      if (!statusCardNo.trim()) return 'Please enter Status Card #';
      if (!statusCardDate) return 'Please enter Date Issued for Status Card';
    }
    if (statusNaturalized) {
      if (!certificateNo.trim()) return 'Please enter Certificate #';
      if (!certificateDate) return 'Please enter Date Issued for Certificate';
    }
    if (statusPRC) {
      if (!prcNo.trim()) return 'Please enter PRC #';
      if (!prcDate) return 'Please enter Date Issued for PRC';
    }
    if (statusWorkPermit) {
      if (!workPermitRefNo.trim()) return 'Please enter Work Permit Ref #';
      if (!workPermitExpiry) return 'Please enter Expiration Date for Work Permit';
    }

    if (!nibNo.trim()) return 'Please enter NIB #';
    if (!nhipNo.trim()) return 'Please enter NHIP #';
    if (!tciLicenseNo.trim()) return "Please enter TCI Driver's License #";
    if (!driverLicenseExpiry) return "Please enter Driver's License Expiry Date";

    // Check for unique email on add (ignore on edit for same user)
    const emailExists = users.some((u, i) => u.email === email.trim() && i !== editIndex);
    if (emailExists) return 'Email already registered';

    return '';
  };

  // Handle submit for add/edit
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const userToSave = {
      ...form,
      civilStatus: form.civilStatus === 'others' ? form.civilStatusOther.trim() : form.civilStatus,
      role: 'client',
      password: form.password.trim(),
      active: form.active ?? true,
    };

    let newUsers;
    if (isEditing) {
      newUsers = users.map((u, i) => (i === editIndex ? userToSave : u));
    } else {
      newUsers = [...users, userToSave];
    }

    saveUsers(newUsers);
    setForm(emptyUser);
    setDriverLicenseFile(null);
    setIsEditing(false);
    setEditIndex(null);
    setErrorMessage('');
    setShowForm(false);
  };

  // Handle edit user
  const handleEdit = (index) => {
    const user = users[index];
    setForm({
      ...user,
      civilStatusOther: user.civilStatus && !['single', 'married', 'widowed'].includes(user.civilStatus)
        ? user.civilStatus
        : '',
      confirmPassword: user.password,
    });
    setIsEditing(true);
    setEditIndex(index);
    setDriverLicenseFile(null);
    setErrorMessage('');
    setShowForm(true);
  };

  // Handle delete user
  const handleDelete = (index) => {
    if (window.confirm('Delete this user?')) {
      const filtered = users.filter((_, i) => i !== index);
      saveUsers(filtered);
      if (isEditing && editIndex === index) {
        setForm(emptyUser);
        setIsEditing(false);
        setEditIndex(null);
        setErrorMessage('');
        setShowForm(false);
      }
    }
  };

  // Toggle active/inactive user
  const toggleActiveStatus = (index) => {
    const updatedUsers = users.map((u, i) =>
      i === index ? { ...u, active: !u.active } : u
    );
    saveUsers(updatedUsers);
  };

  // Close modal form
  const closeForm = () => {
    setShowForm(false);
    setForm(emptyUser);
    setErrorMessage('');
    setIsEditing(false);
    setEditIndex(null);
    setDriverLicenseFile(null);
  };

  return (
    <div
      className="max-w-6xl mx-auto mt-8 p-8 bg-white shadow-md rounded-md"
      style={{ fontFamily: 'Arial, sans-serif', color: '#222' }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '2rem',
          color: '#222',
        }}
      >
        User Management
      </h2>

      <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
        <button
          style={buttonStyle}
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setForm(emptyUser);
            setErrorMessage('');
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
        >
          + Add User
        </button>
      </div>

      {users.length === 0 ? (
        <p style={{ color: '#666' }}>No users found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              overflow: 'hidden',
              fontSize: '14px',
              color: '#222',
            }}
          >
            <thead style={{ backgroundColor: '#007bff', color: 'white', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '12px', whiteSpace: 'nowrap' }}>Full Name</th>
                <th style={{ padding: '12px', whiteSpace: 'nowrap' }}>Email</th>
                <th style={{ padding: '12px', whiteSpace: 'nowrap' }}>Role</th>
                <th style={{ padding: '12px', whiteSpace: 'nowrap' }}>User Role</th>
                <th style={{ padding: '12px', whiteSpace: 'nowrap' }}>Phone</th>
                <th style={{ padding: '12px', whiteSpace: 'nowrap', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px', whiteSpace: 'nowrap', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid #ddd',
                    backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white',
                    color: u.active ? '#222' : '#888',
                    fontStyle: u.active ? 'normal' : 'italic',
                  }}
                >
                  <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{u.fullName}</td>
                  <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{u.email}</td>
                  <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{u.role}</td>
                  <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{u.userRole}</td>
                  <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{u.phone}</td>
                  <td
                    style={{
                      padding: '10px',
                      textAlign: 'center',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {u.active ? (
                      <span style={{ color: '#28a745' }}>Active</span>
                    ) : (
                      <span style={{ color: '#dc3545' }}>Inactive</span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      display: 'flex',
                      gap: '8px',
                      justifyContent: 'center',
                      flexWrap: 'nowrap',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <button
                      onClick={() => handleEdit(i)}
                      style={{
                        backgroundColor: '#ffc107',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: '#000',
                        whiteSpace: 'nowrap',
                      }}
                      title="Edit User"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      style={{
                        backgroundColor: '#dc3545',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: '#fff',
                        whiteSpace: 'nowrap',
                      }}
                      title="Delete User"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => toggleActiveStatus(i)}
                      style={{
                        backgroundColor: u.active ? '#6c757d' : '#28a745',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: '#fff',
                        whiteSpace: 'nowrap',
                      }}
                      title={u.active ? 'Mark as Inactive' : 'Mark as Active'}
                    >
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
          onClick={closeForm}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 0 20px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ marginBottom: '1rem', fontWeight: '700', fontSize: '1.5rem' }}>
              {isEditing ? 'Edit User' : 'Add User'}
            </h3>

            {errorMessage && (
              <div
                style={{
                  marginBottom: '1rem',
                  color: '#dc3545',
                  fontWeight: '600',
                  backgroundColor: '#f8d7da',
                  padding: '10px',
                  borderRadius: '5px',
                }}
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* User Role */}
              <label>User Role *</label>
              <select
                name="userRole"
                value={form.userRole}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="corporate">Corporate</option>
                <option value="individual">Individual</option>
                <option value="inhouse">In house Employee</option>
              </select>

              {/* Full Name */}
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* Birthday */}
              <label>Birthday *</label>
              <input
                type="date"
                name="birthday"
                value={form.birthday}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* Gender */}
              <label>Gender *</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              {/* Civil Status */}
              <label>Civil Status *</label>
              <select
                name="civilStatus"
                value={form.civilStatus}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="" disabled>
                  Select Civil Status
                </option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="others">Others (please specify)</option>
              </select>
              {form.civilStatus === 'others' && (
                <input
                  type="text"
                  name="civilStatusOther"
                  value={form.civilStatusOther}
                  onChange={handleChange}
                  placeholder="Please specify"
                  required
                  style={inputStyle}
                />
              )}

              {/* Email */}
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={inputStyle}
                disabled={isEditing}
                title={isEditing ? "Email can't be changed" : ''}
              />

              {/* Password */}
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                style={inputStyle}
                autoComplete="new-password"
              />

              {/* Confirm Password */}
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                style={inputStyle}
                autoComplete="new-password"
              />

              {/* Phone */}
              <label>Phone *</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* Employer Details */}
              <label>Employer Details *</label>
              <input
                type="text"
                name="employerDetails"
                value={form.employerDetails}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* Employer Address */}
              <label>Employer Address *</label>
              <input
                type="text"
                name="employerAddress"
                value={form.employerAddress}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* Driver License Picture */}
              <label>Driver License Picture *</label>
              <input
                type="file"
                name="driverLicenseFile"
                onChange={handleChange}
                accept="image/*"
                style={{ marginBottom: '1rem' }}
              />
              {form.driverLicenseFileName && (
                <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Selected File: {form.driverLicenseFileName}
                </div>
              )}

              {/* Driver License Expiry */}
              <label>Driver License Expiry *</label>
              <input
                type="date"
                name="driverLicenseExpiry"
                value={form.driverLicenseExpiry}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* Status in Islands */}
              <fieldset style={{ marginBottom: '1rem' }}>
                <legend style={{ fontWeight: '700', marginBottom: '0.5rem' }}>
                  Status in the Islands *
                </legend>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    name="statusTurks"
                    checked={form.statusTurks}
                    onChange={handleChange}
                  />
                  Status Turks
                </label>
                {form.statusTurks && (
                  <div style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      name="statusCardNo"
                      placeholder="Status Card #"
                      value={form.statusCardNo}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                    <input
                      type="date"
                      name="statusCardDate"
                      value={form.statusCardDate}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                )}

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    name="statusNaturalized"
                    checked={form.statusNaturalized}
                    onChange={handleChange}
                  />
                  Status Naturalized
                </label>
                {form.statusNaturalized && (
                  <div style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      name="certificateNo"
                      placeholder="Certificate #"
                      value={form.certificateNo}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                    <input
                      type="date"
                      name="certificateDate"
                      value={form.certificateDate}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                )}

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    name="statusPRC"
                    checked={form.statusPRC}
                    onChange={handleChange}
                  />
                  Status PRC
                </label>
                {form.statusPRC && (
                  <div style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      name="prcNo"
                      placeholder="PRC #"
                      value={form.prcNo}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                    <input
                      type="date"
                      name="prcDate"
                      value={form.prcDate}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                )}

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    name="statusWorkPermit"
                    checked={form.statusWorkPermit}
                    onChange={handleChange}
                  />
                  Status Work Permit
                </label>
                {form.statusWorkPermit && (
                  <div style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      name="workPermitRefNo"
                      placeholder="Work Permit Ref #"
                      value={form.workPermitRefNo}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                    <input
                      type="date"
                      name="workPermitExpiry"
                      value={form.workPermitExpiry}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                )}
              </fieldset>

              {/* NIB No */}
              <label>NIB # *</label>
              <input
                type="text"
                name="nibNo"
                value={form.nibNo}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* NHIP No */}
              <label>NHIP # *</label>
              <input
                type="text"
                name="nhipNo"
                value={form.nhipNo}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* TCI Driver's License No */}
              <label>TCI Driver's License # *</label>
              <input
                type="text"
                name="tciLicenseNo"
                value={form.tciLicenseNo}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              {/* Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '1rem',
                }}
              >
                <button
                  type="button"
                  onClick={closeForm}
                  style={{
                    backgroundColor: '#6c757d',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: 'white',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#007bff',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: 'white',
                  }}
                >
                  {isEditing ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles for inputs
const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  marginBottom: '1rem',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};
