import { useGetWorkoutsQuery } from '../../api/workoutApi';
import WorkoutCard from '../../components/workouts/WorkoutCard';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';

export default function WorkoutList() {
  const { data: workouts, isLoading, error, refetch } = useGetWorkoutsQuery();

  if (isLoading) return <Loader />;

  if (error) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg max-w-md w-full text-center">
        <p className="font-semibold">Error</p>
        <p>{error?.data?.message || error.message || 'Failed to load workouts'}</p>
        <Button
          onClick={refetch}
          className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2"
        >
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Your Workouts
          </h1>
          <Link
            to="/workouts/new"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            aria-label="Create a new workout"
          >
            Create Workout
          </Link>
        </div>

        <AnimatePresence>
          {(!workouts || workouts.length === 0) ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 bg-white rounded-xl shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-800">No Workouts Found</h3>
              <p className="text-gray-500 mt-2">Start by creating your first workout!</p>
              <Link
                to="/workouts/new"
                className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                aria-label="Create your first workout"
              >
                Create Your First Workout
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workouts.map((workout, index) => (
                <motion.div
                  key={workout._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="transform transition-transform duration-200"
                >
                  <WorkoutCard workout={workout} />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}