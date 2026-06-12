import { motion } from 'framer-motion';
import useStore from '../../store/useStore';
import { generateInsights } from '../../utils/insights';

const colorMap = {
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
  blue: '#2563EB',
  gold: '#FBBF24',
};

const AIInsightsCard = () => {
  const state = useStore();
  const insights = generateInsights(state).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="card"
      style={{
        padding: '1.5rem',
        borderRadius: '1rem',
      }}
    >
      {/* Title */}
      <h2
        className="pixel-text"
        style={{
          fontSize: '1.1rem',
          marginBottom: '1.25rem',
          color: '#fff',
        }}
      >
        🗺️ Treasure Advisor
      </h2>

      {/* Insights List */}
      <div
        style={{
          maxHeight: '320px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          paddingRight: '4px',
        }}
      >
        {insights.length > 0 ? (
          insights.map((insight, i) => {
            const borderColor = colorMap[insight.color] || colorMap.blue;

            return (
              <motion.div
                key={insight.type + i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                style={{
                  padding: '0.75rem 0.85rem',
                  borderRadius: '0.6rem',
                  background: 'rgba(255,255,255,0.04)',
                  borderLeft: `3px solid ${borderColor}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                }}
              >
                <span style={{ fontSize: '1.15rem', lineHeight: 1.3, flexShrink: 0 }}>
                  {insight.icon}
                </span>
                <span
                  style={{
                    fontSize: '0.82rem',
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.45,
                  }}
                >
                  {insight.message}
                </span>
              </motion.div>
            );
          })
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '2rem 0',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.85rem',
            }}
          >
            Start tracking to get insights!
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AIInsightsCard;
