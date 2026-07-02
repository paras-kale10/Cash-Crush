import { motion } from 'framer-motion';
import { Plus, TrendingUp, ArrowRight, Zap, Heart, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import FinancialHealthCard from '../components/dashboard/FinancialHealthCard';
import TreasureVaultCard from '../components/dashboard/TreasureVaultCard';
import GoalCard from '../components/dashboard/GoalCard';
import QuickExpenseCard from '../components/dashboard/QuickExpenseCard';
import AIInsightsCard from '../components/dashboard/AIInsightsCard';
import BillsSummaryCard from '../components/dashboard/BillsSummaryCard';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const monthlyIncome = useStore((s) => s.monthlyIncome);
  const bills = useStore((s) => s.bills);
  const expenses = useStore((s) => s.expenses);
  const vault = useStore((s) => s.vault);
  const getRemainingBudget = useStore((s) => s.getRemainingBudget);

  const remaining = getRemainingBudget();
  const savingsRate = monthlyIncome > 0 ? (remaining / monthlyIncome * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '1rem',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: '#F8FAFC', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
                Welcome back, {user?.username || 'Adventurer'}! 👋
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '1rem' }}>
                You're doing great with your finances. Keep up the momentum!
              </p>
            </div>
            <div style={{ fontSize: '3rem' }}>
              {user?.level >= 7 ? '👑' : user?.level >= 5 ? '💎' : user?.level >= 3 ? '🥇' : '🏅'}
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <p style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Level</p>
              <p style={{ color: '#10B981', fontWeight: 700, fontSize: '1.5rem' }}>{user?.level || 1}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} style={{ background: 'rgba(212, 160, 23, 0.1)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(212, 160, 23, 0.2)' }}>
              <p style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>XP Points</p>
              <p style={{ color: '#D4A017', fontWeight: 700, fontSize: '1.5rem' }}>{user?.xp || 0}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <p style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Remaining</p>
              <p style={{ color: remaining >= 0 ? '#10B981' : '#EF4444', fontWeight: 700, fontSize: '1.5rem' }}>₹{Math.abs(remaining).toLocaleString('en-IN')}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <p style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Savings Rate</p>
              <p style={{ color: '#3B82F6', fontWeight: 700, fontSize: '1.5rem' }}>{savingsRate.toFixed(1)}%</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Quick Action Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate('/expenses')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)',
            color: '#EF4444',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.15) 100%)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Plus size={24} />
          Add Expense
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          onClick={() => navigate('/income')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
            color: '#10B981',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.15) 100%)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Wallet size={24} />
          Add Money
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => navigate('/vault')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.2) 0%, rgba(212, 160, 23, 0.1) 100%)',
            color: '#D4A017',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 160, 23, 0.3) 0%, rgba(212, 160, 23, 0.15) 100%)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(212, 160, 23, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 160, 23, 0.2) 0%, rgba(212, 160, 23, 0.1) 100%)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Heart size={24} />
          Add to Vault
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/bills')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
            color: '#3B82F6',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.15) 100%)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Zap size={24} />
          Pay Bills
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => navigate('/analytics')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
            color: '#8B5CF6',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.15) 100%)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <TrendingUp size={24} />
          View Analytics
        </motion.button>
      </div>

      {/* Main Cards Grid */}
      <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: '#F8FAFC', marginTop: '1rem' }}>Financial Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <FinancialHealthCard />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <TreasureVaultCard />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <QuickExpenseCard />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <BillsSummaryCard />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GoalCard />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <AIInsightsCard />
        </motion.div>
      </div>
    </div>
  );
}
