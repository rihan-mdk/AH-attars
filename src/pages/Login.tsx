import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile with display name
        await updateProfile(user, { displayName });

        // Create user profile in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          role: user.email === 'ahattars812@gmail.com' ? 'admin' : 'user',
          createdAt: serverTimestamp(),
        });
      }
      // Always direct to Home page (hero page) after login/signup
      navigate('/', { replace: true });
    } catch (err: any) {
      let message = 'An error occurred during authentication.';

      if (err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please try again.';
        console.warn('Auth Warning: Invalid credentials');
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already in use. Switching to Sign In...';
        console.warn('Auth Warning: Email already in use');
        // Automatically switch to login mode after a short delay
        setTimeout(() => setIsLogin(true), 2000);
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else {
        console.error('Auth Error:', err);
        message = err.message || message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address to reset your password.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: any) {
      let message = 'Could not send reset email.';
      if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F5EFE6]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-[#D8C7B0]/20"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif tracking-tighter text-[#2C2C2C] mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-[#6F6A63] text-sm">
            {isLogin ? 'Enter your credentials to access your account' : 'Join the AH attars community for a personalized experience'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#6F6A63] font-bold ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8C7B0]" size={18} />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#F5EFE6]/30 border border-[#D8C7B0]/30 rounded-xl focus:outline-none focus:border-[#2C2C2C] transition-colors text-[#2C2C2C]"
                    placeholder="John Doe"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#6F6A63] font-bold ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8C7B0]" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F5EFE6]/30 border border-[#D8C7B0]/30 rounded-xl focus:outline-none focus:border-[#2C2C2C] transition-colors text-[#2C2C2C]"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#6F6A63] font-bold ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8C7B0]" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required={isLogin}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-[#F5EFE6]/30 border border-[#D8C7B0]/30 rounded-xl focus:outline-none focus:border-[#2C2C2C] transition-colors text-[#2C2C2C]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D8C7B0] hover:text-[#6F6A63] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] text-[#6F6A63] hover:text-[#2C2C2C] uppercase tracking-widest font-bold transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>

          {resetSent && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-green-600 text-xs bg-green-50 p-3 rounded-xl border border-green-100"
            >
              <AlertCircle size={14} />
              <span>Password reset email sent! Check your inbox.</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-red-500 text-xs bg-red-50 p-3 rounded-xl border border-red-100"
            >
              <AlertCircle size={14} />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#2C2C2C] text-white rounded-xl font-medium tracking-widest uppercase text-xs hover:bg-[#1a1a1a] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail('');
              setPassword('');
              setDisplayName('');
              setError(null);
            }}
            className="text-sm text-[#6F6A63] hover:text-[#2C2C2C] transition-colors"
          >
            {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
