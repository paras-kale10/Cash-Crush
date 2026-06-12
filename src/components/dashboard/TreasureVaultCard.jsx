import { motion } from 'framer-motion';
import { Lock, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';

const TreasureVaultCard = () => {
  const vault = useStore((state) => state.vault);

  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

  const floatingCoins = ['🪙', '💰', '🪙', '💎', '🪙'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card card-gold"
      style={{
        padding: '1.5rem',
        borderRadius: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <h2
        className="pixel-text"
        style={{
          fontSize: '1.1rem',
          marginBottom: '1.25rem',
          textAlign: 'center',
          color: '#FBBF24',
        }}
      >
        🏴‍☠️ Treasure Vault
      </h2>

      {/* Vault Visual */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative' }}>
          {/* Floating coins */}
          {floatingCoins.map((coin, i) => (
            <motion.span
              key={i}
              className="animate-float"
              style={{
                position: 'absolute',
                fontSize: '1.2rem',
                top: `${-10 + (i * 15) % 50}%`,
                left: `${-15 + (i * 30) % 110}%`,
                zIndex: 1,
              }}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            >
              {coin}
            </motion.span>
          ))}

          {/* Vault Box */}
          <motion.div
            className="animate-treasure-glow"
            style={{
              width: '120px',
              height: '100px',
              borderRadius: '12px',
              background: 'linear-gradient(145deg, #B8860B, #DAA520, #FFD700, #DAA520, #B8860B)',
              border: '3px solid #FFD700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 0 30px rgba(255,215,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {/* Vault keyhole / lock */}
            <Lock
              size={36}
              style={{
                color: '#92400E',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            />
            {/* Vault band */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #92400E, #DAA520, #92400E)',
                transform: 'translateY(-50%)',
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div
          style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '0.25rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Protected Savings
        </div>
        <div
          style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: '#FBBF24',
            textShadow: '0 0 10px rgba(251,191,36,0.3)',
          }}
        >
          {fmt(vault.currentSavings)}
        </div>

        {/* Monthly contribution badge */}
        <div
          style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            background: 'rgba(251,191,36,0.15)',
            border: '1px solid rgba(251,191,36,0.3)',
            fontSize: '0.75rem',
            color: '#FCD34D',
          }}
        >
          <Coins size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
          {fmt(vault.monthlyContribution)}/month
        </div>
      </div>

      {/* View Vault Button */}
      <Link to="/vault" style={{ textDecoration: 'none' }}>
        <motion.button
          className="btn btn-gold"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            padding: '0.65rem',
            borderRadius: '0.75rem',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          View Vault
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default TreasureVaultCard;
