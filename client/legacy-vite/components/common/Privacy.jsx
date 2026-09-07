import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Privacy() {
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
          Privacy Policy
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6 bg-gradient-to-br from-white to-teal-50"
        >
          <h2 className="text-2xl font-semibold text-cyan-900 mb-4">Our Commitment to Your Privacy</h2>
          <p className="text-gray-700 mb-4">
            At Fitness Workout Planner, we value your privacy and are committed to protecting your personal information.
          </p>
          <h3 className="text-xl font-semibold text-cyan-900 mb-2">1. Information We Collect</h3>
          <p className="text-gray-700 mb-4">
            We collect information you provide, such as your name, email, and workout data, to deliver personalized services.
          </p>
          <h3 className="text-xl font-semibold text-cyan-900 mb-2">2. How We Use Your Information</h3>
          <p className="text-gray-700 mb-4">
            Your information is used to improve our services, track your fitness progress, and communicate with you.
          </p>
          <h3 className="text-xl font-semibold text-cyan-900 mb-2">3. Data Security</h3>
          <p className="text-gray-700 mb-4">
            We implement reasonable measures to protect your data, but no system is completely secure. Please use strong passwords.
          </p>
          <p className="text-gray-700">
            For questions about our privacy practices, please <Link to="/contact" className="text-cyan-600 hover:text-cyan-700 font-medium">contact us</Link>.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}