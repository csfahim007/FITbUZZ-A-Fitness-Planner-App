import { useState } from 'react';
import { useGetNutritionLogsQuery, useLogNutritionMutation } from '../../api/nutritionApi';
import NutritionLogItem from '../../components/nutrition/NutritionLogItem';
import NutritionSummary from '../../components/nutrition/NutritionSummary';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Apple, 
  Plus, 
  AlertTriangle, 
  RefreshCw, 
  Utensils,
  TrendingUp,
  Target,
  Activity
} from 'lucide-react';

export default function NutritionTracker() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { data: logs, isLoading, error, refetch } = useGetNutritionLogsQuery(date);
  const [logNutrition, { isLoading: isLogging }] = useLogNutritionMutation();
  const [formData, setFormData] = useState({
    food: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await logNutrition({
        ...formData,
        date: new Date().toISOString(),
        calories: Number(formData.calories),
        protein: Number(formData.protein),
        carbs: Number(formData.carbs),
        fats: Number(formData.fats)
      }).unwrap();
      setFormData({
        food: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
      });
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to log nutrition');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4"
      >
        <div className="bg-gradient-to-br from-white to-red-50 border-l-4 border-red-500 shadow-xl rounded-xl p-8 max-w-md w-full text-center backdrop-blur-sm">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {error?.data?.message || error.message || 'Failed to load nutrition data'}
          </p>
          <Button
            onClick={refetch}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg px-6 py-3 font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={18} />
            Try Again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header with Date Picker */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <Apple className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
                Nutrition Tracker
              </h1>
              <p className="text-gray-600 text-lg font-medium mt-1">
                Track your daily nutrition and reach your goals
              </p>
            </div>
          </div>
          
          <div className="relative flex items-center bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="absolute left-4 text-teal-500">
              <Calendar size={20} />
            </div>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-12 pr-6 py-4 bg-transparent focus:outline-none text-gray-700 font-semibold text-base min-w-[200px]"
              aria-label="Select date for nutrition logs"
            />
          </div>
        </motion.div>

        {/* Nutrition Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <NutritionSummary logs={logs || []} date={date} />
        </motion.div>

        {/* Add Food Entry Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Add Food Entry</h2>
          </div>

          {formError && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-md"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} />
                <span className="font-semibold">{formError}</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500">
                  <Utensils size={16} />
                </div>
                <Input
                  name="food"
                  placeholder="Food name"
                  value={formData.food}
                  onChange={handleChange}
                  required
                  aria-label="Food name"
                  className="pl-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-md hover:shadow-lg transition-all text-base font-medium bg-white"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500">
                  <Activity size={16} />
                </div>
                <Input
                  name="calories"
                  type="number"
                  placeholder="Calories"
                  value={formData.calories}
                  onChange={handleChange}
                  required
                  min="0"
                  aria-label="Calories"
                  className="pl-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-md hover:shadow-lg transition-all text-base font-medium bg-white"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                  <Target size={16} />
                </div>
                <Input
                  name="protein"
                  type="number"
                  step="0.1"
                  placeholder="Protein (g)"
                  value={formData.protein}
                  onChange={handleChange}
                  required
                  min="0"
                  aria-label="Protein in grams"
                  className="pl-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md hover:shadow-lg transition-all text-base font-medium bg-white"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500">
                  <TrendingUp size={16} />
                </div>
                <Input
                  name="carbs"
                  type="number"
                  step="0.1"
                  placeholder="Carbs (g)"
                  value={formData.carbs}
                  onChange={handleChange}
                  required
                  min="0"
                  aria-label="Carbohydrates in grams"
                  className="pl-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-md hover:shadow-lg transition-all text-base font-medium bg-white"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500">
                  <Target size={16} />
                </div>
                <Input
                  name="fats"
                  type="number"
                  step="0.1"
                  placeholder="Fats (g)"
                  value={formData.fats}
                  onChange={handleChange}
                  required
                  min="0"
                  aria-label="Fats in grams"
                  className="pl-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-md hover:shadow-lg transition-all text-base font-medium bg-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLogging}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl shadow-lg hover:shadow-xl py-4 px-8 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-3"
              aria-label="Log nutrition entry"
            >
              <Plus size={20} />
              {isLogging ? 'Logging...' : 'Log Nutrition'}
            </Button>
          </form>
        </motion.div>

        {/* Nutrition Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <Apple className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Nutrition Logs</h2>
            {logs && logs.length > 0 && (
              <span className="ml-auto px-3 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-full text-sm font-semibold border border-teal-200">
                {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {(!logs || logs.length === 0) ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-16 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300"
                >
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                      <Apple className="h-8 w-8 text-gray-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No nutrition logs yet</h3>
                  <p className="text-gray-500 text-lg">
                    Start tracking your nutrition for {new Date(date).toLocaleDateString()}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="logs-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {logs.map((log, index) => (
                    <motion.div
                      key={log._id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ scale: 1.02 }}
                      className="transform transition-all duration-200"
                    >
                      <NutritionLogItem log={log} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Quick Stats Footer */}
        {logs && logs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4"
          >
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl p-4 shadow-lg border border-orange-100">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Total Calories</span>
              </div>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {logs.reduce((sum, log) => sum + log.calories, 0)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-4 shadow-lg border border-blue-100">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Protein</span>
              </div>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {logs.reduce((sum, log) => sum + log.protein, 0).toFixed(1)}g
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 shadow-lg border border-purple-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Carbs</span>
              </div>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {logs.reduce((sum, log) => sum + log.carbs, 0).toFixed(1)}g
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-yellow-50 rounded-xl p-4 shadow-lg border border-yellow-100">
              <div className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">Fats</span>
              </div>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {logs.reduce((sum, log) => sum + log.fats, 0).toFixed(1)}g
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}