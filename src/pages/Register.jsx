import React, { useState } from 'react';
import apiClient from '../services/api';
import { Link } from 'react-router-dom'; // Import Link

function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await apiClient.post('/auth/register', formData);
      setSuccess('Registration successful! You can now log in.');
      // Optionally redirect to login page after a delay
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during registration.');
    }
  };

  return (
    // --- vvvv MODIFIED OUTER DIV vvvv ---
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center" // Removed bg-background, added bg-cover/center
      style={{ backgroundImage: "url('/images/login-bg2.jpg')" }} // <-- Path to your image
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Form Card (Ensure it's above overlay) */}
      <div className="relative z-10 max-w-md w-full bg-surface p-8 rounded-lg shadow-xl">
    {/* --- ^^^^ END MODIFICATIONS ^^^^ --- */}

        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
          Create Your GreenFund Account
        </h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

          <div className="mb-4">
            <label className="block text-text-secondary mb-2" htmlFor="full_name">Full Name</label>
            <input
              type="text"
              name="full_name"
              id="full_name"
              onChange={handleChange}
              value={formData.full_name} // Keep value controlled
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-text-secondary mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              value={formData.email} // Keep value controlled
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
              onChange={handleChange}
              value={formData.password} // Keep value controlled
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Register
          </button>
        </form>
        {/* Added Link to Login Page */}
         <p className="text-sm text-center text-gray-600 mt-4">
           Already have an account?{' '}
           <Link to="/login" className="font-medium text-primary hover:text-green-700">
             Log in
           </Link>
         </p>
      </div>
    </div>
  );
}

export default Register;