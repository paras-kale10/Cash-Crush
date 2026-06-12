import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Pencil, Trash2, X, Save, FileText, CreditCard } from 'lucide-react';
import useStore from '../store/useStore';

const CATEGORIES = ['Rent', 'Food', 'Electricity', 'Internet', 'Transport', 'Insurance', 'Other'];

export default function BillsPage() {
  const bills = useStore((s) => s.bills) || [];
  const addBill = useStore((s) => s.addBill);
  const toggleBillPaid = useStore((s) => s.toggleBillPaid);
  const deleteBill = useStore((s) => s.deleteBill);
  const updateBill = useStore((s) => s.updateBill);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Other');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const paidCount = bills.filter((b) => b.isPaid).length;
  const pendingCount = bills.filter((b) => !b.isPaid).length;
  const totalAmount = bills.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);

  const sortedBills = [...bills].sort((a, b) => {
    if (a.isPaid !== b.isPaid) return a.isPaid ? 1 : -1;
    return (a.dueDate || 0) - (b.dueDate || 0);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const parsedAmount = parseFloat(amount);
    const parsedDate = parseInt(dueDate) || 1;
    
    // Validation
    if (!trimmedName) {
      alert('Please enter a bill name');
      return;
    }
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }
    if (parsedDate < 1 || parsedDate > 31) {
      alert('Due date must be between 1 and 31');
      return;
    }
    
    addBill({ name: trimmedName, amount: parsedAmount, dueDate: parsedDate, category });
    setName('');
    setAmount('');
    setDueDate('');
    setCategory('Other');
    setShowForm(false);
  };

  const startEdit = (bill) => {
    setEditingId(bill.id);
    setEditData({ name: bill.name, amount: bill.amount, dueDate: bill.dueDate, category: bill.category });
  };

  const saveEdit = (id) => {
    if (updateBill) {
      updateBill(id, editData);
    }
    setEditingId(null);
    setEditData({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      deleteBill(id);
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
          Bills Management
        </h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ background: '#064E3B', color: '#10B981', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
            {paidCount} Paid
          </span>
          <span style={{ background: '#7F1D1D', color: '#EF4444', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
            {pendingCount} Pending
          </span>
          <span style={{ background: '#1E293B', color: '#CBD5E1', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
            Total ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Add Bill Toggle */}
      <motion.div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            color: '#3B82F6',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          <Plus size={20} />
          {showForm ? 'Close Form' : 'Add New Bill'}
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
                  <label style={labelStyle}>Bill Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Electricity"
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Due Date (Day 1-31)</label>
                  <input
                    type="number"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder="1-31"
                    min="1"
                    max="31"
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} />
                Add Bill
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bills Grid */}
      {sortedBills.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <FileText size={48} color="#334155" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#64748B', fontSize: '1.1rem' }}>No bills added yet. Add your first bill above!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <AnimatePresence>
            {sortedBills.map((bill) => (
              <motion.div
                key={bill.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="card"
                style={{
                  padding: '1.25rem',
                  borderLeft: `4px solid ${bill.isPaid ? '#10B981' : '#EF4444'}`,
                }}
              >
                {editingId === bill.id ? (
                  /* Edit Mode */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      style={inputStyle}
                    />
                    <input
                      type="number"
                      value={editData.amount}
                      onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
                      style={inputStyle}
                    />
                    <input
                      type="number"
                      value={editData.dueDate}
                      onChange={(e) => setEditData({ ...editData, dueDate: parseInt(e.target.value) })}
                      min="1"
                      max="31"
                      style={inputStyle}
                    />
                    <select
                      value={editData.category}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                      style={inputStyle}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => saveEdit(bill.id)} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: 'none', background: '#10B981', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                        <Save size={16} /> Save
                      </button>
                      <button onClick={cancelEdit} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: 'none', background: '#64748B', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '1.1rem', color: '#F8FAFC', marginBottom: '0.25rem' }}>
                          {bill.name}
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', background: '#1E293B', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                          {bill.category}
                        </span>
                      </div>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: bill.isPaid ? '#064E3B' : '#7F1D1D',
                        color: bill.isPaid ? '#10B981' : '#EF4444',
                      }}>
                        {bill.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>

                    <p style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                      ₹{parseFloat(bill.amount).toLocaleString('en-IN')}
                    </p>
                    <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      Due Date: Day {bill.dueDate}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => toggleBillPaid(bill.id)}
                        title={bill.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          background: bill.isPaid ? '#064E3B' : '#1E293B',
                          color: bill.isPaid ? '#10B981' : '#94A3B8',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => startEdit(bill)}
                        title="Edit"
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          background: '#1E293B',
                          color: '#3B82F6',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        title="Delete"
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          background: '#1E293B',
                          color: '#EF4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
