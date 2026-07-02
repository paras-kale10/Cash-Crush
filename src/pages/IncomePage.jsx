import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  TrendingUp,
  Gift,
  Briefcase,
  Users,
  PiggyBank,
  HelpCircle,
  DollarSign,
  Calendar,
  StickyNote,
} from 'lucide-react';
import useStore from '../store/useStore';

const INCOME_SOURCES = [
  { value: 'Freelance', label: 'Freelance', icon: Briefcase, color: '#3B82F6' },
  { value: 'Gift', label: 'Gift', icon: Gift, color: '#EC4899' },
  { value: 'Refund', label: 'Refund', icon: Wallet, color: '#10B981' },
  { value: 'Investment', label: 'Investment', icon: TrendingUp, color: '#8B5CF6' },
  { value: 'Family', label: 'Family / Friends', icon: Users, color: '#F59E0B' },
  { value: 'Savings', label: 'Savings Withdrawal', icon: PiggyBank, color: '#14B8A6' },
  { value: 'Other', label: 'Other', icon: HelpCircle, color: '#94A3B8' },
];

function getSourceMeta(source) {
  return INCOME_SOURCES.find(s => s.value === source) || INCOME_SOURCES[INCOME_SOURCES.length - 1];
}

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.75rem',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  color: '#F8FAFC',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  fontFamily: 'inherit',
};

