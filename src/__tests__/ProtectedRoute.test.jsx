import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Mock both useAuth and useLocation hooks
jest.mock('../contexts/AuthContext', () => ({
  __esModule: true,
  useAuth: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}));

// Set up location mock before tests
const mockLocation = { pathname: '/protected-route' };

describe('ProtectedRoute Component', () => {
  const MockComponent = () => <div>Protected Content</div>;
  const { useAuth } = require('../contexts/AuthContext');
  
  beforeEach(() => {
    // Reset mocks before each test
    useAuth.mockReset();
    useLocation.mockReset();
    useLocation.mockReturnValue(mockLocation);
  });

  test('renders children when user is authenticated', () => {
    useAuth.mockReturnValue({
      user: { id: '1', name: 'Test User' },
      loading: false
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <MockComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <MockComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Component should not render protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('shows loading state while checking authentication', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <MockComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText(/checking authentication/i)).toBeInTheDocument();
  });
});