import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Coins, TrendingUp, Lock, Mail } from 'lucide-react';
import useStore from '../store/useStore';

const FloatingCoin = ({ delay, x, y, size }) => (
  <motion.div
    className="absolute"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 360],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    <div
      className="rounded-full flex items-center justify-center font-bold"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #FBBF24, #F59E0B, #D97706)',
        boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
        color: '#78350F',
        fontSize: size * 0.4,
      }}
    >
      ₹
    </div>
  </motion.div>
);

const VaultIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
    {/* Background glow */}
    <div
      className="absolute rounded-full"
      style={{
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
    />

    {/* Vault */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative"
    >
      {/* Vault body */}
      <div
        className="rounded-2xl flex items-center justify-center"
        style={{
          width: 200,
          height: 220,
          background: 'linear-gradient(145deg, #1E293B, #0F172A)',
          border: '3px solid rgba(251, 191, 36, 0.3)',
          boxShadow: '0 0 60px rgba(251, 191, 36, 0.1), inset 0 0 30px rgba(0,0,0,0.5)',
        }}
      >
        {/* Vault door */}
        <div
          className="rounded-xl flex items-center justify-center"
          style={{
            width: 140,
            height: 160,
            background: 'linear-gradient(145deg, #374151, #1F2937)',
            border: '2px solid rgba(251, 191, 36, 0.2)',
          }}
        >
          {/* Vault handle */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-full"
            style={{
              width: 60,
              height: 60,
              border: '4px solid #FBBF24',
              boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
            }}
          />
        </div>
      </div>

      {/* Vault base */}
      <div
        className="mx-auto rounded-b-lg"
        style={{
          width: 220,
          height: 20,
          background: 'linear-gradient(145deg, #1E293B, #0F172A)',
          border: '2px solid rgba(251, 191, 36, 0.2)',
          borderTop: 'none',
        }}
      />
    </motion.div>

    {/* Floating coins */}
    <FloatingCoin delay={0} x="15%" y="20%" size={40} />
    <FloatingCoin delay={0.5} x="75%" y="15%" size={32} />
    <FloatingCoin delay={1} x="25%" y="70%" size={36} />
    <FloatingCoin delay={1.5} x="70%" y="65%" size={28} />
    <FloatingCoin delay={2} x="50%" y="10%" size={24} />
    <FloatingCoin delay={0.8} x="10%" y="50%" size={30} />
    <FloatingCoin delay={1.2} x="85%" y="40%" size={34} />
  </div>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
    >
      {/* Left Side - Vault Illustration (hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-8"
        style={{
          background: 'linear-gradient(180deg, rgba(251,191,36,0.03) 0%, rgba(15,23,42,0) 100%)',
        }}
      >
        <div className="w-full max-w-lg h-[500px]">
          <VaultIllustration />
        </div>
      </motion.div>

      {/* Right Side - Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(17, 24, 39, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(248, 250, 252, 0.06)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Logo & Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Coins style={{ color: '#FBBF24' }} size={32} />
                <h1
                  className="pixel-text text-3xl"
                  style={{ color: '#FBBF24' }}
                >
                  Cash Crush
                </h1>
              </div>
              <p style={{ color: '#94A3B8' }} className="text-sm">
                Turn Saving Money Into A Treasure Hunt
              </p>
            </motion.div>

            {/* Features row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center gap-6 mb-8"
            >
              {[
                { icon: Shield, label: 'Secure' },
                { icon: TrendingUp, label: 'Track' },
                { icon: Coins, label: 'Save' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon size={18} style={{ color: '#FBBF24' }} />
                  <span className="text-xs" style={{ color: '#64748B' }}>
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg p-3 mb-4 text-center text-sm"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#FCA5A5',
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label
                  className="block text-sm mb-1.5"
                  style={{ color: '#94A3B8' }}
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#64748B' }}
                  />
                  <input
                    type="email"
                    className="input input-icon"
                    placeholder="adventurer@cashcrush.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label
                  className="block text-sm mb-1.5"
                  style={{ color: '#94A3B8' }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#64748B' }}
                  />
                  <input
                    type="password"
                    className="input input-icon"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full"
                  disabled={loading}
                  style={{ marginTop: '0.5rem' }}
                >
                  {loading ? 'Entering the Vault...' : 'Login'}
                </button>
              </motion.div>
            </form>

            {/* Sign up link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-6 text-sm"
              style={{ color: '#94A3B8' }}
            >
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold hover:underline"
                style={{ color: '#FBBF24' }}
              >
                Sign Up
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
