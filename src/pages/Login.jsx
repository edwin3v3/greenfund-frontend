import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // 1. We only need useAuth
import { FiLogIn, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 2. Get the login function from the context
  const { login } = useAuth();

  // 3. This is the new, simplified submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    
    setLoading(true);
    try {
      // 4. Call the 'login' function from AuthContext.
      // This one function does EVERYTHING:
      // - Calls /api/auth/token
      // - Saves to localStorage
      // - Fetches /api/users/me
      // - Navigates to dashboard on success
      // - Shows a toast on error
      await login(email, password);
      
    } catch (error) {
      // The context already shows a toast, so we just log here
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      <div className="relative z-10 max-w-md w-full bg-surface p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
          Login to GreenFund
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-text-secondary mb-2" htmlFor="username">Email</label>
            <input
              type="email"
              name="username"
              id="username"
              value={email} // Controlled by email state
              onChange={(e) => setEmail(e.target.value)} // Update email state
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-text-secondary mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password} // Controlled by password state
              onChange={(e) => setPassword(e.target.value)} // Update password state
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50"
          >
            {loading ? <FiLoader className="animate-spin mx-auto" /> : "Login"}
          </button>
        </form>
        <p className="text-center text-text-secondary mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;