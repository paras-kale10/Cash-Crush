import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Check } from 'lucide-react';
import useStore from '../../store/useStore';
import { categorizeExpense, getCategoryEmoji } from '../../utils/categorizer';

const QuickExpenseCard = () => {
  const { addExpense, expenses } = useStore();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount || Number(amount) <= 0) return;

    const category = categorizeExpense(name);
    addExpense({
      name: name.trim(),
      amount: Number(amount),
      category,
      notes: notes.trim(),
    });

    setName('');
    setAmount('');
    setNotes('');

    // Show success animation
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1200);
  };

  // Time ago helper
  const timeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const recentExpenses = expenses.slice(0, 3);

  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card"
      style={{
        padding: '1.5rem',
        borderRadius: '1rem',
        background: 'rgba(15, 15, 35, 0.8)',
      }}
    >
      {/* Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.25rem',
        }}
      >
        <CreditCard size={20} style={{ color: '#8B5CF6' }} />
        <h2
          className="pixel-text"
          style={{ fontSize: '1rem', color: '#fff', margin: 0 }}
        >
          Quick Add Expense
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.25rem' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Lunch at Subway"
          style={{
            width: '100%',
            padding: '0.65rem 0.75rem',
            marginBottom: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontSize: '0.85rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="₹ Amount"
          min="0"
          step="1"
          style={{
            width: '100%',
            padding: '0.65rem 0.75rem',
            marginBottom: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontSize: '0.85rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          style={{
            width: '100%',
            padding: '0.65rem 0.75rem',
            marginBottom: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontSize: '0.85rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        <div style={{ position: 'relative' }}>
          <motion.button
            type="submit"
            className="btn btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '0.65rem',
              borderRadius: '0.75rem',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Add Expense
          </motion.button>

          {/* Success Animation */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#22C55E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(34,197,94,0.5)',
                }}
              >
                <Check size={24} style={{ color: '#fff' }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Recent Expenses */}
      {recentExpenses.length > 0 && (
        <div>
          <div
            style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '0.5rem',
            }}
          >
            Recent
          </div>
          {recentExpenses.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom:
                  i < recentExpenses.length - 1
                    ? '1px solid rgba(255,255,255,0.05)'
                    : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>
                  {getCategoryEmoji(exp.category)}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#E2E8F0',
                      fontWeight: '500',
                    }}
                  >
                    {exp.name}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                    {timeAgo(exp.date)}
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  color: '#EF4444',
                }}
              >
                -{fmt(exp.amount)}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default QuickExpenseCard;
