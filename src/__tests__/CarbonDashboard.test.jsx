import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CarbonDashboard from '../components/CarbonDashboard';

// Mock api client
jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn()
  }
}));

describe('CarbonDashboard Component', () => {
  const mockFarm = {
    id: '123',
    name: 'Test Farm'
  };

  const mockSummary = {
    total_carbon_kg: 1500.5,
    breakdown_by_activity: {
      Machinery: 500.3,
      Fertilizers: 600.1,
      Transportation: 400.1
    }
  };

  beforeEach(() => {
    const apiClient = require('../services/api').default;
    apiClient.get.mockReset();
  });

  test('renders carbon summary when data loads', async () => {
    const apiClient = require('../services/api').default;
    apiClient.get.mockResolvedValueOnce({ data: mockSummary });

    render(<CarbonDashboard farm={mockFarm} />);

    expect(screen.getByText(/loading carbon summary/i)).toBeInTheDocument();

    await waitFor(() => {
      // total_carbon_kg is rendered with toFixed(1), so 1500.5 should appear
      expect(screen.getByText('1500.5')).toBeInTheDocument();
    });

    expect(screen.getByText('Machinery')).toBeInTheDocument();
    expect(screen.getByText('500.3 kg CO₂e')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    const apiClient = require('../services/api').default;
    apiClient.get.mockResolvedValueOnce({ data: mockSummary });

    render(<CarbonDashboard farm={mockFarm} />);
    expect(screen.getByText(/loading carbon summary/i)).toBeInTheDocument();
  });

  test('displays error message when API fails', async () => {
    const apiClient = require('../services/api').default;
    apiClient.get.mockRejectedValueOnce(new Error('API Error'));

    render(<CarbonDashboard farm={mockFarm} />);

    await waitFor(() => {
      expect(screen.getByText(/could not load carbon summary/i)).toBeInTheDocument();
    });
  });

  test('does not fetch data when farm id is missing', () => {
    const apiClient = require('../services/api').default;
    render(<CarbonDashboard farm={{}} />);
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  test('shows breakdown by activity', async () => {
    const apiClient = require('../services/api').default;
    apiClient.get.mockResolvedValueOnce({ data: mockSummary });

    render(<CarbonDashboard farm={mockFarm} />);

    await waitFor(() => {
      expect(screen.getByText('Machinery')).toBeInTheDocument();
      expect(screen.getByText('Fertilizers')).toBeInTheDocument();
      expect(screen.getByText('Transportation')).toBeInTheDocument();
      expect(screen.getByText('500.3 kg CO₂e')).toBeInTheDocument();
      expect(screen.getByText('600.1 kg CO₂e')).toBeInTheDocument();
      expect(screen.getByText('400.1 kg CO₂e')).toBeInTheDocument();
    });
  });
});