import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Search, Filter, Trash2, Edit, Plus, X, Save } from 'lucide-react';
import useStore from '../store/useStore';
import { categorizeExpense, getCategoryEmoji, getCategoryColor, getAllCategories } from '../utils/categorizer';

export default function ExpensesPage() {
  const expenses = useStore((s) => s.expenses) || [];
  const addExpense = useStore((s) => s.addExpense);
  const deleteExpense = useStore((s) => s.deleteExpense);
  const updateExpense = useStore((s) => s.updateExpense);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [autoCategorize, setAutoCategorize] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const allCategories = getAllCategories ? getAllCategories() : ['Food', 'Transport', 'Entertainment', 'Shopping', 'Education', 'Health', 'Bills', 'Others'];

  // Auto-detect category when name changes
  const detectedCategory = useMemo(() => {
    if (name.trim() && autoCategorize && categorizeExpense) {
      return categorizeExpense(name);
    }
    return '';
  }, [name, autoCategorize]);

  const effectiveCategory = category || detectedCategory || 'Others';

  // Current month expenses
  const now = new Date();
  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date || e.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalThisMonth = currentMonthExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const avgPerDay = dayOfMonth > 0 ? totalThisMonth / dayOfMonth : 0;

  const topCategory = useMemo(() => {
    const catTotals = {};
    currentMonthExpenses.forEach((e) => {
      const cat = e.category || 'Others';
      catTotals[cat] = (catTotals[cat] || 0) + (parseFloat(e.amount) || 0);
    });
    let top = 'None';
    let max = 0;
    Object.entries(catTotals).forEach(([cat, total]) => {
      if (total > max) {
        max = total;
        top = cat;
      }
    });
    return top;
  }, [currentMonthExpenses]);

  // Filtered and sorted expenses
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];
    if (filterCategory !== 'All') {
      result = result.filter((e) => e.category === filterCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) => (e.name || '').toLowerCase().includes(q) || (e.notes || '').toLowerCase().includes(q));
    }
    result.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
    return result;
  }, [expenses, filterCategory, searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const parsedAmount = parseFloat(amount);
    
    // Validation
    if (!trimmedName) {
      alert('Please enter an expense name');
      return;
    }
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }
    
    addExpense({
      name: trimmedName,
      amount: parsedAmount,
      category: effectiveCategory,
      notes: notes.trim(),
    });
    setName('');
    setAmount('');
    setCategory('');
    setNotes('');
    setShowForm(false);
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditData({ name: expense.name, amount: expense.amount, category: expense.category, notes: expense.notes || '' });
  };

  const saveEdit = (id) => {
    if (updateExpense) {
      updateExpense(id, editData);
    }
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this expense?')) {
      deleteExpense(id);
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
          Expense Tracker
        </h1>
        <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
          Total this month: <strong style={{ color: '#EF4444' }}>₹{totalThisMonth.toLocaleString('en-IN')}</strong>
        </span>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <CreditCard size={24} color="#EF4444" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Total This Month</p>
          <p style={{ color: '#EF4444', fontWeight: 700, fontSize: '1.25rem' }}>₹{totalThisMonth.toLocaleString('en-IN')}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <CreditCard size={24} color="#3B82F6" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Average Per Day</p>
          <p style={{ color: '#3B82F6', fontWeight: 700, fontSize: '1.25rem' }}>₹{Math.round(avgPerDay).toLocaleString('en-IN')}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <CreditCard size={24} color="#D4A017" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Top Category</p>
          <p style={{ color: '#D4A017', fontWeight: 700, fontSize: '1.1rem' }}>
            {getCategoryEmoji ? getCategoryEmoji(topCategory) : ''} {topCategory}
          </p>
        </motion.div>
      </div>

      {/* Add Expense Form */}
      <motion.div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div
          onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#10B981', fontWeight: 600, fontSize: '1rem' }}
        >
          <Plus size={20} />
          {showForm ? 'Close' : 'Add New Expense'}
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
                  <label style={labelStyle}>Expense Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Coffee" style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Amount (₹)</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" min="1" style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>
                    Category
                    {autoCategorize && detectedCategory && (
                      <span style={{ color: '#10B981', marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                        Auto: {getCategoryEmoji ? getCategoryEmoji(detectedCategory) : ''} {detectedCategory}
                      </span>
                    )}
                  </label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                    <option value="">{autoCategorize && detectedCategory ? `Auto: ${detectedCategory}` : 'Select category'}</option>
                    {allCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Notes</label>
                  <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={autoCategorize}
                    onChange={(e) => setAutoCategorize(e.target.checked)}
                    style={{ accentColor: '#10B981' }}
                  />
                  Auto-categorize
                </label>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} />
                Add Expense
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={18} color="#64748B" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expenses..."
            style={{ ...inputStyle, paddingLeft: '2.5rem' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="#64748B" />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
            <option value="All">All Categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expense List */}
      {filteredExpenses.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <CreditCard size={48} color="#334155" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#64748B', fontSize: '1.1rem' }}>
            {expenses.length === 0 ? 'No expenses yet. Start tracking!' : 'No expenses match your filter.'}
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1E293B' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8', fontWeight: 600, fontSize: '0.8rem' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8', fontWeight: 600, fontSize: '0.8rem' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8', fontWeight: 600, fontSize: '0.8rem' }}>Category</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', color: '#94A3B8', fontWeight: 600, fontSize: '0.8rem' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#94A3B8', fontWeight: 600, fontSize: '0.8rem' }}>Notes</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: '#94A3B8', fontWeight: 600, fontSize: '0.8rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredExpenses.map((expense) => (
                  <motion.tr
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    style={{ borderBottom: '1px solid #1E293B' }}
                  >
                    {editingId === expense.id ? (
                      <>
                        <td style={{ padding: '0.5rem' }}>
                          {new Date(expense.date || expense.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} style={{ ...inputStyle, padding: '0.4rem 0.5rem', fontSize: '0.85rem' }} />
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <select value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} style={{ ...inputStyle, padding: '0.4rem 0.5rem', fontSize: '0.85rem' }}>
                            {allCategories.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <input type="number" value={editData.amount} onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })} style={{ ...inputStyle, padding: '0.4rem 0.5rem', fontSize: '0.85rem', textAlign: 'right' }} />
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <input type="text" value={editData.notes} onChange={(e) => setEditData({ ...editData, notes: e.target.value })} style={{ ...inputStyle, padding: '0.4rem 0.5rem', fontSize: '0.85rem' }} />
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                            <button onClick={() => saveEdit(expense.id)} style={{ padding: '0.35rem', borderRadius: '0.35rem', border: 'none', background: '#10B981', color: '#fff', cursor: 'pointer' }}>
                              <Save size={14} />
                            </button>
                            <button onClick={() => { setEditingId(null); setEditData({}); }} style={{ padding: '0.35rem', borderRadius: '0.35rem', border: 'none', background: '#64748B', color: '#fff', cursor: 'pointer' }}>
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '0.75rem', color: '#CBD5E1', fontSize: '0.85rem' }}>
                          {new Date(expense.date || expense.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#F8FAFC', fontWeight: 500, fontSize: '0.9rem' }}>
                          {expense.name}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '1rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: `${getCategoryColor ? getCategoryColor(expense.category) : '#3B82F6'}22`,
                            color: getCategoryColor ? getCategoryColor(expense.category) : '#3B82F6',
                          }}>
                            {getCategoryEmoji ? getCategoryEmoji(expense.category) : ''} {expense.category}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', color: '#EF4444', fontWeight: 600, fontSize: '0.9rem' }}>
                          ₹{parseFloat(expense.amount).toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#94A3B8', fontSize: '0.8rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {expense.notes || '—'}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                            <button
                              onClick={() => startEdit(expense)}
                              title="Edit"
                              style={{ padding: '0.35rem', borderRadius: '0.35rem', border: 'none', background: 'transparent', color: '#3B82F6', cursor: 'pointer' }}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(expense.id)}
                              title="Delete"
                              style={{ padding: '0.35rem', borderRadius: '0.35rem', border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
