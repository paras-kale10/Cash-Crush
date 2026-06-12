import { motion } from 'framer-motion';
import { Trophy, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

const GoalCard = () => {
  const goals = useStore((state) => state.goals);
  const vault = useStore((state) => state.vault);

  const goal = goals.length > 0 ? goals[0] : null;

  // Calculate progress
  const progress = goal && goal.targetAmount > 0
    ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
    : 0;

  // Estimate completion from monthly savings rate
  const getEstimatedCompletion = () => {
    if (!goal) return '';
    const remaining = goal.targetAmount - goal.currentAmount;
    if (remaining <= 0) return 'Completed! 🎉';
    const monthlySavings = vault.monthlyContribution || 0;
    if (monthlySavings <= 0) return 'Set savings to estimate';
    const monthsLeft = Math.ceil(remaining / monthlySavings);
    if (monthsLeft <= 1) return 'Less than a month!';
    if (monthsLeft <= 12) return `~${monthsLeft} months`;
    const years = Math.floor(monthsLeft / 12);
    const months = monthsLeft % 12;
    return `~${years}y ${months}m`;
  };

  // Treasure chest fill color
  const chestFillColor = progress >= 80
    ? 'linear-gradient(to top, #FFD700, #FBBF24)'
    : progress >= 40
      ? 'linear-gradient(to top, #DAA520, #F59E0B)'
      : 'linear-gradient(to top, #92400E, #B8860B)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{
        padding: '1.5rem',
        borderRadius: '1rem',
        cursor: 'default',
      }}
    >
      <h2
        className="pixel-text"
        style={{
          fontSize: '1.1rem',
          marginBottom: '1.25rem',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        🎯 Goal Quest
      </h2>

      {goal ? (
        <>
          {/* Goal Name */}
          <div
            style={{
              textAlign: 'center',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#E2E8F0',
              marginBottom: '1rem',
            }}
          >
            {goal.name}
          </div>

          {/* Treasure Chest Visual */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div
              style={{
                position: 'relative',
                width: '80px',
                height: '70px',
                borderRadius: '8px',
                border: '3px solid #92400E',
                background: 'rgba(30,30,60,0.6)',
                overflow: 'hidden',
              }}
            >
              {/* Chest lid */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '18px',
                  background: 'linear-gradient(to bottom, #B8860B, #92400E)',
                  borderBottom: '2px solid #704214',
                  borderRadius: '5px 5px 0 0',
                  zIndex: 2,
                }}
              />
              {/* Fill based on progress */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: chestFillColor,
                  borderRadius: '0 0 5px 5px',
                }}
              />
              {/* Chest lock */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3,
                  fontSize: '1.2rem',
                }}
              >
                {progress >= 100 ? '✨' : '🔒'}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.35rem',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              <span>Progress</span>
              <span style={{ color: '#FBBF24', fontWeight: 'bold' }}>{progress}%</span>
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
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                style={{
                  height: '100%',
                  borderRadius: '4px',
                  background: progress >= 80
                    ? 'linear-gradient(90deg, #22C55E, #4ADE80)'
                    : 'linear-gradient(90deg, #F59E0B, #FBBF24)',
                  boxShadow: '0 0 8px rgba(251,191,36,0.4)',
                }}
              />
            </div>
          </div>

          {/* Amount */}
          <div
            style={{
              textAlign: 'center',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '0.5rem',
            }}
          >
            <span style={{ color: '#FBBF24', fontWeight: 'bold' }}>
              {fmt(goal.currentAmount)}
            </span>
            {' / '}
            <span>{fmt(goal.targetAmount)}</span>
          </div>

          {/* Estimated Completion */}
          <div
            style={{
              textAlign: 'center',
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.4)',
              fontStyle: 'italic',
            }}
          >
            Est. completion: {getEstimatedCompletion()}
          </div>
        </>
      ) : (
        /* No Goals - Create Prompt */
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🏴‍☠️</div>
          <div
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#E2E8F0',
              marginBottom: '0.5rem',
            }}
          >
            Set Your First Goal
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '1.25rem',
            }}
          >
            Start a quest to save for something special!
          </div>
          <Link to="/goals" style={{ textDecoration: 'none' }}>
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              Create Goal
            </motion.button>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default GoalCard;
