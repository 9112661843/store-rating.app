import React, { useState, useEffect } from 'react';
import { storeOwnerAPI, userAPI } from '../utils/api';
import toast from 'react-hot-toast';

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await storeOwnerAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!dashboardData) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No Store Found</h3>
          <p>You don't have any stores assigned to your account. Please contact an administrator.</p>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Store Owner Dashboard</h1>
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

      {/* Store Information */}
      <div className="card">
        <h3>Store Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <strong>Store Name:</strong> {dashboardData.store.name}
          </div>
          <div>
            <strong>Store Email:</strong> {dashboardData.store.email}
          </div>
          <div>
            <strong>Store Address:</strong> {dashboardData.store.address}
          </div>
          <div>
            <strong>Average Rating:</strong> 
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`star ${star <= Math.round(dashboardData.averageRating) ? 'filled' : ''}`}
                >
                  *
                </span>
              ))}
              <span style={{ marginLeft: '0.5rem', color: '#666' }}>
                {dashboardData.averageRating.toFixed(1)}/5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Section */}
      <div className="card">
        <h3>User Ratings</h3>
        {dashboardData.ratings.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>User Email</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.ratings.map(rating => (
                  <tr key={rating.id}>
                    <td>{rating.user_name}</td>
                    <td>{rating.user_email}</td>
                    <td>
                      <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span
                            key={star}
                            className={`star ${star <= rating.rating ? 'filled' : ''}`}
                          >
                            *
                          </span>
                        ))}
                        <span style={{ marginLeft: '0.5rem', color: '#666' }}>
                          {rating.rating}/5
                        </span>
                      </div>
                    </td>
                    <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>No ratings submitted yet.</p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{dashboardData.ratings.length}</div>
          <div className="stat-label">Total Ratings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{dashboardData.averageRating.toFixed(1)}</div>
          <div className="stat-label">Average Rating</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {dashboardData.ratings.filter(r => r.rating >= 4).length}
          </div>
          <div className="stat-label">Positive Ratings (4-5)</div>
        </div>
      </div>

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

export default StoreOwnerDashboard; 