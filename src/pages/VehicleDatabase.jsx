import React, { useEffect, useState } from 'react';
import { seedVehicles, getVehicles } from '../utils/vehicleStorage';
import { text } from 'framer-motion/m';
import { color } from 'framer-motion';

const STORAGE_KEY = 'crm_vehicles';

export default function VehicleDatabase() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    stockNo: '',
    year: '',
    make: '',
    model: '',
    body: '',
    color: '',
    trim: '',
    engine: '',
    transmission: '',
    miles: '',
    price: '',
    image: '', // will store base64 string
  });

  useEffect(() => {
    seedVehicles();
    setVehicles(getVehicles());
  }, []);

  function saveVehicles(updatedVehicles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVehicles));
    setVehicles(updatedVehicles);
  }

  const handleDelete = (stockNo) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      const updatedVehicles = vehicles.filter(v => v.stockNo !== stockNo);
      saveVehicles(updatedVehicles);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image file upload and convert to base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();

    if (!formData.stockNo || !formData.make || !formData.model) {
      alert('Stock Number, Make, and Model are required.');
      return;
    }
    if (vehicles.find(v => v.stockNo === formData.stockNo)) {
      alert('Stock Number must be unique.');
      return;
    }

    const newVehicle = {
      ...formData,
      year: Number(formData.year) || 0,
      miles: Number(formData.miles) || 0,
      price: Number(formData.price) || 0,
    };

    const updatedVehicles = [...vehicles, newVehicle];
    saveVehicles(updatedVehicles);

    setFormData({
      stockNo: '',
      year: '',
      make: '',
      model: '',
      body: '',
      color: '',
      trim: '',
      engine: '',
      transmission: '',
      miles: '',
      price: '',
      image: '',
    });
    // Clear file input manually if needed (see note below)
  };

  return (
    <div style={{ padding: '30px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1 style={{ fontWeight: 'bold', color: '#000', marginBottom: '25px' }}>Vehicle Management</h1>

      <form
        onSubmit={handleAddVehicle}
        style={{
          marginBottom: '30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
          gap: '15px',
          alignItems: 'center',
        }}
      >
        <input
          name="stockNo"
          placeholder="Stock #"
          value={formData.stockNo}
          onChange={handleChange}
          required
          style={inputStyle}
          text="black"
        />
        <input
          name="year"
          placeholder="Year"
          type="number"
          value={formData.year}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="make"
          placeholder="Make"
          value={formData.make}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="model"
          placeholder="Model"
          value={formData.model}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="body"
          placeholder="Body"
          value={formData.body}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="trim"
          placeholder="Trim"
          value={formData.trim}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="engine"
          placeholder="Engine"
          value={formData.engine}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="transmission"
          placeholder="Transmission"
          value={formData.transmission}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="miles"
          placeholder="Miles"
          type="number"
          value={formData.miles}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          style={inputStyle}
        />
        {/* Replace image URL input with file upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ gridColumn: 'span 2' }}
        />
        <button
          type="submit"
          style={{
            gridColumn: 'span 2',
            padding: '12px',
            backgroundColor: '#28a745',
            color: '#fff',
            fontWeight: '600',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(40, 167, 69, 0.4)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#218838')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#28a745')}
        >
          Add Vehicle
        </button>
      </form>

      {vehicles.length === 0 ? (
        <p>No vehicles available.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr>
              <th style={thStyle}>Stock#</th>
              <th style={thStyle}>Year</th>
              <th style={thStyle}>Make</th>
              <th style={thStyle}>Model</th>
              <th style={thStyle}>Body</th>
              <th style={thStyle}>Color</th>
              <th style={thStyle}>Trim</th>
              <th style={thStyle}>Engine</th>
              <th style={thStyle}>Transmission</th>
              <th style={thStyle}>Miles</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.stockNo} style={{ borderBottom: '1px solid #eee', backgroundColor: '#fff' }}>
                <td style={tdStyle}>{vehicle.stockNo}</td>
                <td style={tdStyle}>{vehicle.year}</td>
                <td style={tdStyle}>{vehicle.make}</td>
                <td style={tdStyle}>{vehicle.model}</td>
                <td style={tdStyle}>{vehicle.body}</td>
                <td style={tdStyle}>{vehicle.color}</td>
                <td style={tdStyle}>{vehicle.trim}</td>
                <td style={tdStyle}>{vehicle.engine}</td>
                <td style={tdStyle}>{vehicle.transmission}</td>
                <td style={tdStyle}>{vehicle.miles.toLocaleString()}</td>
                <td style={tdStyle}>${vehicle.price.toLocaleString()}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  {vehicle.image ? (
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: '4px', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}
                    />
                  ) : (
                    'No image'
                  )}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <button
                    onClick={() => handleDelete(vehicle.stockNo)}
                    style={{
                      background: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      boxShadow: '0 2px 5px rgba(220, 53, 69, 0.4)',
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c82333')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#dc3545')}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '14px',
  fontWeight: '500',
  outlineColor: '#28a745',
  transition: 'border-color 0.3s ease',
  color: 'black',
};

const thStyle = {
  borderBottom: '3px solid #000',
  padding: '12px 10px',
  textAlign: 'left',
  backgroundColor: '#000',
  color: '#fff',
  fontWeight: '700',
  fontSize: '14px',
  userSelect: 'none',
};

const tdStyle = {
  padding: '12px 10px',
  verticalAlign: 'middle',
  fontSize: '14px',
  color: '#333',
  fontWeight: '500',
};
