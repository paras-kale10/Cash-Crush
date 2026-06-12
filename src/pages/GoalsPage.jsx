import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, Gift, TrendingUp, Check, X } from 'lucide-react';
import useStore from '../store/useStore';

export default function GoalsPage() {
  const goals = useStore((s) => s.goals) || [];
  const addGoal = useStore((s) => s.addGoal);
  const deleteGoal = useStore((s) => s.deleteGoal);
  const addToGoal = useStore((s) => s.addToGoal);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [addFundsId, setAddFundsId] = useState(null);
  const [fundsAmount, setFundsAmount] = useState('');

  const activeGoals = goals.filter((g) => {
    const current = g.currentAmount || g.saved || 0;
    const target = g.targetAmount || g.target || 0;
    return current < target;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const parsedAmount = parseFloat(targetAmount);
    
    // Validation
    if (!trimmedName) {
      alert('Please enter a goal name');
      return;
    }
    if (!targetAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid target amount greater than 0');
      return;
    }
    
    addGoal({
      name: trimmedName,
      targetAmount: parsedAmount,
      deadline: deadline || null,
    });
    setName('');
    setTargetAmount('');
    setDeadline('');
    setShowForm(false);
  };

  const handleAddFunds = (id) => {
    const val = parseFloat(fundsAmount);
    if (!val || val <= 0) return;
    addToGoal(id, val);
    setAddFundsId(null);
    setFundsAmount('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this goal?')) {
      deleteGoal(id);
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.75rem', color: '#F8FAFC' }}>
          Savings Goals
        </h1>
        <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
          {activeGoals.length} active goal{activeGoals.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Add Goal Form */}
      <motion.div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div
          onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#10B981', fontWeight: 600, fontSize: '1rem' }}
        >
          <Plus size={20} />
          {showForm ? 'Close' : 'Add New Goal'}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              style={{ overflow: 'hidden', marginTop: '1rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Goal Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Emergency Fund" style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Target Amount (₹)</label>
                  <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="Enter target" min="1" style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Deadline</label>
                  <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} />
                Create Goal
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card"
          style={{ padding: '4rem 2rem', textAlign: 'center' }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏴‍☠️</div>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '1.25rem', color: '#F8FAFC', marginBottom: '0.5rem' }}>
            No Treasure Goals Yet!
          </h3>
          <p style={{ color: '#94A3B8', maxWidth: '400px', margin: '0 auto' }}>
            Set your first savings goal and start building your treasure chest. Every coin counts! 🪙
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <AnimatePresence>
            {goals.map((goal) => {
              const current = goal.currentAmount || goal.saved || 0;
              const target = goal.targetAmount || goal.target || 1;
              const progress = Math.min(100, (current / target) * 100);
              const isCompleted = current >= target;

              // Estimated completion
              let estimatedCompletion = null;
              if (!isCompleted && goal.deadline) {
                estimatedCompletion = new Date(goal.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
              }

              return (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    border: isCompleted ? '2px solid #D4A017' : undefined,
                    boxShadow: isCompleted ? '0 0 20px rgba(212,160,23,0.2)' : undefined,
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {isCompleted ? (
                        <Check size={24} color="#D4A017" />
                      ) : (
                        <Target size={24} color="#3B82F6" />
                      )}
                      <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '1.15rem', color: '#F8FAFC' }}>
                        {goal.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      title="Delete"
                      style={{ padding: '0.35rem', borderRadius: '0.35rem', border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Treasure Chest Visualization */}
                  <div style={{
                    width: '100%',
                    height: '80px',
                    borderRadius: '0.75rem',
                    border: `2px solid ${isCompleted ? '#D4A017' : '#334155'}`,
                    background: '#0F172A',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                  }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: isCompleted
                          ? 'linear-gradient(to top, #D4A017, #FFD700)'
                          : 'linear-gradient(to top, #10B981, #34D399)',
                        borderRadius: '0 0 0.6rem 0.6rem',
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      zIndex: 1,
                    }}>
                      {isCompleted ? '🏆' : '📦'}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Progress</span>
                      <span style={{ color: isCompleted ? '#D4A017' : '#10B981', fontSize: '0.8rem', fontWeight: 600 }}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: '#1E293B' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          borderRadius: '4px',
                          background: isCompleted
                            ? 'linear-gradient(90deg, #D4A017, #FFD700)'
                            : 'linear-gradient(90deg, #10B981, #34D399)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Amounts */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>
                      ₹{current.toLocaleString('en-IN')} <span style={{ color: '#64748B' }}>/ ₹{target.toLocaleString('en-IN')}</span>
                    </span>
                  </div>

                  {/* Deadline / Estimated Completion */}
                  {estimatedCompletion && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem' }}>
                      <TrendingUp size={14} color="#94A3B8" />
                      <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Deadline: {estimatedCompletion}</span>
                    </div>
                  )}

                  {isCompleted && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      background: '#1a1207',
                      border: '1px solid #D4A017',
                      marginBottom: '0.5rem',
                    }}>
                      <Gift size={18} color="#D4A017" />
                      <span style={{ color: '#D4A017', fontWeight: 600, fontSize: '0.85rem' }}>🎉 Goal Completed!</span>
                    </div>
                  )}

                  {/* Add Funds */}
                  {!isCompleted && (
                    <>
                      {addFundsId === goal.id ? (
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <input
                            type="number"
                            value={fundsAmount}
                            onChange={(e) => setFundsAmount(e.target.value)}
                            placeholder="Amount"
                            min="1"
                            style={{ ...inputStyle, flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleAddFunds(goal.id)}
                            style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: 'none', background: '#10B981', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}
                          >
                            <Plus size={14} /> Add
                          </button>
                          <button
                            onClick={() => { setAddFundsId(null); setFundsAmount(''); }}
                            style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', background: '#334155', color: '#94A3B8', cursor: 'pointer' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddFundsId(goal.id)}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.6rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #334155',
                            background: '#1E293B',
                            color: '#10B981',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                          }}
                        >
                          <Plus size={16} />
                          Add Funds
                        </button>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
