import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white w-full py-6 mt-auto"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium text-shadow-sm">
            © {new Date().getFullYear()} Fitness Workout Planner. Created By Ahmed Fahim Kabir. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <Link to="/terms" className="text-white hover:text-gray-100 font-semibold transition duration-300">
              Terms
            </Link>
            <Link to="/privacy" className="text-white hover:text-gray-100 font-semibold transition duration-300">
              Privacy
            </Link>
            <Link to="/contact" className="text-white hover:text-gray-100 font-semibold transition duration-300">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}