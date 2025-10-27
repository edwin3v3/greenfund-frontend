import React from 'react';
import { Link } from 'react-router-dom';

function PublicNavbar() {
  return (
    <header className="bg-surface shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          🌿 GreenFund
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-text-primary hover:text-primary transition">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-primary text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default PublicNavbar;