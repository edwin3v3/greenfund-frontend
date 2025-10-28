import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import WeatherForecast from '../components/WeatherForecast';

// Mock the API client
jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn()
  }
}));

// Mock the WeatherChart component
jest.mock('../components/WeatherChart', () => {
  return function MockWeatherChart({ forecast }) {
    return <div data-testid="weather-chart">Weather Chart</div>;
  };
});

describe('WeatherForecast Component', () => {
  const mockFarm = {
    id: '123',
    name: 'Test Farm'
  };

  const mockApiResponse = {
    forecast: {
      daily: {
        time: ['2025-10-28', '2025-10-29'],
        weathercode: [0, 1],
        temperature_2m_max: [25, 23],
        temperature_2m_min: [18, 16],
        precipitation_sum: [0, 20]
      }
    },
    recommendations: ['Water crops today', 'Prepare for rain tomorrow']
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const apiClient = require('../services/api').default;
    apiClient.get.mockResolvedValue({ data: mockApiResponse });
  });

  test('shows loading state initially', () => {
    render(<WeatherForecast farm={mockFarm} />);
    expect(screen.getByText(/loading weather data/i)).toBeInTheDocument();
  });

  test('renders weather chart after data loads', async () => {
    render(<WeatherForecast farm={mockFarm} />);
    // use findBy* which waits and wraps in act
    const chart = await screen.findByTestId('weather-chart');
    expect(chart).toBeInTheDocument();
  });

  test('calls onForecastLoaded with recommendations when data loads', async () => {
    const mockOnForecastLoaded = jest.fn();
    render(<WeatherForecast farm={mockFarm} onForecastLoaded={mockOnForecastLoaded} />);
    await waitFor(() => expect(mockOnForecastLoaded).toHaveBeenCalledWith(mockApiResponse.recommendations));
  });

  test('shows error message when API call fails', async () => {
    const apiClient = require('../services/api').default;
    apiClient.get.mockRejectedValueOnce(new Error('API Error'));

    render(<WeatherForecast farm={mockFarm} />);
    const err = await screen.findByText(/could not load weather forecast/i);
    expect(err).toBeInTheDocument();
  });

  test('does not fetch data when farm is not provided', () => {
    const apiClient = require('../services/api').default;
    apiClient.get.mockReset();
    render(<WeatherForecast />);
    expect(apiClient.get).not.toHaveBeenCalled();
  });
});