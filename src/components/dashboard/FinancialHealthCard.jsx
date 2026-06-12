import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, CalendarDays, CheckCircle2 } from 'lucide-react';
import useStore from '../../store/useStore';

const FinancialHealthCard = () => {
  const {
    getFinancialHealthScore,
    getRemainingBudget,
    getDaysUntilSalary,
    getDailySpendingLimit,
    getPaidBills,
    bills,
  } = useStore();

  const score = getFinancialHealthScore();
  const remainingBudget = getRemainingBudget();
  const daysUntilSalary = getDaysUntilSalary();
  const dailyLimit = getDailySpendingLimit();
  const paidBills = getPaidBills();
  const totalBills = bills.length;

  // Animate score count-up
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 16;
    const steps = Math.ceil(duration / stepTime);
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Score color
  const getScoreColor = (s) => {
    if (s >= 80) return '#22C55E';
    if (s >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const scoreColor = getScoreColor(score);

  // SVG circle progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  // Border glow based on health
  const glowColor = score >= 80 ? 'rgba(34,197,94,0.3)' : 'rgba(251,191,36,0.3)';

  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
      style={{
        background: 'rgba(30, 30, 60, 0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid rgba(255,255,255,0.1)`,
        boxShadow: `0 0 20px ${glowColor}, 0 8px 32px rgba(0,0,0,0.3)`,
        borderRadius: '1rem',
        padding: '1.5rem',
      }}
    >
      {/* Title */}
      <h2
        className="pixel-text"
        style={{
          fontSize: '1.1rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        ⚔️ Financial Health
      </h2>

      {/* Circular Progress Ring */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', width: '170px', height: '170px' }}>
          <svg
            width="170"
            height="170"
            viewBox="0 0 170 170"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Background circle */}
            <circle
              cx="85"
              cy="85"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="10"
            />
            {/* Progress circle */}
            <motion.circle
              cx="85"
              cy="85"
              r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                filter: `drop-shadow(0 0 6px ${scoreColor})`,
              }}
            />
          </svg>
          {/* Score number in center */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <span
              className="pixel-text"
              style={{
                fontSize: '2.5rem',
                color: scoreColor,
                fontWeight: 'bold',
                lineHeight: 1,
              }}
            >
              {displayScore}
            </span>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
              / 100
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        {/* Remaining Budget */}
        <div
          style={{
            textAlign: 'center',
            padding: '0.75rem 0.5rem',
            borderRadius: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
          }}
        >
          <Wallet size={18} style={{ color: '#22C55E', marginBottom: '0.25rem' }} />
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>
            Balance
          </div>
          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: remainingBudget >= 0 ? '#22C55E' : '#EF4444',
            }}
          >
            {fmt(remainingBudget)}
          </div>
        </div>

        {/* Days Until Salary */}
        <div
          style={{
            textAlign: 'center',
            padding: '0.75rem 0.5rem',
            borderRadius: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
          }}
        >
          <CalendarDays size={18} style={{ color: '#3B82F6', marginBottom: '0.25rem' }} />
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>
            Salary In
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>
            {daysUntilSalary} days
          </div>
        </div>

        {/* Bills Paid */}
        <div
          style={{
            textAlign: 'center',
            padding: '0.75rem 0.5rem',
            borderRadius: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
          }}
        >
          <CheckCircle2 size={18} style={{ color: '#FBBF24', marginBottom: '0.25rem' }} />
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>
            Bills
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>
            {paidBills.length}/{totalBills} paid
          </div>
        </div>
      </div>

      {/* AI Daily Spending Recommendation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{
          padding: '0.75rem 1rem',
          borderRadius: '0.75rem',
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.2)',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#86EFAC',
        }}
      >
        💰 You can safely spend {fmt(dailyLimit)} today
      </motion.div>
    </motion.div>
  );
};

export default FinancialHealthCard;
