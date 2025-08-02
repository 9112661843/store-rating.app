import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Form states
  const [showUserForm, setShowUserForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  });
  const [storeForm, setStoreForm] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: ''
  });

  // Filter states
  const [userFilters, setUserFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });
  const [storeFilters, setStoreFilters] = useState({
    name: '',
    email: '',
    address: ''
  });

  // Selected user for detailed view
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
    fetchStores();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const fetchStores = async () => {
    try {
      const response = await adminAPI.getStores();
      setStores(response.data);
    } catch (error) {
      toast.error('Failed to load stores');
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addUser(userForm);
      toast.success('User created successfully');
      setShowUserForm(false);
      setUserForm({ name: '', email: '', password: '', address: '', role: 'user' });
      fetchUsers();
      fetchDashboardStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addStore(storeForm);
      toast.success('Store created successfully');
      setShowStoreForm(false);
      setStoreForm({ name: '', email: '', address: '', owner_id: '' });
      fetchStores();
      fetchDashboardStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create store');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        toast.success('User deleted successfully');
        fetchUsers();
        fetchDashboardStats();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const deleteStore = async (storeId) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await adminAPI.deleteStore(storeId);
        toast.success('Store deleted successfully');
        fetchStores();
        fetchDashboardStats();
      } catch (error) {
        toast.error('Failed to delete store');
      }
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  // Filter functions
  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(userFilters.name.toLowerCase()) &&
      user.email.toLowerCase().includes(userFilters.email.toLowerCase()) &&
      user.address.toLowerCase().includes(userFilters.address.toLowerCase()) &&
      (userFilters.role === '' || user.role === userFilters.role)
    );
  });

  const filteredStores = stores.filter(store => {
    return (
      store.name.toLowerCase().includes(storeFilters.name.toLowerCase()) &&
      store.email.toLowerCase().includes(storeFilters.email.toLowerCase()) &&
      store.address.toLowerCase().includes(storeFilters.address.toLowerCase())
    );
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      {/* Navigation Tabs */}
      <div className="tabs" style={{ marginBottom: '2rem' }}>
        <button 
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
        <button 
          className={`tab ${activeTab === 'stores' ? 'active' : ''}`}
          onClick={() => setActiveTab('stores')}
        >
          Manage Stores
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{stats?.totalUsers || 0}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.totalStores || 0}</div>
          <div className="stat-label">Total Stores</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.totalRatings || 0}</div>
          <div className="stat-label">Total Ratings</div>
        </div>
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary"
                onClick={() => setActiveTab('users')}
              >
                Manage Users
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setActiveTab('stores')}
              >
                Manage Stores
              </button>
            </div>
          </div>
        </>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Manage Users</h3>
            <button 
              className="btn btn-primary"
              onClick={() => setShowUserForm(true)}
            >
              Add New User
            </button>
          </div>

          {/* User Filters */}
          <div className="filters-section" style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4>Filters</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={userFilters.name}
                  onChange={(e) => setUserFilters({...userFilters, name: e.target.value})}
                  placeholder="Filter by name"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="text"
                  value={userFilters.email}
                  onChange={(e) => setUserFilters({...userFilters, email: e.target.value})}
                  placeholder="Filter by email"
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  value={userFilters.address}
                  onChange={(e) => setUserFilters({...userFilters, address: e.target.value})}
                  placeholder="Filter by address"
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  value={userFilters.role}
                  onChange={(e) => setUserFilters({...userFilters, role: e.target.value})}
                >
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="store_owner">Store Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Address</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-admin' : user.role === 'store_owner' ? 'badge-owner' : 'badge-user'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.address}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => viewUserDetails(user)}
                        >
                          View
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteUser(user.id)}
                          disabled={user.role === 'admin'}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stores Tab */}
      {activeTab === 'stores' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Manage Stores</h3>
            <button 
              className="btn btn-primary"
              onClick={() => setShowStoreForm(true)}
            >
              Add New Store
            </button>
          </div>

          {/* Store Filters */}
          <div className="filters-section" style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4>Filters</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label>Store Name:</label>
                <input
                  type="text"
                  value={storeFilters.name}
                  onChange={(e) => setStoreFilters({...storeFilters, name: e.target.value})}
                  placeholder="Filter by store name"
                />
              </div>
              <div className="form-group">
                <label>Store Email:</label>
                <input
                  type="text"
                  value={storeFilters.email}
                  onChange={(e) => setStoreFilters({...storeFilters, email: e.target.value})}
                  placeholder="Filter by email"
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  value={storeFilters.address}
                  onChange={(e) => setStoreFilters({...storeFilters, address: e.target.value})}
                  placeholder="Filter by address"
                />
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Owner ID</th>
                  <th>Avg Rating</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map(store => (
                  <tr key={store.id}>
                    <td>{store.id}</td>
                    <td>{store.name}</td>
                    <td>{store.email}</td>
                    <td>{store.address}</td>
                    <td>{store.owner_id}</td>
                    <td>{store.average_rating ? parseFloat(store.average_rating).toFixed(1) : 'N/A'}</td>
                    <td>{new Date(store.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteStore(store.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showUserForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New User</h3>
              <button 
                className="close-btn"
                onClick={() => setShowUserForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUserSubmit}>
              <div className="form-group">
                <label>Name (2-60 characters):</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  required
                  minLength="2"
                  maxLength="60"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password (8-16 chars, uppercase + special):</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                  required
                  minLength="8"
                  maxLength="16"
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  value={userForm.address}
                  onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                  required
                  maxLength="400"
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                >
                  <option value="user">Normal User</option>
                  <option value="store_owner">Store Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Store Modal */}
      {showStoreForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Store</h3>
              <button 
                className="close-btn"
                onClick={() => setShowStoreForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleStoreSubmit}>
              <div className="form-group">
                <label>Store Name:</label>
                <input
                  type="text"
                  value={storeForm.name}
                  onChange={(e) => setStoreForm({...storeForm, name: e.target.value})}
                  required
                  maxLength="100"
                />
              </div>
              <div className="form-group">
                <label>Store Email:</label>
                <input
                  type="email"
                  value={storeForm.email}
                  onChange={(e) => setStoreForm({...storeForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  value={storeForm.address}
                  onChange={(e) => setStoreForm({...storeForm, address: e.target.value})}
                  required
                  maxLength="400"
                />
              </div>
              <div className="form-group">
                <label>Owner (User):</label>
                <select
                  value={storeForm.owner_id}
                  onChange={(e) => setStoreForm({...storeForm, owner_id: e.target.value})}
                  required
                >
                  <option value="">Select Owner</option>
                  {users.filter(user => user.role === 'store_owner' || user.role === 'user').map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email}) - {user.role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowStoreForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>User Details</h3>
              <button 
                className="close-btn"
                onClick={() => setShowUserDetails(false)}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div className="user-details">
                <div className="detail-row">
                  <strong>Name:</strong> {selectedUser.name}
                </div>
                <div className="detail-row">
                  <strong>Email:</strong> {selectedUser.email}
                </div>
                <div className="detail-row">
                  <strong>Address:</strong> {selectedUser.address}
                </div>
                <div className="detail-row">
                  <strong>Role:</strong> 
                  <span className={`badge ${selectedUser.role === 'admin' ? 'badge-admin' : selectedUser.role === 'store_owner' ? 'badge-owner' : 'badge-user'}`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Created:</strong> {new Date(selectedUser.created_at).toLocaleString()}
                </div>
                {selectedUser.role === 'store_owner' && (
                  <div className="detail-row">
                    <strong>Store Rating:</strong> {selectedUser.store_rating ? parseFloat(selectedUser.store_rating).toFixed(1) : 'N/A'}
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserDetails(false)}>
                  Close
                </button>
              </div>
            </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default AdminDashboard; 