import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Coins,
  Wallet,
  Shield,
  Receipt,
  BarChart3,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import useStore from '../store/useStore';
import { AVATAR_OPTIONS } from '../utils/avatars';

const TOTAL_STEPS = 5;

const STEPS = [
  { icon: Coins, label: 'Avatar', color: '#FBBF24' },
  { icon: Wallet, label: 'Income', color: '#3B82F6' },
  { icon: Shield, label: 'Vault', color: '#10B981' },
  { icon: Receipt, label: 'Bills', color: '#F97316' },
  { icon: BarChart3, label: 'Summary', color: '#A78BFA' },
];

const avatars = AVATAR_OPTIONS;

const SALARY_DATE_PRESETS = [1, 5, 10, 15, 25, 31];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 280 : -280,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({
    x: direction < 0 ? 280 : -280,
    opacity: 0,
  }),
};

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

/* ───────── Background ───────── */
const BackgroundOrbs = () => (
  <>
    <motion.div
      className="onboarding-orb"
      style={{ width: 420, height: 420, background: 'rgba(251,191,36,0.18)', top: '-10%', left: '-8%' }}
      animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="onboarding-orb"
      style={{ width: 360, height: 360, background: 'rgba(16,185,129,0.14)', bottom: '5%', right: '-6%' }}
      animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="onboarding-orb"
      style={{ width: 280, height: 280, background: 'rgba(59,130,246,0.12)', top: '40%', right: '20%' }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.35,
        pointerEvents: 'none',
      }}
    />
  </>
);

/* ───────── Progress ───────── */
const ProgressBar = ({ currentStep }) => {
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;
  const current = STEPS[currentStep];

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Step {currentStep + 1} of {TOTAL_STEPS}
        </span>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: current.color }}>
          {current.label}
        </span>
      </div>

      <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: '1.25rem' }}>
        <motion.div
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            height: '100%',
            borderRadius: 999,
            background: `linear-gradient(90deg, ${current.color}, #FBBF24)`,
            boxShadow: `0 0 12px ${current.color}66`,
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentStep;
          const isDone = i < currentStep;
          return (
            <motion.div
              key={step.label}
              animate={{ scale: isActive ? 1.08 : 1 }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive
                    ? `linear-gradient(135deg, ${step.color}, ${step.color}99)`
                    : isDone
                      ? 'rgba(16,185,129,0.2)'
                      : 'rgba(255,255,255,0.04)',
                  border: isActive
                    ? `2px solid ${step.color}`
                    : isDone
                      ? '2px solid rgba(16,185,129,0.5)'
                      : '2px solid rgba(255,255,255,0.08)',
                  boxShadow: isActive ? `0 0 20px ${step.color}44` : 'none',
                }}
              >
                <Icon size={16} color={isActive || isDone ? '#0F172A' : '#64748B'} />
              </div>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: isActive ? step.color : isDone ? '#10B981' : '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ───────── Step Header ───────── */
const StepHeader = ({ icon: Icon, color, title, subtitle }) => (
  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        width: 72,
        height: 72,
        borderRadius: '1.25rem',
        margin: '0 auto 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(145deg, ${color}22, ${color}08)`,
        border: `1px solid ${color}44`,
        boxShadow: `0 8px 32px ${color}22`,
      }}
    >
      <Icon size={32} style={{ color }} />
    </motion.div>
    <h2
      style={{
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700,
        fontSize: 'clamp(1.35rem, 4vw, 1.75rem)',
        color: '#F8FAFC',
        marginBottom: '0.5rem',
        letterSpacing: '-0.02em',
      }}
    >
      {title}
    </h2>
    <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.5, maxWidth: 340, margin: '0 auto' }}>
      {subtitle}
    </p>
  </div>
);

/* ───────── Currency Input ───────── */
const CurrencyInput = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <span
      className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-lg"
      style={{ color: '#FBBF24' }}
    >
      ₹
    </span>
    <input
      type="number"
      className="onboarding-field onboarding-field-icon"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      min="0"
    />
  </div>
);

