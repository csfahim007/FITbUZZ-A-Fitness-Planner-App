import { useState } from 'react';
import { useUpdateWorkoutMutation, useDeleteWorkoutMutation } from '../../api/workoutApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Check, X, MoreVertical, Dumbbell, Clock, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WorkoutCard({ workout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [editData, setEditData] = useState({
    name: workout.name
  });

  const [updateWorkout, { isLoading: isUpdating }] = useUpdateWorkoutMutation();
  const [deleteWorkout, { isLoading: isDeleting }] = useDeleteWorkoutMutation();

  const handleEdit = () => {
    setIsEditing(true);
    setShowOptions(false);
  };

  const handleSave = async () => {
    try {
      await updateWorkout({ id: workout._id, ...editData }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update workout:', error);
      alert(error?.data?.message || error?.message || 'Failed to update workout. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditData({ name: workout.name });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        const result = await deleteWorkout(workout._id).unwrap();
        console.log('Workout deleted successfully:', result);
      } catch (error) {
        console.error('Failed to delete workout:', error);
        alert(error?.data?.message || error?.message || 'Failed to delete workout. Please try again.');
      }
    }
    setShowOptions(false);
  };

  const totalExercises = workout.exercises?.length || 0;
  const totalSets = workout.exercises?.reduce((sum, ex) => sum + (ex.sets || 0), 0) || 0;
  const estimatedDuration = Math.max(totalSets * 2, 15); // 2 mins per set, minimum 15 mins
  const totalCalories = workout.totalCalories || 0;

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
              disabled={isUpdating || !editData.name.trim()}
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
      <div className="space-y-4">
        {/* Workout Name */}
        {isEditing ? (
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full text-xl font-bold text-gray-800 border-b-2 border-emerald-500 bg-transparent focus:outline-none pr-12"
            required
          />
        ) : (
          <Link to={`/workouts/${workout._id}`}>
            <h3 className="text-xl font-bold text-gray-800 hover:text-emerald-600 transition-colors cursor-pointer pr-12">
              {workout.name}
            </h3>
          </Link>
        )}

        {/* Workout Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center">
            <div className="p-2 bg-blue-100 rounded-full mb-1">
              <Dumbbell size={16} className="text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Exercises</span>
            <span className="font-semibold text-gray-800">{totalExercises}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-2 bg-green-100 rounded-full mb-1">
              <Clock size={16} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Duration</span>
            <span className="font-semibold text-gray-800">{estimatedDuration}min</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-2 bg-orange-100 rounded-full mb-1">
              <Flame size={16} className="text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">Calories</span>
            <span className="font-semibold text-gray-800">{totalCalories}</span>
          </div>
        </div>

        {/* Exercise Preview */}
        {workout.exercises && workout.exercises.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Exercises:</h4>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {workout.exercises.slice(0, 3).map((ex, index) => (
                <div key={index} className="text-xs text-gray-600 flex justify-between">
                  <span className="truncate">{ex.exercise?.name || 'Unknown Exercise'}</span>
                  <span className="text-gray-500 ml-2">
                    {ex.sets}×{ex.reps} {ex.weight > 0 && `@ ${ex.weight}kg`}
                  </span>
                </div>
              ))}
              {workout.exercises.length > 3 && (
                <div className="text-xs text-gray-500 italic">
                  +{workout.exercises.length - 3} more exercises
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        {!isEditing && (
          <Link
            to={`/workouts/${workout._id}`}
            className="block w-full text-center bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
          >
            Start Workout
          </Link>
        )}
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