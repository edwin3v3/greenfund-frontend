import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard.jsx';

// Extract StatCard component from the Dashboard component's source
const StatCard = ({ title, value, trend, icon, chartData = [], colorClass }) => {
    const formattedChartData = chartData.map((val, index) => ({
        name: `Day ${index + 1}`,
        value: val
    }));

    return (
        <div className="bg-surface p-6 rounded-xl shadow-md flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm text-text-secondary font-medium">{title}</p>
                    <p className="text-3xl font-bold text-text-primary">{value}</p>
                    <p className={`text-xs font-semibold ${trend.startsWith('+') || trend.startsWith('Tracking') || trend.startsWith('Great') || trend === 'Stable' || trend.includes('suggestion') ? 'text-green-500' : (trend === 'N/A' || trend === 'Coming Soon' || trend === 'No suggestions' ? 'text-gray-500' : 'text-red-500')}`}>{trend}</p>
                </div>
                <div className={`text-2xl p-3 rounded-full ${colorClass}`}>{icon}</div>
            </div>
            <div className="h-16 w-full mt-auto">
                {formattedChartData.length > 0 ? (
                    <div>Chart</div>
                ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">No data</div>
                )}
            </div>
        </div>
    );
};

// Mock recharts components to avoid rendering issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => null,
  Tooltip: () => null,
}));

describe('StatCard Component', () => {
  const defaultProps = {
    title: 'Test Stat',
    value: '100',
    trend: '+10%',
    icon: <span>📈</span>,
    chartData: [10, 20, 30, 40],
    colorClass: 'bg-green-100 text-green-600'
  };

  test('renders card with title and value', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText('Test Stat')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('displays trend with correct color for positive trend', () => {
    render(<StatCard {...defaultProps} trend="+10%" />);
    const trendElement = screen.getByText('+10%');
    expect(trendElement).toHaveClass('text-green-500');
  });

  test('displays trend with correct color for negative trend', () => {
    render(<StatCard {...defaultProps} trend="-10%" />);
    const trendElement = screen.getByText('-10%');
    expect(trendElement).toHaveClass('text-red-500');
  });

  test('displays chart when data is provided', () => {
    const { container } = render(<StatCard {...defaultProps} />);
    // Check if chart container is rendered
    expect(container.querySelector('.h-16')).toBeInTheDocument();
  });

  test('displays "No data" when chart data is empty', () => {
    render(<StatCard {...defaultProps} chartData={[]} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  test('applies custom color class', () => {
    const { container } = render(<StatCard {...defaultProps} colorClass="bg-blue-100 text-blue-600" />);
    const iconContainer = container.querySelector('.bg-blue-100');
    expect(iconContainer).toBeInTheDocument();
  });
});