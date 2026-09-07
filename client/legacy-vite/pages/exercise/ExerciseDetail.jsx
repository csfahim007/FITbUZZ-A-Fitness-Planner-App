import { useParams } from 'react-router-dom';
import { useGetExerciseQuery } from '../../api/exerciseApi';
import Loader from '../../components/common/Loader';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ExerciseDetail() {
  const { id } = useParams();
  const { data: exercise, isLoading, isError, error } = useGetExerciseQuery(id);

  if (isLoading) return <Loader />;
  
  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="content-container py-16 bg-gray-100 text-center"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Exercise</h2>
          <p className="text-gray-700 mb-6">
            {error?.data?.message || error.message || 'Failed to load exercise details'}
          </p>
          <Link
            to="/exercises"
            className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition"
          >
            Back to Exercises
          </Link>
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
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">{exercise?.name}</h1>
          <Link
            to="/exercises"
            className="text-emerald-600 hover:text-emerald-700"
          >
            Back to Exercises
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Details</h2>
            <div className="space-y-3">
              <p>
                <span className="font-medium text-gray-600">Muscle Group:</span>
                <span className="ml-2 capitalize">{exercise?.muscleGroup}</span>
              </p>
              <p>
                <span className="font-medium text-gray-600">Equipment:</span>
                <span className="ml-2 capitalize">{exercise?.equipment}</span>
              </p>
            </div>
          </div>
          
          {exercise?.instructions && (
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Instructions</h2>
              <p className="whitespace-pre-line text-gray-700">
                {exercise.instructions}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}