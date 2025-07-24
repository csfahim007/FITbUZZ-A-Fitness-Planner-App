import { useState } from 'react';
import { useUpdateExerciseMutation, useDeleteExerciseMutation } from '../../api/exerciseApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Check, X, MoreVertical } from 'lucide-react';

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

  return (
    <motion.div
      layout
      className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group"
      onMouseLeave={() => setShowOptions(false)}
    >
      {/* Options Menu */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          disabled={isEditing}
        >
          <MoreVertical size={16} className="text-gray-500" />
        </button>
        
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border z-10"
            >
              <button
                onClick={handleEdit}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded-t-lg flex items-center gap-2"
              >
                <Edit2 size={14} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full px-3 py-2 text-left text-sm rounded-b-lg flex items-center gap-2 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} />
                {isDeleting ? 'Deleting...' : 'Delete'}
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
            className="absolute top-4 right-16 flex gap-1"
          >
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="p-1 bg-emerald-100 hover:bg-emerald-200 rounded-full text-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={14} />
            </button>
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="p-1 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="space-y-3">
        {/* Exercise Name */}
        {isEditing ? (
          <input
            type="text"
            value={editData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full text-xl font-bold text-gray-800 border-b-2 border-emerald-500 bg-transparent focus:outline-none"
            required
          />
        ) : (
          <h3 className="text-xl font-bold text-gray-800 mb-2 pr-12">{exercise.name}</h3>
        )}

        {/* Muscle Group and Equipment */}
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <select
                value={editData.muscleGroup}
                onChange={(e) => handleChange('muscleGroup', e.target.value)}
                className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full border border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full capitalize">
                {exercise.muscleGroup}
              </span>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                {exercise.equipment}
              </span>
            </>
          )}
        </div>

        {/* Instructions */}
        {isEditing ? (
          <textarea
            value={editData.instructions}
            onChange={(e) => handleChange('instructions', e.target.value)}
            rows={3}
            className="w-full text-sm text-gray-600 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Exercise instructions..."
          />
        ) : (
          exercise.instructions && (
            <p className="text-sm text-gray-600 line-clamp-3">{exercise.instructions}</p>
          )
        )}

        {/* Calories */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Calories per rep:</span>
          {isEditing ? (
            <input
              type="number"
              min="0"
              step="0.1"
              value={editData.caloriesPerRep}
              onChange={(e) => handleChange('caloriesPerRep', parseFloat(e.target.value) || 0)}
              className="w-16 text-sm border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          ) : (
            <span className="text-sm font-medium text-emerald-600">
              {exercise.caloriesPerRep || 0}
            </span>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {(isUpdating || isDeleting) && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
        </div>
      )}
    </motion.div>
  );
}