import { useState } from 'react';
import { Briefcase, Calendar, Plus, X } from 'lucide-react';
import './App.css';

function App() {
  const [applications, setApplications] = useState([
    { id: 1, company: 'Google', position: 'Software Engineer', status: 'applied', dateApplied: '2025-12-20' },
    { id: 2, company: 'Meta', position: 'Product Manager', status: 'interview', dateApplied: '2025-12-18' },
  ]);
  
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

  const addApplication = () => {
    if (formData.company.trim() && formData.position.trim()) {
      setApplications([...applications, {
        id: Date.now(),
        ...formData
      }]);
      setFormData({
        company: '',
        position: '',
        status: 'applied',
        dateApplied: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
    }
  };

  const updateStatus = (id, newStatus) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  const deleteApplication = (id) => {
    setApplications(applications.filter(app => app.id !== id));
  };

  const statusCounts = {
    applied: applications.filter(a => a.status === 'applied').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const sortedApplications = [...applications].sort((a, b) => 
    new Date(b.dateApplied) - new Date(a.dateApplied)
  );

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
            {sortedApplications.map((app) => (
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
        <p>Update statuses as you hear back! Seeing your progress helps beat procrastination and keeps momentum going.</p>
      </div>
    </div>
  );
}

export default App;