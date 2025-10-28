import React from 'react';
import { render, screen } from '@testing-library/react';
import WeatherChart from '../components/WeatherChart';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  ComposedChart: ({ children }) => <div data-testid="composed-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />
}));

describe('WeatherChart Component', () => {
  const mockForecast = [
    {
      date: 'Mon, Oct 28',
      weatherCode: 0,
      maxTemp: 25,
      minTemp: 18,
      precipitation: 0
    },
    {
      date: 'Tue, Oct 29',
      weatherCode: 1,
      maxTemp: 23,
      minTemp: 16,
      precipitation: 20
    }
  ];

  test('renders chart container and elements', () => {
    render(<WeatherChart forecast={mockForecast} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    // two line elements are expected (Max Temp and Min Temp)
    const lines = screen.getAllByTestId('line');
    expect(lines.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getAllByTestId('y-axis').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
  });

  test('renders nothing when no forecast data', () => {
    const { container } = render(<WeatherChart forecast={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders nothing when forecast is null', () => {
    const { container } = render(<WeatherChart forecast={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});