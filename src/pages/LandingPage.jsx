import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// Icons for the features array (you can adjust these if needed)
import { FiCpu, FiCloudDrizzle, FiBarChart, FiCircle } from 'react-icons/fi';

function LandingPage() {
  const features = [
    {
      icon: <FiCpu className="text-primary"/>, // Replaced emoji with icon
      title: "AI-Powered Soil Diagnostics",
      description: "Leverage advanced AI to deeply analyze soil composition, nutrient levels, and potential deficiencies from simple inputs or photo uploads.",
      image: "/images/feature-soil.jpg" // <-- UPDATED PATH
    },
    {
      icon: <FiCloudDrizzle className="text-blue-500"/>, // Replaced emoji with icon
      title: "Intelligent Climate Adaptation",
      description: "Receive real-time weather forecasts and tailored recommendations, enabling proactive farm management and climate resilience.",
      // Using the community image here as a placeholder for climate
      image: "/images/feature-community.png" // <-- UPDATED PATH (Or use a specific climate image)
    },
    {
      icon: <FiBarChart className="text-yellow-500"/>, // Replaced emoji with icon
      title: "Sustainable Yield Optimization",
      description: "Maximize your harvests while minimizing environmental impact with data-driven insights for irrigation, fertilization, and crop rotation.",
      // Using the hero image here as a placeholder for yield
      image: "/images/hero-farm.jpg" // <-- UPDATED PATH (Or use a specific yield image)
    },
    {
      icon: <FiCircle className="text-red-500"/>, // Replaced emoji with icon
      title: "Carbon Footprint Tracking",
      description: "Monitor and manage your farm's carbon emissions with integrated activity logging, contributing to a greener future.",
      image: "/images/feature-tracking.png" // <-- UPDATED PATH
    }
  ];

  // Animation variants (keep as is)
  const containerVariants = { /* ... */ };
  const itemVariants = { /* ... */ };

  return (
    <div className="bg-background text-text-primary">
      {/* Hero Section */}
      <section
        className="relative h-[85vh] flex items-center justify-center text-center text-white p-4 bg-cover bg-center"
        // --- vvvv UPDATE BACKGROUND IMAGE vvvv ---
        style={{ backgroundImage: "url('/images/hero-farm.jpg')" }}
        // --- ^^^^ END UPDATE ^^^^ ---
      >
        <div className="absolute inset-0 bg-black/60"></div> {/* Slightly less dark overlay */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-lg">
            Cultivate Growth, Harvest Sustainability
          </h1>
          <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto font-light">
            GreenFund empowers Kenyan farmers with cutting-edge AI insights for enhanced productivity, optimized soil health, and a greener, more profitable future.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"> {/* Responsive buttons */}
            <Link
              to="/register"
              className="bg-primary text-white py-3 px-8 sm:py-4 sm:px-10 rounded-full text-lg sm:text-xl font-bold hover:bg-green-700 transition-all duration-300 shadow-lg transform hover:scale-105 w-full sm:w-auto" // Responsive width
            >
              Start Your Green Journey
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white py-3 px-8 sm:py-4 sm:px-10 rounded-full text-lg sm:text-xl font-bold hover:bg-white hover:text-primary transition-all duration-300 shadow-lg transform hover:scale-105 w-full sm:w-auto" // Responsive width
            >
              Login
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section className="py-24 bg-gradient-to-br from-surface to-gray-50">
        <div className="container mx-auto px-6 text-center">
           <motion.h2 /* ... Title animation ... */
            className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4"
             initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }}
           >
             How GreenFund Transforms Your Farm
           </motion.h2>
           <motion.p /* ... Subtitle animation ... */
             className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-16"
             initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, delay: 0.2 }}
           >
             Our intelligent platform integrates advanced technology with agricultural expertise to provide you with actionable insights and sustainable solutions.
           </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col h-full text-left" // Align text left
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover object-center" />
                <div className="p-6 sm:p-8 flex flex-col flex-grow"> {/* Adjusted padding */}
                  <div className="text-3xl sm:text-4xl mb-3 text-primary">{feature.icon}</div> {/* Adjusted size/margin */}
                  <h3 className="text-xl sm:text-2xl font-bold text-text-primary">{feature.title}</h3> {/* Adjusted size */}
                  <p className="text-base text-text-secondary mt-3 flex-grow">{feature.description}</p> {/* Adjusted size */}
                  <Link
                    to="/register"
                    className="mt-5 text-primary font-semibold hover:text-green-700 flex items-center self-start" // Align button left
                  >
                    Learn More
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8"> {/* Changed text color */}
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} GreenFund. All rights reserved.</p>
          <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 mt-4 text-xs sm:text-sm"> {/* Responsive text size */}
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;