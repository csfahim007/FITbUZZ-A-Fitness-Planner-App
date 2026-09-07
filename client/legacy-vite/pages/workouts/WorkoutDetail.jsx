import { useParams } from 'react-router-dom';
import { useGetWorkoutQuery } from '../../api/workoutApi';
import WorkoutExerciseItem from '../../components/workouts/WorkoutExerciseItem';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';
import { format } from 'date-fns';

export default function WorkoutDetail() {
  const { id } = useParams();
  const { data: workout, isLoading, error, refetch } = useGetWorkoutQuery(id);

  if (isLoading) return <Loader />;

  if (error) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p>{error?.data?.message || error.message || 'Failed to load workout'}</p>
        <Button onClick={refetch} className="mt-4 bg-emerald-600 text-white hover:bg-emerald-700">
          Retry
        </Button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl font-extrabold text-gray-900 tracking-tight mb-8"
      >
        {workout?.name}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
      >
        <div className="mb-6">
          <p className="text-gray-600">Date: {format(new Date(workout?.date), 'MMM d, yyyy')}</p>
          {workout?.totalCalories > 0 && (
            <p className="text-gray-600">Total Calories Burned: {workout.totalCalories}</p>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-4">Exercises</h2>
        {workout?.exercises?.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 text-center"
          >
            No exercises found in this workout.
          </motion.p>
        ) : (
          <AnimatePresence>
            {workout?.exercises?.map((exerciseItem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <WorkoutExerciseItem exerciseItem={exerciseItem} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
}