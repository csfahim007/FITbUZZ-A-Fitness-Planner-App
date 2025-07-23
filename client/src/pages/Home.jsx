'use client';

import { FaDumbbell, FaAppleAlt, FaListAlt, FaQuestionCircle, FaTimes, FaComments } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Add this import

export default function Home() {
  // Mock token for demo - set to true to simulate logged-in state
  // Replace with your Redux selector in actual project: const { token } = useSelector((state) => state.auth);
  const token = true;
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Animation variants for staggered text reveal
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.2, ease: 'easeOut' },
    }),
  };

  // Animation for background pulse
  const bgVariants = {
    animate: {
      scale: [1, 1.01, 1],
      transition: { repeat: Infinity, duration: 5, ease: 'easeInOut' },
    },
  };

  // Animation for buttons
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, type: 'spring', stiffness: 100 } },
    hover: { scale: 1.1, boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.95 },
  };

  // Animation for images
  const imageVariants = {
    hidden: { opacity: 0, x: (i) => (i === 0 ? -100 : 100) },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 1, delay: i * 0.3, ease: 'easeOut' },
    }),
  };

  // Toggle chat visibility
  const toggleWebchat = () => {
    setIsChatOpen((prevState) => !prevState);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <motion.div
        variants={bgVariants}
        animate="animate"
        className="relative h-[570px] bg-cover bg-center bg-fixed flex items-center justify-center w-full"
        style={{ backgroundColor: '#1F2937' }}
      >
        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-teal-500/70 to-blue-500/70 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />

        {/* Crossed Images (80% width) */}
        <div className="absolute inset-0 flex justify-center items-center z-0">
          <motion.div
            custom={0}
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="w-[40%] h-[60%] bg-cover bg-center rounded-xl shadow-lg transform -rotate-6"
            style={{ backgroundImage: "url('/assets/bg1.jpg')" }}
          />
          <motion.div
            custom={1}
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="w-[40%] h-[60%] bg-cover bg-center rounded-xl shadow-lg transform rotate-6"
            style={{ backgroundImage: "url('/assets/bg2.jpg')" }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            custom={0}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight relative"
          >
            Transform Your Fitness Journey
            <motion.span
              className="absolute left-1/2 transform -translate-x-1/2 bottom-[-10px] w-32 h-1 bg-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
          </motion.h1>
          <motion.p
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-3xl mb-10 font-medium text-gray-50 max-w-3xl mx-auto"
          >
            Plan, track, and conquer your goals with cutting-edge tools and personalized insights.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          >
            {token ? (
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Link
                  to="/dashboard"
                  className="bg-cyan-800 hover:bg-cyan-500 text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300 shadow-lg"
                >
                  Go to Dashboard
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link
                    to="/register"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300 shadow-lg"
                  >
                    Get Started Now
                  </Link>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link
                    to="/login"
                    className="bg-cyan-800 hover:bg-cyan-500 text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300 shadow-lg"
                  >
                    Log In
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100">
        <div className="content-container py-16 max-w-7xl mx-auto px-4">
          {/* Why Choose Us */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Fitness Planner?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our app empowers you with data-driven tools and unmatched flexibility to stay on track.
            </p>
          </motion.section>

          {/* Features */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-3 gap-8 mb-20"
          >
            <FeatureCard
              icon={<FaListAlt className="text-teal-500" />}
              title="Custom Workouts"
              description="Tailor routines to your goals, equipment, and schedule."
            />
            <FeatureCard
              icon={<FaDumbbell className="text-teal-500" />}
              title="Exercise Library"
              description="Access visual guides and expert form tips."
            />
            <FeatureCard
              icon={<FaAppleAlt className="text-teal-500" />}
              title="Nutrition Tracking"
              description="Log meals, calories, and macros effortlessly."
            />
          </motion.section>

          {/* Stats */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid sm:grid-cols-3 gap-8 text-center mb-20"
          >
            <Stat number="10K+" label="Active Users" />
            <Stat number="250K+" label="Workouts Tracked" />
            <Stat number="1M+" label="Calories Logged" />
          </motion.section>

          {/* Testimonials */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-lg mb-20"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">What Our Users Say</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Testimonial
                name="Alex M."
                feedback="This app transformed my training routine. It's intuitive and keeps me motivated!"
              />
              <Testimonial
                name="Sara K."
                feedback="The nutrition tracking is a game-changer. I love the daily insights!"
              />
            </div>
          </motion.section>

          {/* FAQs */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <FaqItem
                question="Is the app free to use?"
                answer="Yes! Basic features are free, with premium plans for advanced analytics."
              />
              <FaqItem
                question="Do I need equipment?"
                answer="Not at all! We offer bodyweight workouts and equipment-based routines."
              />
              <FaqItem
                question="Is my data secure?"
                answer="We use industry-standard encryption to protect your personal information."
              />
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg text-center"
          >
            <div className="space-y-4">
              {token ? (
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link
                    to="/dashboard"
                    className="block w-full bg-cyan-600 text-white py-3 px-4 rounded-full hover:bg-cyan-500 transition duration-300 shadow-md hover:shadow-lg font-semibold"
                  >
                    Go to Dashboard
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to="/login"
                      className="block w-full bg-cyan-600 text-white py-3 px-4 rounded-full hover:bg-cyan-500 transition duration-300 shadow-md hover:shadow-lg font-semibold"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to="/register"
                      className="block w-full bg-teal-600 text-white py-3 px-4 rounded-full hover:bg-teal-700 transition duration-300 shadow-md hover:shadow-lg font-semibold"
                    >
                      Register
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Botpress Chat Widget */}
      <BotpressChat isOpen={isChatOpen} onClose={toggleWebchat} />
    </div>
  );
}

const BotpressChat = ({ isOpen, onClose }) => {
  const [botpressLoaded, setBotpressLoaded] = useState(false);

  useEffect(() => {
    // Load Botpress script only if not already loaded
    if (!botpressLoaded) {
      const script = document.createElement('script');
      script.src = 'https://cdn.botpress.cloud/webchat/v3.1/inject.js';
      script.async = true;
      script.onload = () => {
        const configScript = document.createElement('script');
        configScript.src = 'https://files.bpcontent.cloud/2025/07/23/04/20250723044542-SQAWDIIO.js';
        configScript.async = true;
        configScript.onload = () => {
          setBotpressLoaded(true);
          if (window.botpress) {
            window.botpress.init({
              botId: 'ded83eb0-0b00-4e32-87ab-f1072ae3b0dc',
              configuration: {
                version: 'v1',
                botName: 'Fitness Assistant',
                botDescription: 'Your AI fitness companion',
                website: {},
                email: {},
                phone: {},
                termsOfService: {},
                privacyPolicy: {},
                color: '#14b8a6',
                variant: 'solid',
                headerVariant: 'glass',
                themeMode: 'light',
                fontFamily: 'inter',
                radius: 4,
                feedbackEnabled: true,
                footer: '[⚡ by Botpress](https://botpress.com/?from=webchat)',
                showFloatingButton: true, // Ensure floating button is enabled
              },
              clientId: 'dc4d0166-da23-4e60-bdc5-a19f888a4935',
              selector: '#webchat-container',
            });

            // Open chat if isOpen is true
            window.botpress.on('webchat:ready', () => {
              if (isOpen) {
                window.botpress.open();
              }
            });
          } else {
            console.error('Botpress not available');
          }
        };
        document.head.appendChild(configScript);
      };
      document.head.appendChild(script);
    }

    // Show/hide chat based on isOpen state
    if (botpressLoaded && window.botpress) {
      if (isOpen) {
        window.botpress.open();
      } else {
        window.botpress.close();
      }
    }

    return () => {
      // Cleanup scripts when component unmounts
      if (!isOpen) {
        const scripts = document.querySelectorAll('script[src*="botpress"]');
        scripts.forEach((script) => script.remove());
      }
    };
  }, [isOpen, botpressLoaded]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-20 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200"
        >
          {/* Chat Header */}
          <div className="bg-teal-500 text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Fitness Assistant</h3>
              <p className="text-sm">Ask me anything about fitness!</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <FaTimes size={20} />
            </button>
          </div>

          {/* Chat Content */}
          <div className="h-[calc(100%-80px)] relative">
            {!botpressLoaded ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaComments size={32} className="mx-auto mb-2 text-teal-500 animate-pulse" />
                  <p>Loading chat...</p>
                </div>
              </div>
            ) : (
              <div
                id="webchat-container"
                className="h-full w-full"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                }}
              />
            )}
          </div>

          {/* Custom Styles for Botpress */}
          <style jsx>{`
            #webchat-container .bpWebchat {
              position: unset !important;
              width: 100% !important;
              height: 100% !important;
              max-height: 100% !important;
              max-width: 100% !important;
              border-radius: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
            #webchat-container .bpFab {
              display: block !important;
              bottom: 20px !important;
              right: 20px !important;
              z-index: 1000 !important;
              background-color: #14b8a6 !important;
              border-radius: 50% !important;
              width: 60px !important;
              height: 60px !important;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2) !important;
            }
            #webchat-container .bpHeader {
              display: none !important;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow"
  >
    <div className="text-4xl mb-4 mx-auto">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

// Testimonial Component
const Testimonial = ({ name, feedback }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-gray-50 p-4 rounded-lg shadow-sm"
  >
    <p className="text-gray-700 italic">"{feedback}"</p>
    <div className="mt-3 text-sm text-gray-500">— {name}</div>
  </motion.div>
);

// Stat Card Component
const Stat = ({ number, label }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="text-center"
  >
    <h3 className="text-3xl font-bold text-teal-600">{number}</h3>
    <p className="text-gray-700">{label}</p>
  </motion.div>
);

// FAQ Item Component
const FaqItem = ({ question, answer }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-4 rounded-lg shadow-md"
  >
    <div className="flex items-center gap-2 mb-2 text-teal-600">
      <FaQuestionCircle />
      <h4 className="text-lg font-semibold">{question}</h4>
    </div>
    <p className="text-gray-700">{answer}</p>
  </motion.div>
);