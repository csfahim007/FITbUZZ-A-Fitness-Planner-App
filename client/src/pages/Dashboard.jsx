import { useEffect, useRef } from 'react';
import { useGetWorkoutsQuery } from '../api/workoutApi';
import { useGetExercisesQuery } from '../api/exerciseApi';
import Loader from '../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { Doughnut, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  LineElement, 
  PointElement, 
  CategoryScale, 
  LinearScale,
  Filler // Add Filler plugin
} from 'chart.js';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Link } from 'react-router-dom';
import WorkoutCard from '../components/workouts/WorkoutCard';
import { 
  Activity, 
  TrendingUp, 
  Target, 
  Calendar,
  Dumbbell,
  Flame,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Plus
} from 'lucide-react';

// Register Filler plugin for filled line charts
ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

export default function Dashboard() {
  const { data: workouts = [], isLoading: workoutsLoading, error: workoutsError } = useGetWorkoutsQuery();
  const { data: exercises = [], isLoading: exercisesLoading, error: exercisesError } = useGetExercisesQuery();
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const lineChartRef = useRef(null);

  // Clean up charts on unmount to prevent canvas reuse errors
  useEffect(() => {
    return () => {
      if (chartRef1.current) {
        chartRef1.current.destroy();
      }
      if (chartRef2.current) {
        chartRef2.current.destroy();
      }
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
    };
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('Dashboard - Workouts:', workouts);
    console.log('Dashboard - Exercises:', exercises);
    console.log('Dashboard - Workouts Error:', workoutsError);
    console.log('Dashboard - Exercises Error:', exercisesError);
    console.log('Workout Dates:', workouts.map(w => ({ id: w._id, date: w.date, totalCalories: w.totalCalories })));
  }, [workouts, exercises, workoutsError, exercisesError]);

  if (workoutsLoading || exercisesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (workoutsError || exercisesError) {
    return (
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
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {workoutsError?.data?.message || exercisesError?.data?.message || 'Failed to load data'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg px-6 py-3 font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={18} />
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  // Fallback for invalid data
  if (!Array.isArray(workouts) || !Array.isArray(exercises)) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4"
      >
        <div className="bg-gradient-to-br from-white to-slate-50 shadow-xl rounded-xl p-8 max-w-md w-full text-center backdrop-blur-sm border border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-lg">
              <Dumbbell className="h-8 w-8 text-gray-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Data Available</h3>
          <p className="text-gray-500 mb-6 leading-relaxed">Start by creating exercises or workouts!</p>
          <Link
            to="/workouts/create"
            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-lg px-6 py-3 font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Create Workout
          </Link>
        </div>
      </motion.div>
    );
  }

  // Calculate workout frequency and calories
  const today = new Date();
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const dailyWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return format(workoutDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  }).length;
  const weeklyWorkouts = workouts.filter(workout => new Date(workout.date) >= startOfWeek).length;
  const monthlyWorkouts = workouts.filter(workout => new Date(workout.date) >= startOfMonth).length;

  const weeklyCalories = workouts
    .filter(workout => new Date(workout.date) >= startOfWeek)
    .reduce((sum, workout) => sum + (Number(workout.totalCalories) || 0), 0);
  const monthlyCalories = workouts
    .filter(workout => new Date(workout.date) >= startOfMonth)
    .reduce((sum, workout) => sum + (Number(workout.totalCalories) || 0), 0);

  // Fixed createGradient function - use addColorStop instead of addColorStart
  const createGradient = (ctx, chartArea, colorStart, colorEnd) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, colorStart); // Fixed: addColorStop instead of addColorStart
    gradient.addColorStop(1, colorEnd);
    return gradient;
  };

  // Calorie trend for the past 7 days
  const pastWeek = eachDayOfInterval({ start: subDays(today, 6), end: today });
  
  // Calculate calorie data for past week first
  const pastWeekCalorieData = pastWeek.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return workouts
      .filter(workout => format(new Date(workout.date), 'yyyy-MM-dd') === dateStr)
      .reduce((sum, workout) => sum + (Number(workout.totalCalories) || 0), 0);
  });

  // Check if calorie trend data is empty - define this BEFORE using it
  const hasCalorieData = workouts.length > 0 && pastWeekCalorieData.some(value => value > 0);

  const calorieTrendData = {
    labels: pastWeek.map(date => format(date, 'MMM d')),
    datasets: [{
      label: 'Calories Burned',
      data: hasCalorieData ? pastWeekCalorieData : new Array(7).fill(0),
      borderColor: '#14B8A6',
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return 'rgba(20, 184, 166, 0.2)';
        return createGradient(ctx, chartArea, 'rgba(20, 184, 166, 0.2)', 'rgba(20, 184, 166, 0.8)');
      },
      fill: true,
      tension: 0.4
    }]
  };

  // Muscle group distribution for exercises
  const muscleGroupCounts = exercises.reduce((acc, exercise) => {
    acc[exercise.muscleGroup] = (acc[exercise.muscleGroup] || 0) + 1;
    return acc;
  }, {});
  
  const hasExerciseData = exercises.length > 0 && Object.keys(muscleGroupCounts).length > 0;
  
  const muscleGroupData = {
    labels: hasExerciseData 
      ? Object.keys(muscleGroupCounts).map(label => label.charAt(0).toUpperCase() + label.slice(1))
      : ['No Exercises'],
    datasets: [{
      data: hasExerciseData ? Object.values(muscleGroupCounts) : [1],
      backgroundColor: hasExerciseData 
        ? ['#14B8A6', '#4F46E5', '#F87171', '#FBBF24', '#8B5CF6', '#EC4899', '#2DD4BF']
        : ['#E5E7EB'],
      hoverOffset: 20
    }]
  };

  // Weekly calorie burn chart
  const calorieData = {
    labels: ['Calories Burned', 'Remaining Goal'],
    datasets: [{
      data: [weeklyCalories, Math.max(5000 - weeklyCalories, 0)],
      backgroundColor: ['#14B8A6', '#E5E7EB'],
      hoverOffset: 20
    }]
  };

  // Recent workouts (last 5)
  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-14 w-14 bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
              Fitness Dashboard
            </h1>
            <p className="text-gray-600 text-lg font-medium mt-1">
              Track your progress and reach your fitness goals
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Calorie Burn Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl p-8 border border-orange-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Weekly Calories Burned</h2>
            </div>
            <div className="relative h-64">
              <Doughnut
                ref={chartRef1}
                data={calorieData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom', labels: { color: '#1F2937', font: { size: 12, weight: 'bold' } } },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.label}: ${context.raw} kcal`
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="text-center mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <p className="text-gray-700 font-bold text-lg">
                {weeklyCalories} / 5000 kcal goal this week
              </p>
              {!weeklyCalories && (
                <p className="text-gray-600 mt-2 text-sm">
                  No calories burned this week. <Link to="/workouts/create" className="text-orange-600 hover:text-orange-700 font-semibold">Log a workout</Link> to start tracking!
                </p>
              )}
            </div>
          </motion.div>

          {/* Muscle Group Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl p-8 border border-purple-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Exercise Muscle Groups</h2>
            </div>
            <div className="relative h-64">
              <Doughnut
                ref={chartRef2}
                data={muscleGroupData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom', labels: { color: '#1F2937', font: { size: 12, weight: 'bold' } } },
                    tooltip: {
                      callbacks: {
                        label: (context) => hasExerciseData ? `${context.label}: ${context.raw} exercises` : 'No exercises logged'
                      }
                    }
                  }
                }}
              />
            </div>
            {!hasExerciseData && (
              <div className="text-center mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <p className="text-gray-600 text-sm">
                  No exercises logged. <Link to="/exercises/create" className="text-purple-600 hover:text-purple-700 font-semibold">Create an exercise</Link> to see muscle group distribution!
                </p>
              </div>
            )}
          </motion.div>

          {/* Calorie Trend Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-br from-white to-teal-50 rounded-2xl shadow-xl p-8 lg:col-span-2 border border-teal-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Calorie Burn Trend (Past Week)</h2>
            </div>
            <div className="relative h-64">
              <Line
                ref={lineChartRef}
                data={calorieTrendData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Calories Burned (kcal)', color: '#1F2937', font: { weight: 'bold' } },
                      ticks: { color: '#1F2937', font: { weight: 'bold' } },
                      grid: { color: 'rgba(156, 163, 175, 0.3)' }
                    },
                    x: {
                      title: { display: true, text: 'Date', color: '#1F2937', font: { weight: 'bold' } },
                      ticks: { color: '#1F2937', font: { weight: 'bold' } },
                      grid: { color: 'rgba(156, 163, 175, 0.3)' }
                    }
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => hasCalorieData ? `${context.raw} kcal` : 'No calories burned'
                      }
                    }
                  }
                }}
              />
              {!hasCalorieData && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border-2 border-dashed border-teal-300">
                  <div className="text-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-teal-600" />
                    </div>
                    <p className="text-gray-600 font-semibold">No calorie data for the past week.</p>
                    <Link to="/workouts/create" className="text-teal-600 hover:text-teal-700 font-bold">Log a workout</Link>
                    <span className="text-gray-600"> to see trends!</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Workouts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 lg:col-span-2 border border-blue-100"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Dumbbell className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Recent Workouts</h2>
                {recentWorkouts.length > 0 && (
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                    {recentWorkouts.length} {recentWorkouts.length === 1 ? 'workout' : 'workouts'}
                  </span>
                )}
              </div>
              <Link
                to="/workouts"
                className="text-blue-600 hover:text-blue-700 text-sm font-bold bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-200 hover:border-blue-300 transition-all"
              >
                View All
              </Link>
            </div>
            <AnimatePresence>
              {recentWorkouts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16 bg-gradient-to-br from-slate-50 to-blue-100 rounded-xl border-2 border-dashed border-blue-300"
                >
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full flex items-center justify-center">
                      <Dumbbell className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No workouts yet</h3>
                  <p className="text-gray-600 mb-4">Start your fitness journey today!</p>
                  <Link 
                    to="/workouts/create" 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg px-6 py-3 font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg inline-flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Create Workout
                  </Link>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentWorkouts.map((workout, index) => (
                    <motion.div
                      key={workout._id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ scale: 1.02 }}
                      className="transform transition-all duration-200"
                    >
                      <WorkoutCard workout={workout} />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Progress Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl p-8 lg:col-span-2 border border-green-100"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <p className="text-gray-700 font-bold text-sm uppercase tracking-wide">Workouts Today</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{dailyWorkouts}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <p className="text-gray-700 font-bold text-sm uppercase tracking-wide">Workouts This Week</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{weeklyWorkouts}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <p className="text-gray-700 font-bold text-sm uppercase tracking-wide">Workouts This Month</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{monthlyWorkouts}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="h-5 w-5 text-orange-600" />
                    <p className="text-gray-700 font-bold text-sm uppercase tracking-wide">Weekly Calories Burned</p>
                  </div>
                  <p className="text-3xl font-bold text-orange-600">{weeklyCalories} kcal</p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-teal-600" />
                    <p className="text-gray-700 font-bold text-sm uppercase tracking-wide">Monthly Calories Burned</p>
                  </div>
                  <p className="text-3xl font-bold text-teal-600">{monthlyCalories} kcal</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200 shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Dumbbell className="h-5 w-5 text-indigo-600" />
                      <p className="text-gray-700 font-bold text-sm uppercase tracking-wide">Total Workouts</p>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">{workouts.length}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-indigo-600" />
                      <p className="text-gray-700 font-bold text-sm uppercase tracking-wide">Total Exercises</p>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">{exercises.length}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Flame className="h-5 w-5 text-indigo-600" />
                      <p className="text-gray-700 font-bold text-sm uppercase tracking-wide">Total Calories</p>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">
                      {workouts.reduce((sum, workout) => sum + (Number(workout.totalCalories) || 0), 0)} kcal
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <Link
                  to="/workouts/create"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl py-4 px-8 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 flex items-center gap-3"
                >
                  <Plus size={20} />
                  Plan Next Workout
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}