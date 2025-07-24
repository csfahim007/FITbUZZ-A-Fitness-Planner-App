import { useState } from 'react';
import { useCreateExerciseMutation } from '../../api/exerciseApi';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Target, 
  Settings, 
  FileText, 
  Flame, 
  ArrowLeft,
  Plus
} from 'lucide-react';

export default function ExerciseCreate() {
  const [formData, setFormData] = useState({
    name: '',
    muscleGroup: 'chest',
    equipment: 'bodyweight',
    instructions: '',
    caloriesPerRep: 0
  });
  const [createExercise, { isLoading }] = useCreateExerciseMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExercise(formData).unwrap();
      navigate('/exercises');
    } catch (err) {
      console.error('Failed to create exercise:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate('/exercises')}
            className="h-10 w-10 bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
              Create New Exercise
            </h1>
            <p className="text-gray-600 mt-1">Add a custom exercise to your library</p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exercise Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Dumbbell className="h-4 w-4 text-purple-500" />
                Exercise Name
              </label>
              <Input
                name="name"
                placeholder="Enter exercise name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm hover:shadow-md transition-all"
              />
            </div>

            {/* Muscle Group */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Target className="h-4 w-4 text-teal-500" />
                Muscle Group
              </label>
              <select
                name="muscleGroup"
                value={formData.muscleGroup}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:cyan-500 focus:border-pink-500 shadow-sm hover:shadow-md transition-all bg-white"
              >
                <option value="chest">Chest</option>
                <option value="back">Back</option>
                <option value="arms">Arms</option>
                <option value="shoulders">Shoulders</option>
                <option value="legs">Legs</option>
                <option value="core">Core</option>
                <option value="full-body">Full Body</option>
              </select>
            </div>

            {/* Equipment */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Settings className="h-4 w-4 text-blue-500" />
                Equipment
              </label>
              <select
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md transition-all bg-white"
              >
                <option value="bodyweight">Bodyweight</option>
                <option value="barbell">Barbell</option>
                <option value="dumbbell">Dumbbell</option>
                <option value="machine">Machine</option>
                <option value="kettlebell">Kettlebell</option>
                <option value="cable">Cable</option>
                <option value="bands">Bands</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText className="h-4 w-4 text-green-500" />
                Instructions
              </label>
              <textarea
                name="instructions"
                placeholder="Describe how to perform this exercise..."
                value={formData.instructions}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm hover:shadow-md transition-all bg-white resize-none"
              />
            </div>

            {/* Calories Per Rep */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Flame className="h-4 w-4 text-teal-500" />
                Calories per Rep
              </label>
              <div className="relative max-w-xs">
                <Input
                  name="caloriesPerRep"
                  type="number"
                  placeholder="0.5"
                  value={formData.caloriesPerRep}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-cyan-500 shadow-sm hover:shadow-md transition-all pr-12"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  kcal
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-cyan-600 rounded-xl shadow-lg hover:shadow-xl py-4 text-white font-bold text-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isLoading ? 'Creating Exercise...' : 'Create Exercise'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}