import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Loader2, ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LoginPage: React.FC = () => {
  const { signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      await signInWithFacebook();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || "Failed to sign in with Facebook.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoggingIn(true);
    setError(null);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 flex flex-col items-center text-center space-y-8"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#007bff] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
            <Activity size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">PharmaVision AI</h1>
            <p className="text-xs font-bold text-[#007bff] uppercase tracking-[0.2em] mt-1">Enterprise Command Center</p>
          </div>
        </div>

        {/* Welcome Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">
            {isSignUp ? "Create Enterprise Account" : "Command Center Login"}
          </h2>
          <p className="text-slate-500 text-sm">
            {isSignUp ? "Join the pharmaceutical intelligence network" : "Secure access to your strategic dashboard"}
          </p>
        </div>

        {/* Error Message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-medium overflow-hidden"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="w-full space-y-4">
          {isSignUp && (
            <div className="space-y-4 w-full">
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="Username"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
            </div>
          )}
          
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full h-14 bg-[#007bff] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            {isLoggingIn ? (
              <Loader2 size={20} className="animate-spin text-white/50" />
            ) : (
              isSignUp ? "Create Account" : "Sign In"
            )}
          </button>
        </form>

        <div className="w-full flex items-center gap-4 text-slate-300">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Or continue with</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {/* Social Login Buttons */}
        <div className="w-full grid grid-cols-2 gap-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span className="font-bold text-slate-700 text-sm">Google</span>
          </button>

          <button
            onClick={handleFacebookLogin}
            disabled={isLoggingIn}
            className="h-14 bg-[#1877F2] text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-[#166fe5] transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-blue-100"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="font-bold text-sm">Facebook</span>
          </button>
        </div>

        {/* Toggle Login/SignUp */}
        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm font-bold text-[#007bff] hover:underline"
        >
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create one"}
        </button>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Grade Security</span>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center space-y-2">
        <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <a href="#" className="hover:text-slate-600 transition-colors">Legal</a>
        </div>
        <p className="text-[10px] text-slate-400">© 2026 PharmaVision AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
