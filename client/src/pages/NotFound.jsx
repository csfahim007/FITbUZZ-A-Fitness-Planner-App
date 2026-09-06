import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="content-container py-16 flex flex-col items-center justify-center min-h-screen text-center bg-gray-100"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-5xl font-extrabold text-gray-800 mb-4"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xl text-gray-600 mb-8"
      >
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link
          to="/"
          className="inline-block bg-emerald-600 text-white py-3 px-8 rounded-full hover:bg-emerald-700 transition duration-300 shadow-md hover:shadow-lg text-lg font-semibold"
        >
          Return Home
        </Link>
      </motion.div>
    </motion.div>
  );
}