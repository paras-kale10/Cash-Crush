import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Shield, Target, Trophy, Edit, Trash2 } from 'lucide-react';
import useStore from '../store/useStore';
import { AVATAR_OPTIONS, getAvatarEmoji } from '../utils/avatars';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user) || {};
  const monthlyIncome = useStore((s) => s.monthlyIncome) || 0;
  const salaryDate = useStore((s) => s.salaryDate) || 1;
  const vault = useStore((s) => s.vault);
  const goals = useStore((s) => s.goals) || [];
  const achievements = useStore((s) => s.achievements) || [];
  const expenses = useStore((s) => s.expenses) || [];
  const level = user.level || 1;
  const updateProfile = useStore((s) => s.updateProfile);
  const setMonthlyIncome = useStore((s) => s.setMonthlyIncome);
  const setSalaryDate = useStore((s) => s.setSalaryDate);
  const resetAll = useStore((s) => s.resetAll);

  const [editing, setEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user.username || '');
  const [editAvatar, setEditAvatar] = useState(user.avatar || 'adventurer');
  const [editIncome, setEditIncome] = useState(monthlyIncome);
  const [editSalaryDate, setEditSalaryDate] = useState(salaryDate);

  const totalSavings = vault?.currentSavings ?? 0;
  const goalsCompleted = goals.filter((g) => {
    const current = g.currentAmount || g.saved || 0;
    const target = g.targetAmount || g.target || 0;
    return current >= target;
  }).length;

  const avatarEmoji = getAvatarEmoji(user.avatar);
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Recently';

  const LEVEL_TITLES = [
    'Novice Saver',
    'Bronze Budgeter',
    'Silver Strategist',
    'Gold Saver',
    'Platinum Planner',
    'Diamond Financier',
    'Legendary Treasurer',
  ];
  const levelTitle = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] || 'Master';

  const handleSave = () => {
    if (updateProfile) {
      updateProfile({
        username: editUsername,
        name: editUsername,
        avatar: editAvatar,
      });
    }
    if (setSalaryDate) {
      setSalaryDate(parseInt(editSalaryDate) || 1);
    }
    if (setMonthlyIncome) {
      setMonthlyIncome(parseFloat(editIncome) || 0);
    }
    setEditing(false);
  };

  const handleReset = () => {
    if (window.confirm('⚠️ Are you sure you want to reset ALL data? This action cannot be undone!')) {
      if (window.confirm('This will permanently delete all your expenses, goals, bills, vault data, and achievements. Proceed?')) {
        if (resetAll) resetAll();
        navigate('/');
      }
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    border: '1px solid #334155',
    background: '#0F172A',
    color: '#F8FAFC',
    fontSize: '0.9rem',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    color: '#94A3B8',
    fontSize: '0.85rem',
    marginBottom: '0.5rem',
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.75rem', marginBottom: '1.5rem', color: '#F8FAFC' }}>
        Profile
      </h1>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}
      >
        {/* Avatar */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #D4A017, #B8860B)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          margin: '0 auto 1rem',
          boxShadow: '0 0 20px rgba(212,160,23,0.3)',
        }}>
          {avatarEmoji}
        </div>

        {/* Username */}
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.5rem', color: '#F8FAFC', marginBottom: '0.25rem' }}>
          {user.username || user.name || 'Adventurer'}
        </h2>

        {/* Email */}
        {user.email && (
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
            {user.email}
          </p>
        )}

        {/* Level Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'linear-gradient(135deg, #D4A017, #B8860B)',
          padding: '0.4rem 1rem',
          borderRadius: '1rem',
          marginBottom: '0.5rem',
        }}>
          <Trophy size={16} color="#1a1207" />
          <span style={{ color: '#1a1207', fontWeight: 700, fontSize: '0.85rem' }}>
            Level {level} — {levelTitle}
          </span>
        </div>

        {/* Member Since */}
        <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          Member since {memberSince}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <Shield size={24} color="#D4A017" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Total Savings</p>
          <p style={{ color: '#D4A017', fontWeight: 700, fontSize: '1.25rem' }}>₹{totalSavings.toLocaleString('en-IN')}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <Target size={24} color="#10B981" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Goals Completed</p>
          <p style={{ color: '#10B981', fontWeight: 700, fontSize: '1.25rem' }}>{goalsCompleted}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <Trophy size={24} color="#8B5CF6" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Achievements Earned</p>
          <p style={{ color: '#8B5CF6', fontWeight: 700, fontSize: '1.25rem' }}>{achievements.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <User size={24} color="#3B82F6" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Expenses Tracked</p>
          <p style={{ color: '#3B82F6', fontWeight: 700, fontSize: '1.25rem' }}>{expenses.length}</p>
        </motion.div>
      </div>

      {/* Edit Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
        style={{ padding: '1.5rem', marginBottom: '1.5rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '1.1rem', color: '#F8FAFC' }}>
            Edit Profile
          </h3>
          {!editing && (
            <button
              onClick={() => {
                setEditUsername(user.username || user.name || '');
                setEditAvatar(user.avatar || 'pirate');
                setEditIncome(monthlyIncome);
                setEditSalaryDate(salaryDate);
                setEditing(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: '#1E293B',
                color: '#3B82F6',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              <Edit size={16} />
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Monthly Income (₹)</label>
                <input
                  type="number"
                  value={editIncome}
                  onChange={(e) => setEditIncome(e.target.value)}
                  min="0"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Salary Date (Day 1-31)</label>
                <input
                  type="number"
                  value={editSalaryDate}
                  onChange={(e) => setEditSalaryDate(e.target.value)}
                  min="1"
                  max="31"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Avatar Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Select Avatar</label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {AVATAR_OPTIONS.map(({ slug, emoji }) => (
                  <motion.button
                    key={slug}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditAvatar(slug)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      border: editAvatar === slug ? '3px solid #D4A017' : '2px solid #334155',
                      background: editAvatar === slug ? 'rgba(212,160,23,0.1)' : '#1E293B',
                      fontSize: '1.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: editAvatar === slug ? '0 0 10px rgba(212,160,23,0.3)' : 'none',
                    }}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleSave}
                className="btn-primary"
                style={{ padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #334155',
                  background: 'transparent',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <p style={{ color: '#64748B', fontSize: '0.8rem' }}>Username</p>
              <p style={{ color: '#F8FAFC', fontWeight: 500 }}>{user.username || user.name || 'Not set'}</p>
            </div>
            <div>
              <p style={{ color: '#64748B', fontSize: '0.8rem' }}>Avatar</p>
              <p style={{ fontSize: '1.5rem' }}>{avatarEmoji} <span style={{ color: '#94A3B8', fontSize: '0.85rem', textTransform: 'capitalize' }}>{user.avatar || 'pirate'}</span></p>
            </div>
            <div>
              <p style={{ color: '#64748B', fontSize: '0.8rem' }}>Monthly Income</p>
              <p style={{ color: '#F8FAFC', fontWeight: 500 }}>₹{monthlyIncome.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p style={{ color: '#64748B', fontSize: '0.8rem' }}>Salary Date</p>
              <p style={{ color: '#F8FAFC', fontWeight: 500 }}>Day {salaryDate}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
        style={{
          padding: '1.5rem',
          border: '1px solid #7F1D1D',
        }}
      >
        <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '1.1rem', color: '#EF4444', marginBottom: '0.5rem' }}>
          Danger Zone
        </h3>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Once you reset all data, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleReset}
          className="btn-danger"
          style={{
            padding: '0.75rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#DC2626',
            color: '#fff',
            border: 'none',
            borderRadius: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          <Trash2 size={18} />
          Reset All Data
        </button>
      </motion.div>
    </div>
  );
}
