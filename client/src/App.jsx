// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import WorkoutList from './pages/workouts/WorkoutList';
import WorkoutDetail from './pages/workouts/WorkoutDetail';
import WorkoutCreate from './pages/workouts/WorkoutCreate';
import ExerciseList from './pages/exercise/ExerciseList';
import ExerciseDetail from './pages/exercise/ExerciseDetail';
import ExerciseCreate from './pages/exercise/ExerciseCreate';
import NutritionTracker from './pages/nutrition/NutritionTracker';
import Dashboard from './pages/Dashboard';
import MyAccount from './pages/MyAccount';
import NotFound from './pages/NotFound';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Terms from './components/common/Terms';
import Privacy from './components/common/Privacy';
import Contact from './components/common/Contact';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/workouts" element={<WorkoutList />} />
              <Route path="/workouts/:id" element={<WorkoutDetail />} />
              <Route path="/workouts/new" element={<WorkoutCreate />} />
              <Route path="/exercises" element={<ExerciseList />} />
              <Route path="/exercises/:id" element={<ExerciseDetail />} />
              <Route path="/exercises/new" element={<ExerciseCreate />} />
              <Route path="/nutrition" element={<NutritionTracker />} />
            </Route>
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;