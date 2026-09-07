import { motion } from 'framer-motion';

export default function Button({ children, className, isLoading, type, ...props }) {
  return (
    <motion.button
      type={type}
      disabled={isLoading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center justify-center py-3 px-6 rounded-full font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </motion.button>
  );
}