import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Lock,
  Receipt,
  CreditCard,
  Target,
  BarChart3,
  Trophy,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Star,
  Wallet,
} from 'lucide-react';
import useStore from '../../store/useStore';
import { getAvatarEmoji } from '../../utils/avatars';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Treasure Vault', icon: Lock, path: '/vault' },
  { label: 'Bills', icon: Receipt, path: '/bills' },
  { label: 'Expenses', icon: CreditCard, path: '/expenses' },
  { label: 'Add Money', icon: Wallet, path: '/income' },
  { label: 'Goals', icon: Target, path: '/goals' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Achievements', icon: Trophy, path: '/achievements' },
  { label: 'Profile', icon: User, path: '/profile' },
];

const Sidebar = ({ isOpen, onToggle, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useStore();
  const [hoveredPath, setHoveredPath] = useState(null);

  const username = store.user?.username || 'Adventurer';
  const level = store.user?.level || 1;
  const xp = store.user?.xp || 0;
  const title = store.user?.title || 'Bronze Saver';
  const avatar = store.user?.avatar || 'adventurer';
  const avatarEmoji = getAvatarEmoji(avatar);

  const xpForLevel = 100;
  const currentLevelXp = xp % xpForLevel;
  const xpProgress = (currentLevelXp / xpForLevel) * 100;

  const handleLogout = () => {
    store.logout();
    navigate('/');
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 40,
            }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 88 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          position: isMobile ? 'fixed' : 'relative',
          top: isMobile ? 0 : 'auto',
          left: isMobile ? 0 : 'auto',
          height: '100vh',
          zIndex: isMobile ? 50 : 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0F172A 0%, #1a1f3a 50%, #0f1929 100%)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(248, 250, 252, 0.1)',
          boxShadow: 'inset -1px 0 0 rgba(248, 250, 252, 0.05)',
          transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
          minWidth: isOpen ? 280 : 88,
        }}
      >
        {/* Toggle Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '1rem' }}>
          <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '0.5rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#94A3B8',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#E2E8F0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </motion.button>
        </div>

        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 1.5rem 1.5rem 1.5rem', justifyContent: isOpen ? 'flex-start' : 'center' }}>
          <motion.span
            animate={{ rotate: isOpen ? 0 : 360 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center' }}
          >
            🪙
          </motion.span>
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#F8FAFC',
                  whiteSpace: 'nowrap',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Cash Crush
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Separator */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(248,250,252,0.1), transparent)', margin: '0 1rem' }} />

        {/* Navigation Items */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem 0.5rem', gap: '0.5rem', overflowY: 'auto' }}>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const isHovered = hoveredPath === item.path;

            return (
              <motion.button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                onMouseEnter={() => setHoveredPath(item.path)}
                onMouseLeave={() => setHoveredPath(null)}
                whileHover={{ x: isOpen ? 4 : 0 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)'
                    : isHovered
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'transparent',
                  color: isActive ? '#10B981' : isHovered ? '#E2E8F0' : '#94A3B8',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow effect for active */}
                {isActive && (
                  <motion.div
                    layoutId="activeGlow"
                    style={{
                      position: 'absolute',
                      inset: '-1px',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, transparent 100%)',
                      borderRadius: '0.75rem',
                      zIndex: -1,
                    }}
                  />
                )}

                {/* Active animated left border */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '3px',
                      height: '24px',
                      background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                      borderRadius: '0 0.25rem 0.25rem 0',
                      boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <Icon size={20} style={{ flexShrink: 0 }} />

                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Icon-only tooltip when collapsed */}
                {!isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 8 }}
                    exit={{ opacity: 0, x: -10 }}
                    style={{
                      position: 'absolute',
                      left: '100%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      marginLeft: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: '#F8FAFC',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      borderRadius: '0.5rem',
                      whiteSpace: 'nowrap',
                      zIndex: 100,
                      pointerEvents: 'none',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {item.label}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Separator */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(248,250,252,0.1), transparent)', margin: '1rem' }} />

        {/* User Info Section - Premium Design */}
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* User Profile Card */}
          <motion.div
            whileHover={isOpen ? { scale: 1.02 } : {}}
            style={{
              padding: '1rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isOpen ? 'flex-start' : 'center',
              gap: isOpen ? '0.75rem' : 0,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0,
              }}
            >
              {avatarEmoji}
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {username}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 500, marginTop: '0.25rem' }}>
                    {title}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* XP Progress Bar */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Star size={14} color="#D4A017" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                    Lvl {level}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: 'auto' }}>
                    {currentLevelXp}/{xpForLevel}
                  </div>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    borderRadius: '2px',
                    background: 'rgba(212, 160, 23, 0.2)',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #D4A017, #FFD700)',
                      borderRadius: '2px',
                      boxShadow: '0 0 8px rgba(212, 160, 23, 0.6)',
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout Button */}
        <div style={{ padding: '0.5rem 1rem 1rem 1rem' }}>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isOpen ? 'flex-start' : 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(239, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <LogOut size={20} style={{ flexShrink: 0 }} />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
