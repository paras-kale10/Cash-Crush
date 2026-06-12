import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Coins, Plus } from 'lucide-react';
import useStore from '../store/useStore';

export default function VaultPage() {
  const [amount, setAmount] = useState('');
  const vault = useStore((s) => s.vault);
  const addToVault = useStore((s) => s.addToVault);

  const totalSavings = vault?.currentSavings ?? 0;
  const monthlyContribution = vault?.monthlyContribution ?? 0;
  const history = vault?.history ? [...vault.history].sort((a, b) => new Date(b.date) - new Date(a.date)) : [];

  const monthsSaving = (() => {
    if (history.length === 0) return 0;
    const dates = history.map((h) => new Date(h.date));
    const oldest = new Date(Math.min(...dates));
    const now = new Date();
    return Math.max(1, Math.ceil((now - oldest) / (1000 * 60 * 60 * 24 * 30)));
  })();

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }
    addToVault(val);
    setAmount('');
  };

  const floatingCoins = ['🪙', '💰', '✨', '🪙', '💎'];

  return (
    <div>
      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.75rem', marginBottom: '1.5rem', color: '#F8FAFC' }}>
        Treasure Vault
      </h1>

      {/* Vault Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          padding: '3rem',
          borderRadius: '1.5rem',
          background: 'linear-gradient(135deg, #1a1207 0%, #2d1f0e 50%, #1a1207 100%)',
          border: '2px solid #D4A017',
          overflow: 'hidden',
        }}
      >
        {/* Glow animation */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(212,160,23,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Floating coins */}
        {floatingCoins.map((emoji, i) => (
          <motion.span
            key={i}
            animate={{
              y: [0, -20, 0],
              x: [0, (i % 2 === 0 ? 10 : -10), 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
            style={{
              position: 'absolute',
              fontSize: '1.5rem',
              top: `${15 + i * 15}%`,
              left: `${10 + i * 18}%`,
              opacity: 0.6,
            }}
          >
            {emoji}
          </motion.span>
        ))}

        {/* Vault box */}
        <div style={{
          position: 'relative',
          width: '200px',
          height: '160px',
          borderRadius: '1rem',
          background: 'linear-gradient(180deg, #D4A017 0%, #B8860B 40%, #8B6914 100%)',
          border: '3px solid #FFD700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(212,160,23,0.4), inset 0 2px 4px rgba(255,215,0,0.3)',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <Shield size={40} color="#1a1207" />
            <Lock size={24} color="#1a1207" />
          </div>
        </div>

        {/* Vault total overlay */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          textAlign: 'center',
        }}>
          <p style={{ color: '#D4A017', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '2rem' }}>
            ₹{totalSavings.toLocaleString('en-IN')}
          </p>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Total Vault Balance</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
          style={{ textAlign: 'center', padding: '1.5rem' }}
        >
          <Coins size={28} color="#D4A017" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Total Savings</p>
          <p style={{ color: '#D4A017', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.5rem' }}>
            ₹{totalSavings.toLocaleString('en-IN')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
          style={{ textAlign: 'center', padding: '1.5rem' }}
        >
          <Plus size={28} color="#10B981" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Monthly Contribution</p>
          <p style={{ color: '#10B981', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.5rem' }}>
            ₹{monthlyContribution.toLocaleString('en-IN')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
          style={{ textAlign: 'center', padding: '1.5rem' }}
        >
          <Shield size={28} color="#8B5CF6" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Months Saving</p>
          <p style={{ color: '#8B5CF6', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.5rem' }}>
            {monthsSaving}
          </p>
        </motion.div>
      </div>

      {/* Add to Vault Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
        style={{ padding: '1.5rem', marginBottom: '2rem' }}
      >
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '1.25rem', color: '#F8FAFC', marginBottom: '1rem' }}>
          Add to Vault
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid #334155',
                background: '#0F172A',
                color: '#F8FAFC',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>
          <button type="submit" className="btn-gold" style={{ padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} />
            Add to Vault
          </button>
        </form>
      </motion.div>

      {/* Vault History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
        style={{ padding: '1.5rem' }}
      >
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '1.25rem', color: '#F8FAFC', marginBottom: '1rem' }}>
          Vault History
        </h2>
        {history.length === 0 ? (
          <p style={{ color: '#64748B', textAlign: 'center', padding: '2rem' }}>
            No contributions yet. Start building your treasure! 🪙
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1E293B' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8', fontWeight: 600, fontSize: '0.85rem' }}>Date</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem', color: '#94A3B8', fontWeight: 600, fontSize: '0.85rem' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {history.map((entry, index) => (
                    <motion.tr
                      key={entry.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      style={{ borderBottom: '1px solid #1E293B' }}
                    >
                      <td style={{ padding: '0.75rem', color: '#CBD5E1', fontSize: '0.9rem' }}>
                        {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: '#10B981', fontWeight: 600, fontSize: '0.9rem' }}>
                        +₹{parseFloat(entry.amount).toLocaleString('en-IN')}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
