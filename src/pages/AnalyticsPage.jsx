import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, Wallet, PiggyBank, Target } from 'lucide-react';
import useStore from '../store/useStore';
import { getWeeklySpendingData, getDailySpendingData } from '../utils/insights';
import { getCategoryColor } from '../utils/categorizer';

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
          border: '1.5px solid #374151',
          borderRadius: '0.75rem',
          padding: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {label && <p style={{ color: '#9CA3AF', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 500 }}>{label}</p>}
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color || '#F3F4F6', fontSize: '0.85rem', fontWeight: 700 }}>
            {entry.name}: ₹{parseFloat(entry.value).toLocaleString('en-IN')}
          </p>
        ))}
      </motion.div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
          border: '1.5px solid #374151',
          borderRadius: '0.75rem',
          padding: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <p style={{ color: '#F3F4F6', fontSize: '0.85rem', fontWeight: 700 }}>
          {data.name}: ₹{parseFloat(data.value).toLocaleString('en-IN')}
        </p>
        <p style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: '0.25rem' }}>
          {((data.value / (payload[0].payload._total || 1)) * 100).toFixed(1)}%
        </p>
      </motion.div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const expenses = useStore((s) => s.expenses) || [];
  const monthlyIncome = useStore((s) => s.monthlyIncome) || 0;
  const vault = useStore((s) => s.vault);
  const getExpensesByCategory = useStore((s) => s.getExpensesByCategory);

  const totalSpent = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const totalSaved = vault?.total ?? 0;
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - totalSpent) / monthlyIncome * 100) : 0;

  // Category data for PieChart
  const categoryData = useMemo(() => {
    if (getExpensesByCategory) {
      const data = getExpensesByCategory();
      if (Array.isArray(data)) return data;
      // If it's an object { category: amount }
      return Object.entries(data).map(([name, value]) => ({ name, value }));
    }
    // Fallback: compute manually
    const catTotals = {};
    expenses.forEach((e) => {
      const cat = e.category || 'Others';
      catTotals[cat] = (catTotals[cat] || 0) + (parseFloat(e.amount) || 0);
    });
    return Object.entries(catTotals).map(([name, value]) => ({ name, value }));
  }, [expenses, getExpensesByCategory]);

  // Weekly spending data
  const weeklyData = useMemo(() => {
    if (getWeeklySpendingData) {
      return getWeeklySpendingData(expenses);
    }
    return [];
  }, [expenses]);

  // Daily spending data
  const dailyData = useMemo(() => {
    if (getDailySpendingData) {
      return getDailySpendingData(expenses);
    }
    return [];
  }, [expenses]);

  return (
    <div style={{ padding: '0' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            marginBottom: '0.5rem',
            color: '#F8FAFC',
            letterSpacing: '-0.5px',
          }}
        >
          Analytics Dashboard
        </motion.h1>
        <div style={{ height: '3px', width: '60px', background: 'linear-gradient(90deg, #3B82F6, #10B981)', borderRadius: '2px' }}></div>
      </div>

      {/* Summary Cards - Enhanced */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem',
      }}>
        {/* Income Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
            border: '1px solid #374151',
            borderRadius: '1rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(16, 185, 129, 0.2)' }}
        >
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
            <Wallet size={100} color="#10B981" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Wallet size={24} color="#fff" />
            </div>
            <div>
              <p style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Income</p>
              <p style={{ color: '#10B981', fontWeight: 700, fontSize: '1.5rem', marginTop: '0.25rem' }}>
                ₹{monthlyIncome.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Your regular monthly earnings</p>
        </motion.div>

        {/* Spending Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
            border: '1px solid #374151',
            borderRadius: '1rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(239, 68, 68, 0.2)' }}
        >
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
            <TrendingUp size={100} color="#EF4444" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TrendingUp size={24} color="#fff" />
            </div>
            <div>
              <p style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Spent</p>
              <p style={{ color: '#EF4444', fontWeight: 700, fontSize: '1.5rem', marginTop: '0.25rem' }}>
                ₹{totalSpent.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Amount spent this month</p>
        </motion.div>

        {/* Savings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
            border: '1px solid #374151',
            borderRadius: '1rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(217, 119, 6, 0.2)' }}
        >
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
            <PiggyBank size={100} color="#D97706" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <PiggyBank size={24} color="#fff" />
            </div>
            <div>
              <p style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Saved</p>
              <p style={{ color: '#D97706', fontWeight: 700, fontSize: '1.5rem', marginTop: '0.25rem' }}>
                ₹{totalSaved.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Your treasure vault balance</p>
        </motion.div>

        {/* Savings Rate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
            border: '1px solid #374151',
            borderRadius: '1rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(59, 130, 246, 0.2)' }}
        >
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
            <Target size={100} color="#3B82F6" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Target size={24} color="#fff" />
            </div>
            <div>
              <p style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Savings Rate</p>
              <p style={{
                color: savingsRate >= 20 ? '#10B981' : savingsRate >= 0 ? '#F59E0B' : '#EF4444',
                fontWeight: 700,
                fontSize: '1.5rem',
                marginTop: '0.25rem'
              }}>
                {savingsRate.toFixed(1)}%
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Percentage of income saved</p>
        </motion.div>
      </div>

      {/* Charts Grid - Improved */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem',
      }}>
        {/* Chart 1: Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
            border: '1px solid #374151',
            borderRadius: '1rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}
        >
          <h3 style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: '1.1rem',
            color: '#F8FAFC',
            marginBottom: '1.5rem',
            letterSpacing: '-0.3px',
          }}>
            Category Breakdown
          </h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getCategoryColor ? getCategoryColor(entry.name) : CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Legend
                  wrapperStyle={{ paddingTop: '1rem', color: '#9CA3AF', fontSize: '0.8rem' }}
                  formatter={(value) => <span style={{ color: '#D1D5DB' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              fontSize: '0.95rem',
            }}>
              No expense data yet
            </div>
          )}
        </motion.div>

        {/* Chart 2: Weekly Spending Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
            border: '1px solid #374151',
            borderRadius: '1rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}
        >
          <h3 style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: '1.1rem',
            color: '#F8FAFC',
            marginBottom: '1.5rem',
            letterSpacing: '-0.3px',
          }}>
            Weekly Spending Trend
          </h3>
          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" opacity={0.3} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#374151', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10B981"
                  fill="url(#weeklyGradient)"
                  strokeWidth={3}
                  name="Spending"
                  dot={{ fill: '#10B981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              fontSize: '0.95rem',
            }}>
              No weekly data yet
            </div>
          )}
        </motion.div>

        {/* Chart 3: Daily Spending */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
            border: '1px solid #374151',
            borderRadius: '1rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            gridColumn: '1 / -1',
          }}
        >
          <h3 style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: '1.1rem',
            color: '#F8FAFC',
            marginBottom: '1.5rem',
            letterSpacing: '-0.3px',
          }}>
            Daily Spending
          </h3>
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={1} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" opacity={0.3} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                <Bar
                  dataKey="amount"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  name="Spent"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              fontSize: '0.95rem',
            }}>
              No daily data yet
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
