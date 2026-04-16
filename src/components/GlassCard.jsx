import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', delay = 0, hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? {
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      } : {}}
      className={`glass-card ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
