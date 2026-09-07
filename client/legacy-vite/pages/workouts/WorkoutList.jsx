import { useGetWorkoutsQuery } from '../../api/workoutApi';
import WorkoutCard from '../../components/workouts/WorkoutCard';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';
import { Plus, Dumbbell, RefreshCw, AlertTriangle } from 'lucide-react';

export default function WorkoutList() {
  const { data: workouts, isLoading, error, refetch } = useGetWorkoutsQuery();

  if (isLoading) return <Loader />;

  if (error) return (
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
          {error?.data?.message || error.message || 'Failed to load workouts'}
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
                Your Workouts
              </h1>
              <p className="text-gray-600 text-lg font-medium mt-1">
                {workouts?.length ? `${workouts.length} workout${workouts.length !== 1 ? 's' : ''} available` : 'Build your fitness routine'}
              </p>
            </div>
          </div>
          
          <Link
            to="/workouts/new"
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl font-semibold text-base transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            aria-label="Create a new workout"
          >
            <Plus size={20} />
            Create Workout
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">
          {(!workouts || workouts.length === 0) ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border border-gray-100"
            >
              <div className="max-w-md mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="h-20 w-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-lg">
                    <Dumbbell className="h-10 w-10 text-gray-500" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Workouts Found</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Ready to start your fitness journey? Create your first workout and begin building your routine!
                </p>
                
                <Link
                  to="/workouts/new"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  aria-label="Create your first workout"
                >
                  <Plus size={22} />
                  Create Your First Workout
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="workout-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {workouts.map((workout, index) => (
                <motion.div
                  key={workout._id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="transform transition-all duration-200"
                >
                  <WorkoutCard workout={workout} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Section */}
        {workouts && workouts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            <div className="bg-gradient-to-br from-white to-teal-50 rounded-xl p-6 shadow-lg border border-teal-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-teal-600 uppercase tracking-wide">Total Workouts</p>
                  <p className="text-2xl font-bold text-gray-800">{workouts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-cyan-50 rounded-xl p-6 shadow-lg border border-cyan-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide">Ready to Go</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {workouts.filter(w => w.exercises && w.exercises.length > 0).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">This Month</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {workouts.filter(w => {
                      const workoutDate = new Date(w.createdAt);
                      const currentDate = new Date();
                      return workoutDate.getMonth() === currentDate.getMonth() && 
                             workoutDate.getFullYear() === currentDate.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}