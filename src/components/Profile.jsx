import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { LogOut, Bell, BookOpen, User as UserIcon } from "lucide-react";

const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:4000/api';

export default function Profile({ logout }) {
  const { user } = useAuth();
  const [mySubjects, setMySubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [preferences, setPreferences] = useState({
    emailEnabled: true,
    pushEnabled: true,
    dailyDigestEnabled: true,
    reminderHoursBefore: 24
  });

  const fetchProfileData = async () => {
    try {
      const res = await axios.get(`${API}/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMySubjects(res.data.subjects || []);
      if (res.data.notificationPreferences) {
        setPreferences(res.data.notificationPreferences);
      }
    } catch (err) {
      console.error("Error fetching profile subjects", err);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const updatePreference = async (key, value) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    try {
      await axios.patch(`${API}/notifications/preferences`, updated, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      console.error("Error updating preferences", err);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    try {
      const res = await axios.post(`${API}/my-subjects`, { name: newSubject }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMySubjects(res.data);
      setNewSubject("");
    } catch (err) {
      alert("Greška pri dodavanju kolegija");
    }
  };

  const handleDeleteSubject = async (name) => {
    try {
      await axios.delete(`${API}/my-subjects/${encodeURIComponent(name)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMySubjects(mySubjects.filter(s => s !== name));
    } catch (err) {
      alert("Greška pri brisanju kolegija");
    }
  };

  if (!user) return <p className="empty">Učitavanje profila...</p>;

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <header className="page-header">
        <h1 className="page-title">Profile & Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Manage your account and notifications.</p>
      </header>

      {/* User Info */}
      <div className="settings-section">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}><UserIcon size={20} strokeWidth={2.5} /> User Information</h3>
        <div style={{ display: 'grid', gap: '0.875rem', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          <p style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-muted)' }}>Username</strong> <span>{user.username}</span></p>
          <p style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-muted)' }}>Email</strong> <span>{user.email || 'N/A'}</span></p>
          <p style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-muted)' }}>Study</strong> <span>{user.study}</span></p>
          <p style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-muted)' }}>Year</strong> <span>{user.year}. Year</span></p>
        </div>
      </div>

      {/* Notifications Settings */}
      <div className="settings-section">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bell size={20} /> Notifications</h3>
        
        <div className="setting-item">
          <span>Email Reminders</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={preferences.emailEnabled} onChange={(e) => updatePreference('emailEnabled', e.target.checked)} />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <span>Push Notifications</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={preferences.pushEnabled} onChange={(e) => updatePreference('pushEnabled', e.target.checked)} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <span>Daily Digest</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={preferences.dailyDigestEnabled} onChange={(e) => updatePreference('dailyDigestEnabled', e.target.checked)} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item" style={{ borderBottom: 'none' }}>
          <span>Reminder Timing</span>
          <select 
            value={preferences.reminderHoursBefore} 
            onChange={(e) => updatePreference('reminderHoursBefore', parseInt(e.target.value))}
            style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }}
          >
            <option value={1}>1 hour before</option>
            <option value={3}>3 hours before</option>
            <option value={24}>24 hours before</option>
            <option value={168}>1 week before</option>
          </select>
        </div>
      </div>

      {/* Custom Subjects */}
      <div className="settings-section">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={20} /> Custom Subjects</h3>
        <form onSubmit={handleAddSubject} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="Add subject..." 
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            style={{ flex: 1, padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.5rem', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
          />
          <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>Add</button>
        </form>

        {mySubjects.length === 0 ? (
          <p className="empty" style={{ padding: '0.5rem 0', fontSize: '0.9rem' }}>No custom subjects added.</p>
        ) : (
          <ul style={{ listStyle: 'none' }}>
            {mySubjects.map(s => (
              <li key={s} className="setting-item" style={{ padding: '0.5rem 0' }}>
                <span>{s}</span>
                <button 
                  onClick={() => handleDeleteSubject(s)}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', padding: '0.25rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Logout */}
      <button className="btn" style={{ backgroundColor: 'var(--border)', color: 'var(--text-main)', marginTop: '1rem' }} onClick={logout}>
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
}