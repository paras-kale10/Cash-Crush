import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, CheckCircle2, CircleDollarSign, Trash2, ArrowRightLeft } from 'lucide-react';
import useStore from '../store/useStore';
import { buildSplitShareData, summarizeSplitEntries } from '../utils/splitUtils';

const createDefaultPerson = (name = '', share = 0) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: name.trim(),
  share: Number(share) || 0,
  isSettled: false,
  note: '',
});

export default function SplitPage() {
  const splitEntries = useStore((s) => s.splitEntries) || [];
  const addSplitEntry = useStore((s) => s.addSplitEntry);
  const updateSplitEntry = useStore((s) => s.updateSplitEntry);
  const deleteSplitEntry = useStore((s) => s.deleteSplitEntry);
  const markSplitEntrySettled = useStore((s) => s.markSplitEntrySettled);

  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [peopleInput, setPeopleInput] = useState('');
  const [showForm, setShowForm] = useState(false);

  const summary = useMemo(() => summarizeSplitEntries(splitEntries), [splitEntries]);

  const handleCreateSplit = (e) => {
    e.preventDefault();
    const parsedAmount = Number(totalAmount);
    const people = peopleInput
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);

    if (!title.trim()) {
      alert('Please give this split a name');
      return;
    }
    if (!parsedAmount || parsedAmount <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }
    if (people.length === 0) {
      alert('Please add at least one friend');
      return;
    }

    const shareData = buildSplitShareData(parsedAmount, people);

    addSplitEntry({
      title: title.trim(),
      totalAmount: parsedAmount,
      description: '',
      people: shareData.entries.map((entry) => ({ ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` })),
      createdAt: new Date().toISOString(),
    });

    setTitle('');
    setTotalAmount('');
    setPeopleInput('');
    setShowForm(false);
  };

  const handleMarkSettled = (entryId, personId) => {
    markSplitEntrySettled(entryId, personId);
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.75rem', color: '#F8FAFC' }}>
            Split Money Tracker
          </h1>
          <p style={{ color: '#94A3B8', marginTop: '0.35rem' }}>
            Track who paid for what, who owes you, and what is already settled.
          </p>
        </div>
        <button onClick={() => setShowForm((value) => !value)} className="btn-primary" style={{ padding: '0.75rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} />
          {showForm ? 'Close' : 'New Split'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <motion.div className="card" style={{ padding: '1rem' }}>
          <p style={{ color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Tracked Amount</p>
          <p style={{ color: '#10B981', fontSize: '1.3rem', fontWeight: 700 }}>₹{summary.totalTracked.toLocaleString('en-IN')}</p>
        </motion.div>
        <motion.div className="card" style={{ padding: '1rem' }}>
          <p style={{ color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Settled</p>
          <p style={{ color: '#3B82F6', fontSize: '1.3rem', fontWeight: 700 }}>₹{summary.settledAmount.toLocaleString('en-IN')}</p>
        </motion.div>
        <motion.div className="card" style={{ padding: '1rem' }}>
          <p style={{ color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Still Pending</p>
          <p style={{ color: '#F59E0B', fontSize: '1.3rem', fontWeight: 700 }}>₹{summary.pendingAmount.toLocaleString('en-IN')}</p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} onSubmit={handleCreateSplit} className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <div>
                <label style={{ display: 'block', color: '#94A3B8', marginBottom: '0.35rem' }}>Split name</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Dinner with friends" style={inputStyle} required />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94A3B8', marginBottom: '0.35rem' }}>Total amount (₹)</label>
                <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="500" min="1" style={inputStyle} required />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94A3B8', marginBottom: '0.35rem' }}>Friends (comma separated)</label>
                <input type="text" value={peopleInput} onChange={(e) => setPeopleInput(e.target.value)} placeholder="Ava, Noah, Mia" style={inputStyle} required />
              </div>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.75rem' }}>
              The app will automatically calculate an even split and show each person’s share.
            </p>
            <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '0.75rem 1.2rem' }}>
              Save split
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {splitEntries.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <Users size={48} color="#334155" style={{ marginBottom: '0.75rem' }} />
          <p style={{ color: '#64748B' }}>No splits yet. Add your first shared bill and track who owes you.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {splitEntries.map((entry) => (
            <motion.div key={entry.id} className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ color: '#F8FAFC', marginBottom: '0.25rem' }}>{entry.title}</h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Total: ₹{Number(entry.totalAmount || 0).toLocaleString('en-IN')}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981' }}>
                  <CircleDollarSign size={18} />
                  <span>{entry.people?.length || 0} people</span>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                {entry.people?.map((person) => (
                  <div key={person.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', borderRadius: '0.85rem', background: '#111827', border: person.isSettled ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(51,65,85,0.8)' }}>
                    <div>
                      <div style={{ color: '#F8FAFC', fontWeight: 600 }}>{person.name}</div>
                      <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Share: ₹{Number(person.share || 0).toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button onClick={() => handleMarkSettled(entry.id, person.id)} style={{ padding: '0.45rem 0.7rem', borderRadius: '0.6rem', border: 'none', background: person.isSettled ? '#10B981' : '#334155', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {person.isSettled ? <CheckCircle2 size={16} /> : <ArrowRightLeft size={16} />}
                        {person.isSettled ? 'Settled' : 'Mark paid'}
                      </button>
                      <button onClick={() => deleteSplitEntry(entry.id)} style={{ padding: '0.45rem', borderRadius: '0.6rem', border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