/* ───────── Step 1 – Avatar ───────── */
const AvatarStep = ({ selected, onSelect }) => (
  <div>
    <StepHeader
      icon={Coins}
      color="#FBBF24"
      title="Choose Your Treasure Hunter"
      subtitle="Pick the character that represents your financial journey"
    />
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
      {avatars.map((avatar, i) => {
        const isSelected = selected === avatar.slug;
        return (
          <motion.button
            key={avatar.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(avatar.slug)}
            style={{
              borderRadius: '1rem',
              padding: '1.25rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              background: isSelected
                ? 'linear-gradient(160deg, rgba(251,191,36,0.18), rgba(251,191,36,0.05))'
                : 'rgba(255,255,255,0.03)',
              border: isSelected ? '2px solid #FBBF24' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: isSelected ? '0 0 30px rgba(251,191,36,0.2)' : 'none',
            }}
          >
            <span style={{ fontSize: '2.5rem', filter: isSelected ? 'drop-shadow(0 0 8px rgba(251,191,36,0.4))' : 'none' }}>
              {avatar.emoji}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isSelected ? '#FBBF24' : '#CBD5E1' }}>
              {avatar.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  </div>
);

/* ───────── Step 2 – Monthly Income ───────── */
const IncomeStep = ({ income, setIncome, salaryDate, setSalaryDate }) => (
  <div className="max-w-md mx-auto">
    <StepHeader
      icon={Wallet}
      color="#3B82F6"
      title="Monthly Income"
      subtitle="How much treasure flows into your vault each month?"
    />

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Monthly Income
        </label>
        <CurrencyInput
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder="50,000"
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Salary Date
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {SALARY_DATE_PRESETS.map((day) => (
            <button
              key={day}
              type="button"
              className={`onboarding-chip${String(salaryDate) === String(day) ? ' active' : ''}`}
              onClick={() => setSalaryDate(String(day))}
            >
              {day === 31 ? 'Last day' : `${day}${day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'}`}
            </button>
          ))}
        </div>
        <div className="relative">
          <Calendar
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: '#64748B' }}
          />
          <input
            type="number"
            className="onboarding-field onboarding-field-icon"
            placeholder="Or enter day (1–31)"
            value={salaryDate}
            onChange={(e) => setSalaryDate(e.target.value)}
            min="1"
            max="31"
          />
        </div>
      </div>
    </div>

    {income && (
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        style={{
          marginTop: '1.5rem',
          borderRadius: '1rem',
          padding: '1.25rem',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(251,191,36,0.08))',
          border: '1px solid rgba(59,130,246,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '0.75rem', background: 'rgba(59,130,246,0.15)' }}>
            <TrendingUp size={20} color="#3B82F6" />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your monthly income
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FBBF24', fontFamily: "'Poppins', sans-serif" }}>
              {fmt(income)}
            </p>
          </div>
        </div>
        {salaryDate && (
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', color: '#64748B' }}>Payday</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#3B82F6' }}>Day {salaryDate}</p>
          </div>
        )}
      </motion.div>
    )}
  </div>
);

/* ───────── Step 3 – Vault Contribution ───────── */
const VaultStep = ({ amount, setAmount }) => (
  <div className="max-w-md mx-auto">
    <StepHeader
      icon={Shield}
      color="#10B981"
      title="Treasure Vault"
      subtitle="How much do you want to protect and grow every month?"
    />

    <motion.div
      style={{
        margin: '0 auto 1.5rem',
        width: 120,
        height: 120,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.02) 70%)',
        border: '2px solid rgba(16,185,129,0.3)',
      }}
      animate={{
        boxShadow: [
          '0 0 30px rgba(16,185,129,0.15)',
          '0 0 50px rgba(16,185,129,0.25)',
          '0 0 30px rgba(16,185,129,0.15)',
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Shield size={48} style={{ color: '#10B981' }} />
    </motion.div>

    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Monthly Vault Amount
      </label>
      <CurrencyInput
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="10,000"
      />
    </div>

    {amount && (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginTop: '1.5rem',
          borderRadius: '1rem',
          padding: '1.25rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))',
          border: '1px solid rgba(16,185,129,0.25)',
        }}
      >
        <p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Protected every month
        </p>
        <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10B981', fontFamily: "'Poppins', sans-serif", marginTop: '0.25rem' }}>
          {fmt(amount)}
        </p>
      </motion.div>
    )}
  </div>
);

/* ───────── Step 4 – Bills ───────── */
const BillsStep = ({ bills, onAdd, onDelete }) => {
  const [billName, setBillName] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDueDate, setBillDueDate] = useState('');

  const handleAdd = () => {
    if (!billName || !billAmount || !billDueDate) return;
    onAdd({
      name: billName,
      amount: Number(billAmount),
      dueDate: Number(billDueDate),
    });
    setBillName('');
    setBillAmount('');
    setBillDueDate('');
  };

  return (
    <div className="max-w-md mx-auto">
      <StepHeader
        icon={Receipt}
        color="#F97316"
        title="Essential Bills"
        subtitle="Add your recurring bills — rent, utilities, subscriptions & more"
      />

      <div
        style={{
          padding: '1.25rem',
          borderRadius: '1rem',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }}>Bill Name</label>
            <input
              type="text"
              className="onboarding-field"
              placeholder="e.g. Rent, Netflix"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }}>Amount</label>
              <CurrencyInput
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="1,000"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }}>Due Date</label>
              <input
                type="number"
                className="onboarding-field"
                placeholder="1–31"
                value={billDueDate}
                onChange={(e) => setBillDueDate(e.target.value)}
                min="1"
                max="31"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
            style={{ borderRadius: '0.75rem', padding: '0.75rem' }}
          >
            <Plus size={16} />
            Add Bill
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <AnimatePresence>
          {bills.map((bill, idx) => (
            <motion.div
              key={`${bill.name}-${idx}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              style={{
                borderRadius: '0.875rem',
                padding: '0.875rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(249,115,22,0.06)',
                border: '1px solid rgba(249,115,22,0.15)',
              }}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#F8FAFC' }}>{bill.name}</p>
                <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Due day {bill.dueDate}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontWeight: 700, color: '#F97316' }}>{fmt(bill.amount)}</span>
                <button
                  onClick={() => onDelete(idx)}
                  style={{ padding: '0.35rem', borderRadius: '0.5rem', background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer', color: '#EF4444' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {bills.length === 0 && (
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748B', padding: '1.5rem 0' }}>
            No bills yet — skip or add your first bill above
          </p>
        )}
      </div>
    </div>
  );
};

/* ───────── Step 5 – Summary ───────── */
const SummaryStep = ({ income, vault, bills }) => {
  const totalBills = bills.reduce((sum, b) => sum + b.amount, 0);
  const safeSpending = Number(income) - Number(vault) - totalBills;

  const rows = [
    { icon: Wallet, color: '#FBBF24', label: 'Income', value: fmt(income), positive: true },
    { icon: Shield, color: '#10B981', label: 'Vault Savings', value: `-${fmt(vault)}`, positive: false },
    { icon: Receipt, color: '#F97316', label: `Bills (${bills.length})`, value: `-${fmt(totalBills)}`, positive: false },
  ];

  return (
    <div className="max-w-md mx-auto">
      <StepHeader
        icon={BarChart3}
        color="#A78BFA"
        title="Your Budget Map"
        subtitle="Here's your monthly treasure breakdown — ready to begin?"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {rows.map((row, i) => {
          const Icon = row.icon;
          return (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                borderRadius: '1rem',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '0.625rem', background: `${row.color}18` }}>
                  <Icon size={18} style={{ color: row.color }} />
                </div>
                <span style={{ color: '#F8FAFC', fontWeight: 500 }}>{row.label}</span>
              </div>
              <span style={{ fontWeight: 700, color: row.positive ? '#F8FAFC' : '#EF4444' }}>
                {row.value}
              </span>
            </motion.div>
          );
        })}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: '0.5rem',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            textAlign: 'center',
            background: safeSpending >= 0
              ? 'linear-gradient(160deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))'
              : 'linear-gradient(160deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
            border: safeSpending >= 0 ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
            boxShadow: safeSpending >= 0 ? '0 0 40px rgba(16,185,129,0.1)' : '0 0 40px rgba(239,68,68,0.1)',
          }}
        >
          <p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Safe Spending
          </p>
          <p style={{ fontSize: '2.25rem', fontWeight: 700, color: safeSpending >= 0 ? '#10B981' : '#EF4444', fontFamily: "'Poppins', sans-serif", margin: '0.25rem 0' }}>
            {fmt(safeSpending)}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
            {safeSpending >= 0 ? 'Available for guilt-free spending!' : 'Your expenses exceed your income!'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

/* ───────── Main Onboarding Page ───────── */
export default function OnboardingPage() {
  const navigate = useNavigate();
  const store = useStore();
  const bills = useStore((s) => s.bills);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [income, setIncome] = useState('');
  const [salaryDate, setSalaryDate] = useState('');
  const [vaultAmount, setVaultAmount] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const nextStep = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleAvatarSelect = async (name) => {
    setSelectedAvatar(name);
    await store.setAvatar(name);
  };

  const handleAddBill = async (bill) => {
    await store.addBill(bill);
  };

  const handleDeleteBill = async (idx) => {
    const bill = bills[idx];
    if (bill) await store.deleteBill(bill.id);
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      await store.setMonthlyIncome(Number(income));
      await store.setSalaryDate(Number(salaryDate));
      await store.setVaultContribution(Number(vaultAmount));
      await store.completeOnboarding();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save onboarding data:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return !!selectedAvatar;
      case 1: return !!income && !!salaryDate;
      case 2: return !!vaultAmount;
      case 3:
      case 4: return true;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <AvatarStep selected={selectedAvatar} onSelect={handleAvatarSelect} />;
      case 1:
        return <IncomeStep income={income} setIncome={setIncome} salaryDate={salaryDate} setSalaryDate={setSalaryDate} />;
      case 2:
        return <VaultStep amount={vaultAmount} setAmount={setVaultAmount} />;
      case 3:
        return <BillsStep bills={bills} onAdd={handleAddBill} onDelete={handleDeleteBill} />;
      case 4:
        return <SummaryStep income={income} vault={vaultAmount} bills={bills} />;
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-page flex flex-col">
      <BackgroundOrbs />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, padding: '1.5rem 1.25rem 0', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
        >
          <div style={{ padding: '0.4rem', borderRadius: '0.625rem', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.25)' }}>
            <Coins size={20} style={{ color: '#FBBF24' }} />
          </div>
          <h1 className="pixel-text" style={{ color: '#FBBF24', fontSize: '1rem' }}>
            Cash Crush
          </h1>
        </motion.div>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', justifyContent: 'center', padding: '0 1.25rem 7rem' }}>
        <div className="onboarding-card w-full max-w-lg" style={{ position: 'relative', padding: '1.75rem 1.5rem', minHeight: 480 }}>
          <ProgressBar currentStep={step} />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem 1.25rem 1.5rem',
          background: 'linear-gradient(to top, rgba(7,11,20,0.98) 50%, transparent)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            width: '100%',
            maxWidth: '32rem',
          }}
        >
          {step > 0 && (
            <button
              onClick={prevStep}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.875rem 1.5rem',
                borderRadius: '0.875rem',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#F8FAFC',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={18} />
              Back
            </button>
          )}

          {step < TOTAL_STEPS - 1 ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="btn btn-primary btn-lg"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: canProceed() ? 1 : 0.45,
                cursor: canProceed() ? 'pointer' : 'not-allowed',
                borderRadius: '0.875rem',
                padding: '0.875rem 2rem',
                minWidth: '160px',
              }}
            >
              Continue
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={isSaving}
              className="btn btn-primary btn-lg"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                borderRadius: '0.875rem',
                padding: '0.875rem 2rem',
                background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                color: '#0F172A',
                fontWeight: 700,
              }}
            >
              <Sparkles size={18} />
              {isSaving ? 'Saving...' : 'Start Your Adventure'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
