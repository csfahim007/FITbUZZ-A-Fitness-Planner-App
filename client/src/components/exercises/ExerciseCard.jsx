import { useState } from 'react';
import { useUpdateExerciseMutation, useDeleteExerciseMutation } from '../../api/exerciseApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Check, X, MoreVertical, Dumbbell, Target, Zap } from 'lucide-react';

export default function ExerciseCard({ exercise }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [editData, setEditData] = useState({
    name: exercise.name,
    muscleGroup: exercise.muscleGroup,
    equipment: exercise.equipment,
    instructions: exercise.instructions,
    caloriesPerRep: exercise.caloriesPerRep
  });

  const [updateExercise, { isLoading: isUpdating }] = useUpdateExerciseMutation();
  const [deleteExercise, { isLoading: isDeleting }] = useDeleteExerciseMutation();

  const handleEdit = () => {
    setIsEditing(true);
    setShowOptions(false);
  };

  const handleSave = async () => {
    try {
      await updateExercise({ id: exercise._id, ...editData }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update exercise:', error);
      alert(error?.data?.message || error?.message || 'Failed to update exercise. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditData({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
      instructions: exercise.instructions,
      caloriesPerRep: exercise.caloriesPerRep
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        const result = await deleteExercise(exercise._id).unwrap();
        console.log('Exercise deleted successfully:', result);
      } catch (error) {
        console.error('Failed to delete exercise:', error);
        alert(error?.data?.message || error?.message || 'Failed to delete exercise. Please try again.');
      }
    }
    setShowOptions(false);
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  // Get muscle group color scheme
  const getMuscleGroupColor = (muscleGroup) => {
    const colors = {
      chest: 'from-red-400 to-pink-500',
      back: 'from-blue-400 to-indigo-500',
      arms: 'from-purple-400 to-violet-500',
      shoulders: 'from-orange-400 to-red-500',
      legs: 'from-green-400 to-emerald-500',
      core: 'from-yellow-400 to-orange-500',
      'full-body': 'from-teal-400 to-cyan-500'
    };
    return colors[muscleGroup] || 'from-gray-400 to-gray-500';
  };

  // Get equipment icon color
  const getEquipmentColor = (equipment) => {
    const colors = {
      bodyweight: 'text-emerald-600 bg-emerald-100',
      barbell: 'text-red-600 bg-red-100',
      dumbbell: 'text-blue-600 bg-blue-100',
      machine: 'text-purple-600 bg-purple-100',
      kettlebell: 'text-orange-600 bg-orange-100',
      cable: 'text-cyan-600 bg-cyan-100',
      bands: 'text-pink-600 bg-pink-100',
      other: 'text-gray-600 bg-gray-100'
    };
    return colors[equipment] || 'text-gray-600 bg-gray-100';
  };

  return (
    <motion.div
      layout
      className="relative bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 p-6 group overflow-hidden"
      onMouseLeave={() => setShowOptions(false)}
    >
      {/* Decorative gradient background */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getMuscleGroupColor(exercise.muscleGroup)}`} />
      
      {/* Options Menu */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-105"
          disabled={isEditing}
        >
          <MoreVertical size={16} className="text-gray-600" />
        </button>
        
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden"
            >
              <button
                onClick={handleEdit}
                className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 flex items-center gap-3 transition-all duration-200"
              >
                <Edit2 size={16} className="text-teal-600" />
                <span className="text-gray-700">Edit</span>
              </button>
              <div className="h-px bg-gray-100" />
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-3 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Trash2 size={16} />
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit/Save Controls */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 right-20 flex gap-2 z-10"
          >
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="p-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-full text-white transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="p-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full text-white transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="space-y-4">
        {/* Exercise Name with Icon */}
        <div className="flex items-start gap-3">
          <div className={`h-12 w-12 bg-gradient-to-br ${getMuscleGroupColor(exercise.muscleGroup)} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full text-xl font-bold text-gray-800 border-b-2 border-teal-500 bg-transparent focus:outline-none pb-1"
                required
              />
            ) : (
              <h3 className="text-xl font-bold text-gray-800 mb-1 pr-12 leading-tight">{exercise.name}</h3>
            )}
          </div>
        </div>

        {/* Muscle Group and Equipment Tags */}
        <div className="flex flex-wrap gap-3">
          {isEditing ? (
            <>
              <select
                value={editData.muscleGroup}
                onChange={(e) => handleChange('muscleGroup', e.target.value)}
                className="px-3 py-2 text-sm font-semibold bg-white border-2 border-teal-200 text-teal-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                required
              >
                <option value="chest">Chest</option>
                <option value="back">Back</option>
                <option value="arms">Arms</option>
                <option value="shoulders">Shoulders</option>
                <option value="legs">Legs</option>
                <option value="core">Core</option>
                <option value="full-body">Full Body</option>
              </select>
              <select
                value={editData.equipment}
                onChange={(e) => handleChange('equipment', e.target.value)}
                className="px-3 py-2 text-sm font-semibold bg-white border-2 border-cyan-200 text-cyan-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                required
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
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Target size={16} className="text-teal-600" />
                <span className="px-3 py-1 text-sm font-semibold bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-lg capitalize border border-teal-200">
                  {exercise.muscleGroup}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Dumbbell size={16} className="text-cyan-600" />
                <span className={`px-3 py-1 text-sm font-semibold rounded-lg capitalize border ${getEquipmentColor(exercise.equipment)} border-opacity-30`}>
                  {exercise.equipment}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Instructions */}
        {isEditing ? (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Target size={14} />
              Instructions
            </label>
            <textarea
              value={editData.instructions}
              onChange={(e) => handleChange('instructions', e.target.value)}
              rows={4}
              className="w-full text-sm text-gray-700 border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none"
              placeholder="Enter detailed exercise instructions..."
            />
          </div>
        ) : (
          exercise.instructions && (
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed">{exercise.instructions}</p>
            </div>
          )
        )}

        {/* Calories Section */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Calories per rep:</span>
          </div>
          
          {isEditing ? (
            <input
              type="number"
              min="0"
              step="0.1"
              value={editData.caloriesPerRep}
              onChange={(e) => handleChange('caloriesPerRep', parseFloat(e.target.value) || 0)}
              className="w-20 text-sm font-semibold border-2 border-orange-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500 text-center"
            />
          ) : (
            <span className="text-lg font-bold text-orange-600">
              {exercise.caloriesPerRep || 0}
            </span>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {(isUpdating || isDeleting) && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-teal-200 border-t-teal-600"></div>
            <span className="text-sm font-semibold text-teal-600">
              {isUpdating ? 'Updating...' : 'Deleting...'}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}