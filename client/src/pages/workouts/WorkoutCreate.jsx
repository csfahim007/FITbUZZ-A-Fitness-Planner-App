import { useState } from 'react';
import { useCreateWorkoutMutation } from '../../api/workoutApi';
import { useGetExercisesQuery } from '../../api/exerciseApi';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkoutCreate() {
  const [name, setName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseDetails, setExerciseDetails] = useState({});
  const [error, setError] = useState('');

  const [createWorkout, { isLoading: isCreating }] = useCreateWorkoutMutation();
  const { data: exercises = [], isLoading: exercisesLoading, error: exercisesError } = useGetExercisesQuery();
  const navigate = useNavigate();

  const handleExerciseToggle = (exercise) => {
    const isSelected = selectedExercises.some(ex => ex._id === exercise._id);
    if (isSelected) {
      setSelectedExercises(selectedExercises.filter(ex => ex._id !== exercise._id));
      const newDetails = { ...exerciseDetails };
      delete newDetails[exercise._id];
      setExerciseDetails(newDetails);
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
      setExerciseDetails({
        ...exerciseDetails,
        [exercise._id]: { sets: 3, reps: 10, weight: 0 }
      });
    }
  };

  const handleDetailChange = (exerciseId, field, value) => {
    setExerciseDetails(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: Number(value) || 0
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide a workout name');
      return;
    }

    if (selectedExercises.length === 0) {
      setError('Please select at least one exercise');
      return;
    }

    try {
      const workoutData = {
        name: name.trim(),
        exercises: selectedExercises.map(ex => ({
          exercise: ex._id,
          ...exerciseDetails[ex._id]
        }))
      };

      console.log('Submitting workout data:', workoutData);
      await createWorkout(workoutData).unwrap();
      navigate('/workouts');
    } catch (err) {
      console.error('Failed to create workout:', err);
      setError(err?.data?.message || err?.message || 'Failed to create workout. Please try again.');
    }
  };

  if (exercisesLoading) return <Loader />;

  if (exercisesError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="content-container py-16 bg-gray-100"
      >
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-2">Error Loading Exercises</h2>
          <p className="mb-4">{exercisesError?.data?.message || exercisesError.message || 'Failed to load exercises'}</p>
          <p className="text-sm">Please create some exercises first before creating a workout.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="content-container py-16 bg-gray-100"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-extrabold text-gray-800 mb-8"
      >
        Create New Workout
      </motion.h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg p-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          >
            {error}
          </motion.div>
        )}

        <Input
          label="Workout Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Upper Body Routine"
          required
          className="border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
        />

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Select Exercises ({exercises.length} available)
          </label>
          
          {exercises.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 bg-gray-50 rounded-lg"
            >
              <p className="text-gray-500 mb-4">No exercises found. Create some exercises first!</p>
              <Button
                type="button"
                onClick={() => navigate('/exercises/create')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              >
                Create Exercise
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
              <AnimatePresence>
                {exercises.map((exercise, index) => (
                  <motion.div
                    key={exercise._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedExercises.some(ex => ex._id === exercise._id)
                        ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-200'
                        : 'bg-white hover:bg-emerald-50 border-gray-200'
                    }`}
                    onClick={() => handleExerciseToggle(exercise)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800 text-sm">{exercise.name}</h4>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedExercises.some(ex => ex._id === exercise._id)
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedExercises.some(ex => ex._id === exercise._id) && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full capitalize">
                        {exercise.muscleGroup}
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                        {exercise.equipment}
                      </span>
                    </div>
                    {exercise.caloriesPerRep > 0 && (
                      <p className="text-xs text-gray-600">{exercise.caloriesPerRep} kcal/rep</p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {selectedExercises.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="font-medium text-lg">Exercise Details ({selectedExercises.length} selected)</h3>
            <AnimatePresence>
              {selectedExercises.map((exercise, index) => (
                <motion.div
                  key={exercise._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">{exercise.name}</h4>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full capitalize">
                        {exercise.muscleGroup}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleExerciseToggle(exercise)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Sets</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={exerciseDetails[exercise._id]?.sets || 3}
                        onChange={(e) => handleDetailChange(exercise._id, 'sets', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Reps</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={exerciseDetails[exercise._id]?.reps || 10}
                        onChange={(e) => handleDetailChange(exercise._id, 'reps', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        step="0.5"
                        value={exerciseDetails[exercise._id]?.weight || 0}
                        onChange={(e) => handleDetailChange(exercise._id, 'weight', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="flex justify-end space-x-3 pt-6">
          <Button
            type="button"
            onClick={() => navigate('/workouts')}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isCreating}
            className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-full px-6 py-2"
            disabled={!name.trim() || selectedExercises.length === 0 || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Workout'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}