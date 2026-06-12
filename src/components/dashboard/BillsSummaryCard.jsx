import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';

const BillsSummaryCard = () => {
  const bills = useStore((state) => state.bills);
  const toggleBillPaid = useStore((state) => state.toggleBillPaid);
  const [coinAnimId, setCoinAnimId] = useState(null);

  const paidCount = bills.filter((b) => b.isPaid).length;
  const totalCount = bills.length;
  const progressPercent = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;

  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

  const handleMarkPaid = (id) => {
    toggleBillPaid(id);
    setCoinAnimId(id);
    setTimeout(() => setCoinAnimId(null), 800);
  };

  // Get status badge for a bill
  const getStatusBadge = (bill) => {
    if (bill.isPaid) {
      return (
        <span
          className="badge-green"
          style={{
            padding: '0.15rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.65rem',
            fontWeight: '600',
            background: 'rgba(34,197,94,0.15)',
            color: '#4ADE80',
            border: '1px solid rgba(34,197,94,0.3)',
          }}
        >
          Paid
        </span>
      );
    }

    const now = new Date();
    const dueDay = Number(bill.dueDate);
    const daysDiff = dueDay - now.getDate();

    const isOverdue = daysDiff < 0;
    const isUrgent = daysDiff >= 0 && daysDiff <= 3;

    const badgeColor = isOverdue
      ? { bg: 'rgba(239,68,68,0.15)', text: '#F87171', border: 'rgba(239,68,68,0.3)' }
      : isUrgent
        ? { bg: 'rgba(245,158,11,0.15)', text: '#FBBF24', border: 'rgba(245,158,11,0.3)' }
        : { bg: 'rgba(239,68,68,0.1)', text: '#F87171', border: 'rgba(239,68,68,0.2)' };

    return (
      <span
        className={isOverdue || isUrgent ? 'badge-red' : 'badge-yellow'}
        style={{
          padding: '0.15rem 0.5rem',
          borderRadius: '9999px',
          fontSize: '0.65rem',
          fontWeight: '600',
          background: badgeColor.bg,
          color: badgeColor.text,
          border: `1px solid ${badgeColor.border}`,
        }}
      >
        {isOverdue ? 'Overdue' : `Due on ${dueDay}`}
      </span>
    );
  };

  const displayBills = bills.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="card"
      style={{
        padding: '1.5rem',
        borderRadius: '1rem',
      }}
    >
      {/* Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        <Receipt size={20} style={{ color: '#6366F1' }} />
        <h2
          className="pixel-text"
          style={{ fontSize: '1rem', color: '#fff', margin: 0 }}
        >
          Bills This Month
        </h2>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.35rem',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          <span>
            {paidCount} of {totalCount} paid
          </span>
          <span style={{ color: '#22C55E', fontWeight: 'bold' }}>{progressPercent}%</span>
        </div>
        <div
          style={{
            height: '8px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              height: '100%',
              borderRadius: '4px',
              background:
                progressPercent === 100
                  ? 'linear-gradient(90deg, #22C55E, #4ADE80)'
                  : 'linear-gradient(90deg, #6366F1, #8B5CF6)',
              boxShadow: '0 0 8px rgba(99,102,241,0.4)',
            }}
          />
        </div>
      </div>

      {/* Bills List */}
      {displayBills.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          {displayBills.map((bill) => (
            <div
              key={bill.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.75rem',
                borderRadius: '0.5rem',
                background: 'rgba(255,255,255,0.04)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: '#E2E8F0',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {bill.name}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '0.2rem',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                    {fmt(bill.amount)}
                  </span>
                  {getStatusBadge(bill)}
                </div>
              </div>

              {/* Mark Paid button for unpaid bills */}
              {!bill.isPaid && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleMarkPaid(bill.id)}
                  style={{
                    marginLeft: '0.5rem',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '0.4rem',
                    border: '1px solid rgba(34,197,94,0.3)',
                    background: 'rgba(34,197,94,0.1)',
                    color: '#4ADE80',
                    fontSize: '0.65rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle size={12} />
                  Pay
                </motion.button>
              )}

              {/* Coin animation on mark paid */}
              <AnimatePresence>
                {coinAnimId === bill.id && (
                  <motion.span
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -30, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    style={{
                      position: 'absolute',
                      top: '20%',
                      right: '15%',
                      fontSize: '1.3rem',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  >
                    🪙
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '1.5rem 0',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
          }}
        >
          No bills added yet
        </div>
      )}

      {/* View All Bills Link */}
      <Link
        to="/bills"
        style={{
          display: 'block',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#818CF8',
          textDecoration: 'none',
          fontWeight: '600',
        }}
      >
        View All Bills →
      </Link>
    </motion.div>
  );
};

export default BillsSummaryCard;
