import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import apiClient from '../services/api.js';

// Mock the modules we depend on
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

jest.mock('../services/api', () => ({
  get: jest.fn()
}));

// Mock framer-motion to avoid animation-related issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}));

// Wrapper component with router context
const wrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Dashboard Component', () => {
  const mockUser = {
    full_name: 'Test Farmer'
  };

  const mockApiResponses = {
    farms: { data: [{ id: 1 }, { id: 2 }] },
    badges: { data: { count: 5 } },
    emissions: { 
      data: { 
        total_emissions_kg: 100,
        daily_emissions: [20, 15, 18, 22, 19, 17, 21]
      }
    },
    suggestions: {
      data: {
        unique_suggestion_count: 3,
        recent_suggestions: ['Corn', 'Wheat', 'Soybeans']
      }
    },
    activities: {
      data: [
        { 
          id: 1,
          description: 'Added new farm',
          date: new Date().toISOString(),
          activity_type: 'FARM_ADDED'
        }
      ]
    }
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Setup default auth mock
    useAuth.mockReturnValue({ user: mockUser });

    // Setup default API response mocks
    apiClient.get.mockImplementation((endpoint) => {
      if (endpoint === '/farms/') return Promise.resolve(mockApiResponses.farms);
      if (endpoint === '/badges/me/count') return Promise.resolve(mockApiResponses.badges);
      if (endpoint === '/activities/emissions/weekly') return Promise.resolve(mockApiResponses.emissions);
      if (endpoint === '/soil/suggestions/summary') return Promise.resolve(mockApiResponses.suggestions);
      if (endpoint === '/activities/me/recent') return Promise.resolve(mockApiResponses.activities);
      return Promise.reject(new Error('Not found'));
    });
  });

  test('renders welcome message with user name', async () => {
    await act(async () => {
      render(<Dashboard />, { wrapper });
    });
    expect(screen.getByText(/Welcome back, Test Farmer!/i)).toBeInTheDocument();
  });

  test('renders navigation links', async () => {
    await act(async () => {
      render(<Dashboard />, { wrapper });
    });
    expect(screen.getByText(/Add\/View Farms/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Soil Data/i)).toBeInTheDocument();
  });

  test('displays loading state initially', async () => {
    // Mock a slow API response
    apiClient.get.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 500)));
    
    render(<Dashboard />, { wrapper });
    // Check for loading state immediately after render
    expect(screen.getByText(/Loading activity.../i)).toBeInTheDocument();
  });

  test('displays farm count after data loads', async () => {
    await act(async () => {
      render(<Dashboard />, { wrapper });
    });
    
    await waitFor(() => {
      const totalFarmsText = screen.getAllByText('2')
        .find(element => element.closest('div').textContent.includes('Total Farms'));
      expect(totalFarmsText).toBeInTheDocument();
    });
  });

  test('displays badges count after data loads', async () => {
    await act(async () => {
      render(<Dashboard />, { wrapper });
    });
    
    await waitFor(() => {
      const badgesText = screen.getAllByText('5')
        .find(element => element.closest('div').textContent.includes('Badges Earned'));
      expect(badgesText).toBeInTheDocument();
    });
  });

  test('displays weekly emissions after data loads', async () => {
    await act(async () => {
      render(<Dashboard />, { wrapper });
    });
    await waitFor(() => {
      expect(screen.getByText('100.0 kg')).toBeInTheDocument();
    });
  });

  test('displays AI suggestions count after data loads', async () => {
    await act(async () => {
      render(<Dashboard />, { wrapper });
    });
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument(); // Suggestions count
    });
  });

  test('handles API errors gracefully', async () => {
    // Mock API errors for all endpoints
    apiClient.get.mockImplementation(() => Promise.reject(new Error('API Error')));
    
    // Suppress expected console errors
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await act(async () => {
      render(<Dashboard />, { wrapper });
    });
    
    // Should still render without crashing
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Test Farmer!/i)).toBeInTheDocument();
    });

    // Default values should be shown when API fails
    await waitFor(() => {
      const totalFarmsText = screen.getAllByText('0')
        .find(element => element.closest('div').textContent.includes('Total Farms'));
      expect(totalFarmsText).toBeInTheDocument();
      expect(screen.getByText('No suggestions yet')).toBeInTheDocument();
    });

    // Clean up console spy
    consoleSpy.mockRestore();
  });

  test('displays recent activity after data loads', async () => {
    // Mock API responses with all required data
    apiClient.get.mockImplementation((endpoint) => {
      switch (endpoint) {
        case '/activities/me/recent':
          return Promise.resolve({
            data: [{
              id: 1,
              description: 'Added new farm',
              date: new Date().toISOString(),
              activity_type: 'FARM_ADDED'
            }]
          });
        case '/farms/':
          return Promise.resolve({ data: [] });
        case '/badges/me/count':
          return Promise.resolve({ data: { count: 0 } });
        case '/activities/emissions/weekly':
          return Promise.resolve({
            data: {
              total_emissions_kg: 0,
              daily_emissions: []
            }
          });
        case '/soil/suggestions/summary':
          return Promise.resolve({
            data: {
              unique_suggestion_count: 0,
              recent_suggestions: []
            }
          });
        default:
          return Promise.resolve({ data: [] });
      }
    });

    await act(async () => {
      render(<Dashboard />, { wrapper });
    });
    
    // Then should show the activity
    await waitFor(() => {
      expect(screen.getByText(/Added new farm/i)).toBeInTheDocument();
    });
  });
});