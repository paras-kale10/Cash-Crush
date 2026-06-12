import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, KeyRound, Coins, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';

const FloatingElement = ({ emoji, delay, x, y, size }) => (
  <motion.div
    className="absolute pointer-events-none select-none"
    style={{ left: x, top: y, fontSize: size }}
    animate={{
      y: [0, -15, 0],
      x: [0, 8, -8, 0],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration: 5,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {emoji}
  </motion.div>
);

export default function SignupPage() {
  const navigate = useNavigate();
  const signup = useStore((s) => s.signup);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(username, email, password);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)' }}
    >
      {/* Floating background elements */}
      <FloatingElement emoji="💰" delay={0} x="10%" y="15%" size={28} />
      <FloatingElement emoji="🪙" delay={0.7} x="85%" y="20%" size={24} />
      <FloatingElement emoji="💎" delay={1.4} x="15%" y="75%" size={22} />
      <FloatingElement emoji="🏆" delay={2.1} x="80%" y="70%" size={26} />
      <FloatingElement emoji="⭐" delay={0.3} x="50%" y="8%" size={20} />
      <FloatingElement emoji="🗝️" delay={1.8} x="5%" y="45%" size={24} />
      <FloatingElement emoji="🧭" delay={1.0} x="90%" y="50%" size={22} />
      <FloatingElement emoji="🪙" delay={2.5} x="40%" y="85%" size={20} />

      {/* Background glow */}
      <div
        className="absolute"
        style={{
          width: 500,
          height: 500,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(17, 24, 39, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(248, 250, 252, 0.06)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins style={{ color: '#FBBF24' }} size={28} />
              <h1
                className="pixel-text text-2xl"
                style={{ color: '#FBBF24' }}
              >
                Cash Crush
              </h1>
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Sparkles size={16} style={{ color: '#FBBF24' }} />
              <h2
                className="text-lg font-semibold"
                style={{ color: '#F8FAFC' }}
              >
                Join the Adventure
              </h2>
              <Sparkles size={16} style={{ color: '#FBBF24' }} />
            </div>
            <p className="text-sm" style={{ color: '#94A3B8' }}>
              Create your account and start your treasure hunt
            </p>
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

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label
                className="block text-sm mb-1.5"
                style={{ color: '#94A3B8' }}
              >
                Username
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#64748B' }}
                />
                <input
                  type="text"
                  className="input input-icon"
                  placeholder="TreasureHunter42"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
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
              transition={{ delay: 0.5 }}
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label
                className="block text-sm mb-1.5"
                style={{ color: '#94A3B8' }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <KeyRound
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#64748B' }}
                />
                <input
                  type="password"
                  className="input input-icon"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </motion.div>
          </form>

          {/* Login link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6 text-sm"
            style={{ color: '#94A3B8' }}
          >
            Already have an account?{' '}
            <Link
              to="/"
              className="font-semibold hover:underline"
              style={{ color: '#FBBF24' }}
            >
              Login
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
