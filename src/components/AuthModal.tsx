import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogIn, Mail } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 indian-gradient rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-saffron/20 text-3xl font-serif">
                R
              </div>
              <h2 className="text-2xl font-serif font-bold mb-2 text-stone-800">Welcome to RasoiGram</h2>
              <p className="text-stone-500 text-sm">Delicious Indian meals start with what you already have.</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 flex items-center gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}

            <div className="space-y-4">
              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-14 bg-white border border-stone-200 text-stone-700 flex items-center justify-center gap-3 rounded-2xl font-semibold shadow-sm hover:bg-stone-50 transition-all active:scale-95 disabled:opacity-50"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                {loading ? 'Continuing...' : 'Continue with Google'}
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-100"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-stone-400">Secure Access</span></div>
              </div>

              <p className="text-[10px] text-stone-400 text-center px-4">
                By continuing, you agree to RasoiGram's Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
