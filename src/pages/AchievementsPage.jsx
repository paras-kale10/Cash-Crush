import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Star } from 'lucide-react';
import useStore from '../store/useStore';
import { ALL_ACHIEVEMENTS, checkAchievements } from '../utils/achievements';

const LEVEL_TITLES = [
  'Novice Saver',
  'Bronze Budgeter',
  'Silver Strategist',
  'Gold Saver',
  'Platinum Planner',
  'Diamond Financier',
  'Legendary Treasurer',
  'Mythic Mogul',
];

export default function AchievementsPage() {
  const achievements = useStore((s) => s.achievements) || [];
  const xp = useStore((s) => s.user?.xp) || 0;
  const level = useStore((s) => s.user?.level) || 1;

  // Check for newly unlocked achievements on page load
  useEffect(() => {
    const state = useStore.getState();
    const newlyUnlocked = checkAchievements(state);
    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach(achievement => {
        const ach = ALL_ACHIEVEMENTS.find(x => x.name === achievement.name);
        if (ach) {
          useStore.getState().unlockAchievement(ach.name);
        }
      });
    }
  }, []);

  const unlockedNames = new Set(achievements.map((a) => a.name));
  const xpForNextLevel = level * 100;
  const xpProgress = Math.min(100, (xp % 100) / (xpForNextLevel > 0 ? 100 : 1) * 100);
  const levelTitle = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] || 'Master';

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.75rem', color: '#F8FAFC' }}>
          Achievements
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1E293B', padding: '0.5rem 1rem', borderRadius: '0.75rem' }}>
            <Star size={18} color="#D4A017" />
            <span style={{ color: '#D4A017', fontWeight: 700, fontSize: '1rem' }}>{xp} XP</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #D4A017, #B8860B)',
            padding: '0.5rem 1rem',
            borderRadius: '0.75rem',
          }}>
            <Trophy size={18} color="#1a1207" />
            <span style={{ color: '#1a1207', fontWeight: 700, fontSize: '0.9rem' }}>Level {level}</span>
          </div>
        </div>
      </div>

      {/* Level Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ padding: '1.5rem', marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '1.25rem', color: '#F8FAFC', marginBottom: '0.25rem' }}>
              Level {level} — {levelTitle}
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
              XP: {xp} / {level * 100} to next level
            </p>
          </div>
          <div style={{ fontSize: '2.5rem' }}>
            {level >= 7 ? '👑' : level >= 5 ? '💎' : level >= 3 ? '🥇' : '🏅'}
          </div>
        </div>

        {/* XP Progress Bar */}
        <div style={{ width: '100%', height: '12px', borderRadius: '6px', background: '#1E293B' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              height: '100%',
              borderRadius: '6px',
              background: 'linear-gradient(90deg, #D4A017, #FFD700)',
            }}
          />
        </div>
      </motion.div>

      {/* Badge Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
      }}>
        {(ALL_ACHIEVEMENTS || []).map((achievement, index) => {
          const isUnlocked = unlockedNames.has(achievement.name);
          const unlockData = achievements.find((a) => a.name === achievement.name);

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="card"
              style={{
                padding: '1.5rem',
                textAlign: 'center',
                position: 'relative',
                cursor: 'default',
                border: isUnlocked ? '1px solid #D4A017' : '1px solid #1E293B',
                boxShadow: isUnlocked ? '0 0 20px rgba(212,160,23,0.15)' : undefined,
                filter: isUnlocked ? 'none' : 'grayscale(0.6)',
                opacity: isUnlocked ? 1 : 0.6,
              }}
            >
              {/* Lock overlay for locked achievements */}
              {!isUnlocked && (
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: '#334155',
                  borderRadius: '50%',
                  padding: '0.35rem',
                }}>
                  <Lock size={14} color="#64748B" />
                </div>
              )}

              {/* Icon/Emoji */}
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '0.75rem',
                filter: isUnlocked ? 'none' : 'grayscale(1)',
              }}>
                {achievement.icon || achievement.emoji || '🏆'}
              </div>

              {/* Name */}
              <h3 style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: '1rem',
                color: isUnlocked ? '#F8FAFC' : '#64748B',
                marginBottom: '0.25rem',
              }}>
                {achievement.name || achievement.title}
              </h3>

              {/* Description */}
              <p style={{
                color: isUnlocked ? '#94A3B8' : '#475569',
                fontSize: '0.8rem',
                lineHeight: 1.4,
                marginBottom: '0.5rem',
              }}>
                {achievement.description}
              </p>

              {/* Unlock date */}
              {isUnlocked && unlockData?.unlockedAt && (
                <p style={{ color: '#D4A017', fontSize: '0.75rem', fontWeight: 500 }}>
                  🔓 {new Date(unlockData.unlockedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty state if no achievements defined */}
      {(!ALL_ACHIEVEMENTS || ALL_ACHIEVEMENTS.length === 0) && (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Trophy size={48} color="#334155" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#64748B', fontSize: '1.1rem' }}>Achievements will appear here as you use Cash Crush!</p>
        </div>
      )}
    </div>
  );
}
