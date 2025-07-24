import { motion } from 'framer-motion';
import { FaFire, FaEgg, FaBreadSlice, FaOilCan } from 'react-icons/fa';

export default function NutritionSummary({ logs = [], date }) {
  // Safely calculate totals with fallback to empty array
  const totals = (logs || []).reduce(
    (acc, log) => ({
      calories: acc.calories + (Number(log?.calories) || 0),
      protein: acc.protein + (Number(log?.protein) || 0),
      carbs: acc.carbs + (Number(log?.carbs) || 0),
      fats: acc.fats + (Number(log?.fats) || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const macroCalories = {
    protein: totals.protein * 4,
    carbs: totals.carbs * 4,
    fats: totals.fats * 9,
  };

  const totalMacroCalories = macroCalories.protein + macroCalories.carbs + macroCalories.fats;

  const macroPercentages = totalMacroCalories > 0 ? {
    protein: Math.round((macroCalories.protein / totalMacroCalories) * 100),
    carbs: Math.round((macroCalories.carbs / totalMacroCalories) * 100),
    fats: Math.round((macroCalories.fats / totalMacroCalories) * 100),
  } : { protein: 0, carbs: 0, fats: 0 };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 100 } },
    hover: { scale: 1.05, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl shadow-lg p-6 sm:p-8 mb-8"
    >
      <h2 className="text-xl font-semibold text-teal-800 mb-6">
        Daily Summary - {new Date(date).toLocaleDateString()}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          variants={statVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="bg-teal-500 text-white p-4 rounded-lg shadow-md"
        >
          <div className="flex items-center space-x-2">
            <FaFire className="text-2xl" />
            <h3 className="text-lg font-medium">Calories</h3>
          </div>
          <p className="text-2xl font-bold">{totals.calories} kcal</p>
        </motion.div>
        <motion.div
          variants={statVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="bg-emerald-500 text-white p-4 rounded-lg shadow-md"
        >
          <div className="flex items-center space-x-2">
            <FaEgg className="text-2xl" />
            <h3 className="text-lg font-medium">Protein</h3>
          </div>
          <p className="text-2xl font-bold">{totals.protein.toFixed(1)}g ({macroPercentages.protein}%)</p>
        </motion.div>
        <motion.div
          variants={statVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="bg-teal-500 text-white p-4 rounded-lg shadow-md"
        >
          <div className="flex items-center space-x-2">
            <FaBreadSlice className="text-2xl" />
            <h3 className="text-lg font-medium">Carbs</h3>
          </div>
          <p className="text-2xl font-bold">{totals.carbs.toFixed(1)}g ({macroPercentages.carbs}%)</p>
        </motion.div>
        <motion.div
          variants={statVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="bg-emerald-500 text-white p-4 rounded-lg shadow-md"
        >
          <div className="flex items-center space-x-2">
            <FaOilCan className="text-2xl" />
            <h3 className="text-lg font-medium">Fats</h3>
          </div>
          <p className="text-2xl font-bold">{totals.fats.toFixed(1)}g ({macroPercentages.fats}%)</p>
        </motion.div>
      </div>
      {(!logs || logs.length === 0) && (
        <div className="mt-4 text-center text-teal-600 bg-teal-50 p-4 rounded-lg">
          No nutrition data for this date
        </div>
      )}
    </motion.div>
  );
}