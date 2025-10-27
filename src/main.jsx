import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router } from 'react-router-dom'; // <-- Router is here

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router> {/* <-- Router wraps everything */}
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: '#22c55e',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#ef4444',
                color: 'white',
              },
            },
          }}
        />
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);