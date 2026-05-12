import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  useLocation
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import RecipeAI from './pages/RecipeAI';
import Profile from './pages/Profile';

// Components
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-premium-cream">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen pb-20 md:pb-0 vibrant-bg">
        <Navbar user={user} openAuth={() => setAuthModalOpen(true)} />
        
        <main className="max-w-md mx-auto min-h-screen bg-white shadow-2xl md:max-w-7xl md:pt-16 md:bg-transparent md:shadow-none">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route 
                path="/dashboard" 
                element={user ? <Dashboard /> : <Navigate to="/" />} 
              />
              <Route 
                path="/inventory" 
                element={user ? <Inventory /> : <Navigate to="/" />} 
              />
              <Route 
                path="/recipes" 
                element={user ? <RecipeAI /> : <Navigate to="/" />} 
              />
              <Route 
                path="/profile" 
                element={user ? <Profile /> : <Navigate to="/" />} 
              />
            </Routes>
          </AnimatePresence>
        </main>

        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    </Router>
  );
}