const inputFocusHandler = (color = 'rgba(16, 185, 129, 0.4)') => ({
  onFocus: (e) => {
    e.currentTarget.style.borderColor = color;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${color.replace('0.4', '0.1')}`;
  },
  onBlur: (e) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
    e.currentTarget.style.boxShadow = 'none';
  },
});

export default function IncomePage() {
  const incomes = useStore(s => s.incomes) || [];
  const addIncome = useStore(s => s.addIncome);
  const updateIncome = useStore(s => s.updateIncome);
  const deleteIncome = useStore(s => s.deleteIncome);
  const getTotalIncomeThisMonth = useStore(s => s.getTotalIncomeThisMonth);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('Other');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editSource, setEditSource] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const totalThisMonth = getTotalIncomeThisMonth();

  const now = new Date();
  const thisMonthIncomes = incomes.filter(i => {
    const d = new Date(i.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount || Number(amount) <= 0) return;

    addIncome({
      name: name.trim(),
      amount: Number(amount),
      source,
      notes: notes.trim(),
    });

    setName('');
    setAmount('');
    setSource('Other');
    setNotes('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const startEdit = (income) => {
    setEditId(income.id);
    setEditName(income.name);
    setEditAmount(income.amount.toString());
    setEditSource(income.source || 'Other');
    setEditNotes(income.notes || '');
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  const saveEdit = () => {
    if (!editName.trim() || !editAmount || Number(editAmount) <= 0) return;
    updateIncome(editId, {
      name: editName.trim(),
      amount: Number(editAmount),
      source: editSource,
      notes: editNotes.trim(),
    });
    setEditId(null);
  };

  const confirmDelete = (id) => {
    deleteIncome(id);
    setDeleteConfirm(null);
  };

  const timeAgo = (dateStr) => {
    const nowDate = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((nowDate - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(1.5rem, 5vw, 2rem)',
          color: '#F8FAFC',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <span style={{
            width: '42px', height: '42px', borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(52, 211, 153, 0.15) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Wallet size={22} style={{ color: '#10B981' }} />
          </span>
          Add Money
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
          Track extra income from freelance work, gifts, refunds, and other sources
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            padding: '1.25rem',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <DollarSign size={16} style={{ color: '#10B981' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              This Month's Extra
            </span>
          </div>
          <p style={{ color: '#10B981', fontWeight: 700, fontSize: '1.75rem', margin: 0, fontFamily: "'Poppins', sans-serif" }}>
            {fmt(totalThisMonth)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            padding: '1.25rem',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Calendar size={16} style={{ color: '#3B82F6' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Entries This Month
            </span>
          </div>
          <p style={{ color: '#3B82F6', fontWeight: 700, fontSize: '1.75rem', margin: 0, fontFamily: "'Poppins', sans-serif" }}>
            {thisMonthIncomes.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            padding: '1.25rem',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <TrendingUp size={16} style={{ color: '#8B5CF6' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              All-Time Total
            </span>
          </div>
          <p style={{ color: '#8B5CF6', fontWeight: 700, fontSize: '1.75rem', margin: 0, fontFamily: "'Poppins', sans-serif" }}>
            {fmt(incomes.reduce((sum, i) => sum + Number(i.amount), 0))}
          </p>
        </motion.div>
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>

        {/* Add Income Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card"
          style={{
            padding: '1.5rem',
            borderRadius: '1rem',
            background: 'rgba(15, 15, 35, 0.8)',
            alignSelf: 'start',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(52, 211, 153, 0.15) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Plus size={18} style={{ color: '#10B981' }} />
            </div>
            <h2 style={{ fontSize: '1rem', color: '#F8FAFC', margin: 0, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
              Add Extra Income
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Source selector */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.5rem' }}>
                Source
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {INCOME_SOURCES.map(s => {
                  const Icon = s.icon;
                  const isSelected = source === s.value;
                  return (
                    <motion.button
                      key={s.value}
                      type="button"
                      onClick={() => setSource(s.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        border: `1px solid ${isSelected ? s.color : 'rgba(255,255,255,0.1)'}`,
                        background: isSelected ? `${s.color}22` : 'rgba(255,255,255,0.03)',
                        color: isSelected ? s.color : '#94A3B8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Icon size={14} />
                      {s.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.4rem' }}>
                Description
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Payment from client, Birthday gift..."
                style={inputStyle}
                {...inputFocusHandler()}
              />
            </div>

            {/* Amount */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.4rem' }}>
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="₹ 0"
                min="0"
                step="1"
                style={inputStyle}
                {...inputFocusHandler()}
              />
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.4rem' }}>
                Notes <span style={{ color: '#64748B', fontWeight: 400, textTransform: 'none' }}>(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Where did this money come from? Any details..."
                rows={2}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }}
                {...inputFocusHandler()}
              />
            </div>

            {/* Submit */}
            <div style={{ position: 'relative' }}>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 25px rgba(16, 185, 129, 0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)'; }}
              >
                <Plus size={18} />
                Add Income
              </motion.button>

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
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 30px rgba(16, 185, 129, 0.6)',
                    }}
                  >
                    <Check size={24} style={{ color: '#fff' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>

        {/* Income History Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card"
          style={{
            padding: '1.5rem',
            borderRadius: '1rem',
            background: 'rgba(15, 15, 35, 0.8)',
            maxHeight: '600px',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.15) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <StickyNote size={18} style={{ color: '#3B82F6' }} />
            </div>
            <h2 style={{ fontSize: '1rem', color: '#F8FAFC', margin: 0, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
              Income History
            </h2>
            <span style={{
              marginLeft: 'auto',
              fontSize: '0.75rem',
              color: '#64748B',
              background: 'rgba(255,255,255,0.05)',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.5rem',
            }}>
              {incomes.length} entries
            </span>
          </div>

          {incomes.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#64748B',
            }}>
              <Wallet size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>No extra income added yet</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Use the form to add money you received from various sources</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {incomes.map((income, i) => {
                const sourceMeta = getSourceMeta(income.source);
                const SourceIcon = sourceMeta.icon;
                const isEditing = editId === income.id;
                const isDeleting = deleteConfirm === income.id;

                return (
                  <motion.div
                    key={income.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isEditing ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => { if (!isEditing) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={(e) => { if (!isEditing) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  >
                    {isEditing ? (
                      /* Edit mode */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                        />
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          min="0"
                          style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                        />
                        <select
                          value={editSource}
                          onChange={(e) => setEditSource(e.target.value)}
                          style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.85rem', cursor: 'pointer' }}
                        >
                          {INCOME_SOURCES.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Notes..."
                          style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={cancelEdit}
                            style={{
                              padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: 'none',
                              background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444',
                              cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                              display: 'flex', alignItems: 'center', gap: '0.25rem',
                            }}
                          >
                            <X size={14} /> Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={saveEdit}
                            style={{
                              padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: 'none',
                              background: 'rgba(16, 185, 129, 0.15)', color: '#10B981',
                              cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                              display: 'flex', alignItems: 'center', gap: '0.25rem',
                            }}
                          >
                            <Check size={14} /> Save
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      /* Display mode */
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '0.65rem',
                          background: `${sourceMeta.color}15`,
                          border: `1px solid ${sourceMeta.color}30`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <SourceIcon size={18} style={{ color: sourceMeta.color }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {income.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                            <span style={{ fontSize: '0.7rem', color: sourceMeta.color, fontWeight: 500, background: `${sourceMeta.color}15`, padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>
                              {sourceMeta.label}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                              {timeAgo(income.date)}
                            </span>
                          </div>
                          {income.notes && (
                            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.3rem', fontStyle: 'italic' }}>
                              "{income.notes}"
                            </div>
                          )}
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#10B981' }}>
                            +{fmt(income.amount)}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flexShrink: 0 }}>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => startEdit(income)}
                            style={{
                              padding: '0.35rem', borderRadius: '0.4rem', border: 'none',
                              background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <Edit3 size={13} />
                          </motion.button>

                          {isDeleting ? (
                            <div style={{ display: 'flex', gap: '0.15rem' }}>
                              <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => confirmDelete(income.id)}
                                style={{
                                  padding: '0.35rem', borderRadius: '0.4rem', border: 'none',
                                  background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444',
                                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                              >
                                <Check size={13} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setDeleteConfirm(null)}
                                style={{
                                  padding: '0.35rem', borderRadius: '0.4rem', border: 'none',
                                  background: 'rgba(255,255,255,0.05)', color: '#94A3B8',
                                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                              >
                                <X size={13} />
                              </motion.button>
                            </div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setDeleteConfirm(income.id)}
                              style={{
                                padding: '0.35rem', borderRadius: '0.4rem', border: 'none',
                                background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
