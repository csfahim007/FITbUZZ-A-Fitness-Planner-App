import { useGetExercisesQuery } from '../../api/exerciseApi';
import ExerciseCard from '../../components/exercises/ExerciseCard';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExerciseList() {
  const { data: exercises = [], isLoading, isError, error, refetch } = useGetExercisesQuery();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Exercises</h2>
          <p className="mb-4">{error?.data?.message || error.message || 'Failed to load exercises'}</p>
          <Button
            onClick={refetch}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            aria-label="Retry loading exercises"
          >
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
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Your Exercises
          </h1>
          <Link
            to="/exercises/new"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-md hover:shadow-lg font-semibold"
            aria-label="Add a new exercise"
          >
            Add Exercise
          </Link>
        </motion.div>

        <AnimatePresence>
          {exercises.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-full text-center py-12 bg-white rounded-xl shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-800">No Exercises Found</h3>
              <p className="text-gray-500 mt-2">Start by creating your first exercise!</p>
              <Link
                to="/exercises/new"
                className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                aria-label="Create your first exercise"
              >
                Create First Exercise
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {exercises.map((exercise, index) => (
                <motion.div
                  key={exercise._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="transform transition-transform duration-200"
                >
                  <ExerciseCard exercise={exercise} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}