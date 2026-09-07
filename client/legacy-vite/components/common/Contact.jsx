import { motion } from 'framer-motion';

export default function Contact() {
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
          Contact Us
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6 bg-gradient-to-br from-white to-teal-50"
        >
          <h2 className="text-2xl font-semibold text-cyan-900 mb-4">Get in Touch</h2>
          <p className="text-gray-700 mb-4">
            Have questions or feedback about Fitness Workout Planner? Reach out to us!
          </p>
          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="font-medium text-cyan-900">Name:</span> Ahmed Fahim Kabir
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-cyan-900">WhatsApp:</span>{' '}
              <a href="https://wa.me/+8801894400651" className="text-cyan-600 hover:text-cyan-700 font-medium">
                +8801894400651
              </a>
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-cyan-900">Email:</span>{' '}
              <a href="mailto:csfahim007@gmail.com" className="text-cyan-600 hover:text-cyan-700 font-medium">
                csfahim007@gmail.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}