import { useState, useEffect } from 'react';
import { Briefcase, Calendar, Plus, X } from 'lucide-react';
import './App.css';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'applied',
    dateApplied: new Date().toISOString().split('T')[0]
  });

  const statuses = {
    applied: { label: 'Applied' },
    interview: { label: 'Interview' },
    offer: { label: 'Offer' },
    rejected: { label: 'Rejected' },
  };

  // Fetch applications on load
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_URL}/applications`);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Failed to load applications. Make sure the server is running!');
    } finally {
      setLoading(false);
    }
  };

  const addApplication = async () => {
    if (formData.company.trim() && formData.position.trim()) {
      try {
        const response = await fetch(`${API_URL}/applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const newApp = await response.json();
        setApplications([newApp, ...applications]);
        setFormData({
          company: '',
          position: '',
          status: 'applied',
          dateApplied: new Date().toISOString().split('T')[0]
        });
        setShowForm(false);
      } catch (error) {
        console.error('Error adding application:', error);
        alert('Failed to add application');
      }
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`${API_URL}/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const deleteApplication = async (id) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await fetch(`${API_URL}/applications/${id}`, {
          method: 'DELETE'
        });
        setApplications(applications.filter(app => app.id !== id));
      } catch (error) {
        console.error('Error deleting application:', error);
        alert('Failed to delete application');
      }
    }
  };

  const statusCounts = {
    applied: applications.filter(a => a.status === 'applied').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header-card">
        <div className="header-content">
          <div className="header-title">
            <h1>
              <Briefcase size={32} />
              Job Application Tracker
            </h1>
            <p>Track your job search progress</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus size={20} />
            Add Application
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-applied">
            <p className="stat-label">Applied</p>
            <p className="stat-number">{statusCounts.applied}</p>
          </div>
          <div className="stat-card stat-interview">
            <p className="stat-label">Interviews</p>
            <p className="stat-number">{statusCounts.interview}</p>
          </div>
          <div className="stat-card stat-offer">
            <p className="stat-label">Offers</p>
            <p className="stat-number">{statusCounts.offer}</p>
          </div>
          <div className="stat-card stat-total">
            <p className="stat-label">Total</p>
            <p className="stat-number">{applications.length}</p>
          </div>
        </div>

        {showForm && (
          <div className="form-card">
            <h3>New Application</h3>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Position/Role"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="form-input"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="form-input"
              >
                {Object.entries(statuses).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
              <input
                type="date"
                value={formData.dateApplied}
                onChange={(e) => setFormData({...formData, dateApplied: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-actions">
              <button onClick={addApplication} className="btn-primary">
                Add Application
              </button>
              <button onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Position</th>
              <th>Status</th>
              <th>Date Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>
                  <div className="company-name">{app.company}</div>
                </td>
                <td>{app.position}</td>
                <td>
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                    className={`status-badge status-${app.status}`}
                  >
                    {Object.entries(statuses).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="date-cell">
                    <Calendar size={16} />
                    {new Date(app.dateApplied).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => deleteApplication(app.id)}
                    className="btn-delete"
                  >
                    <X size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && (
          <div className="empty-state">
            <Briefcase size={48} />
            <p>No applications yet. Click "Add Application" to get started!</p>
          </div>
        )}
      </div>

      <div className="tip-card">
        <h3>💡 Pro Tip</h3>
        <p>Your data is saved automatically! Close and reopen anytime - your applications will be here.</p>
      </div>
    </div>
  );
}

export default App;