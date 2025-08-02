import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (formData.name.length < 2 || formData.name.length > 60) {
      toast.error('Name must be between 2-60 characters');
      return false;
    }
    if (formData.address.length > 400) {
      toast.error('Address must be less than 400 characters');
      return false;
    }
    if (formData.password.length < 8 || formData.password.length > 16) {
      toast.error('Password must be 8-16 characters');
      return false;
    }
    if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)) {
      toast.error('Password must contain uppercase and special character');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Register as Normal User</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
          Create your account to rate stores and submit reviews
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name (2-60 characters)</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
              minLength="2"
              maxLength="60"
              placeholder="Enter your name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Address (max 400 characters)</label>
            <textarea
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
              required
              maxLength="400"
              rows="3"
              placeholder="Enter your address"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password (8-16 characters, uppercase + special)</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              maxLength="16"
              placeholder="Enter your password"
            />
            <small style={{ color: '#666', fontSize: '0.875rem' }}>
              Must contain at least one uppercase letter and one special character (!@#$%^&*)
            </small>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 