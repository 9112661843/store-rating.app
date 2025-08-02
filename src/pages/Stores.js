import React, { useState, useEffect } from 'react';
import { userAPI, ratingsAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await userAPI.getStores();
      setStores(response.data);
    } catch (error) {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (storeId, rating) => {
    try {
      await ratingsAPI.submit({ store_id: storeId, rating });
      toast.success('Rating submitted successfully');
      fetchStores(); // Refresh to get updated ratings
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8 || passwordForm.newPassword.length > 16) {
      toast.error('Password must be 8-16 characters');
      return;
    }

    if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(passwordForm.newPassword)) {
      toast.error('Password must contain uppercase letter and special character');
      return;
    }

    try {
      await userAPI.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password updated successfully');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const filteredStores = stores.filter(store => {
    const searchLower = searchTerm.toLowerCase();
    return (
      store.name.toLowerCase().includes(searchLower) ||
      store.address.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Store Ratings</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setShowPasswordModal(true)}
          >
            Update Password
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search stores by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stores Grid */}
      <div className="store-grid">
        {filteredStores.map(store => (
          <div key={store.id} className="store-card">
            <div className="store-name">{store.name}</div>
            <div className="store-address">{store.address}</div>
            
            <div style={{ marginBottom: '1rem' }}>
              <strong>Overall Rating:</strong> 
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`star ${store.average_rating && star <= Math.round(parseFloat(store.average_rating)) ? 'filled' : ''}`}
                  >
                    *
                  </span>
                ))}
                <span style={{ marginLeft: '0.5rem', color: '#666' }}>
                  {store.average_rating ? parseFloat(store.average_rating).toFixed(1) : 'No ratings'}
                </span>
              </div>
            </div>

            {store.user_rating && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Your Rating:</strong>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`star ${star <= store.user_rating ? 'filled' : ''}`}
                    >
                      *
                    </span>
                  ))}
                  <span style={{ marginLeft: '0.5rem', color: '#666' }}>
                    {store.user_rating}/5
                  </span>
                </div>
              </div>
            )}

            <div>
              <strong>Rate this store:</strong>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className="star"
                    onClick={() => handleRatingSubmit(store.id, star)}
                    style={{ cursor: 'pointer' }}
                  >
                    *
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStores.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No stores found</h3>
          <p>Try adjusting your search terms or check back later for new stores.</p>
        </div>
      )}

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Update Password</h3>
              <button 
                className="close-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label>Current Password:</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password (8-16 chars, uppercase + special):</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  required
                  minLength="8"
                  maxLength="16"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password:</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores; 