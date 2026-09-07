import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-extrabold text-cyan-900 tracking-tight mb-8 text-center"
        >
          Terms of Service
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6 bg-gradient-to-br from-white to-teal-50"
        >
          <h2 className="text-2xl font-semibold text-cyan-900 mb-4">Welcome to Fitness Workout Planner</h2>
          <p className="text-gray-700 mb-4">
            These Terms of Service govern your use of the Fitness Workout Planner application. By accessing or using our services, you agree to be bound by these terms.
          </p>
          <h3 className="text-xl font-semibold text-cyan-900 mb-2">1. Acceptance of Terms</h3>
          <p className="text-gray-700 mb-4">
            By using our application, you agree to comply with these terms and all applicable laws. If you do not agree, please do not use our services.
          </p>
          <h3 className="text-xl font-semibold text-cyan-900 mb-2">2. Use of Services</h3>
          <p className="text-gray-700 mb-4">
            You may use our services for personal, non-commercial purposes. You are responsible for maintaining the confidentiality of your account information.
          </p>
          <h3 className="text-xl font-semibold text-cyan-900 mb-2">3. Changes to Terms</h3>
          <p className="text-gray-700 mb-4">
            We may update these terms from time to time. Changes will be posted on this page, and your continued use constitutes acceptance of the updated terms.
          </p>
          <p className="text-gray-700">
            For more details, please <Link to="/contact" className="text-cyan-600 hover:text-cyan-700 font-medium">contact us</Link>.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}