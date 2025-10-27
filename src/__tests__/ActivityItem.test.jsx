import React from 'react';
import { render, screen } from '@testing-library/react';

// Extract ActivityItem component
const ActivityItem = ({ icon, text, time, color }) => (
    <div className="flex items-center gap-4 py-3 border-b last:border-b-0">
        <div className={w-10 h-10 rounded-full flex items-center justify-center text-xl ${color}}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-text-primary">{text}</p>
            <p className="text-xs text-text-secondary">{time}</p>
        </div>
    </div>
);

describe('ActivityItem Component', () => {
  const defaultProps = {
    icon: '🚜',
    text: 'Test Activity',
    time: '2 hours ago',
    color: 'bg-green-100 text-green-600'
  };

  test('renders activity text and time', () => {
    render(<ActivityItem {...defaultProps} />);
    expect(screen.getByText('Test Activity')).toBeInTheDocument();
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
  });

  test('applies custom color class', () => {
    render(<ActivityItem {...defaultProps} />);
    const iconContainer = screen.getByText('🚜').closest('div');
    expect(iconContainer).toHaveClass('w-10 h-10 rounded-full flex items-center justify-center text-xl bg-green-100 text-green-600');
  });

  test('renders different icon types', () => {
    const { rerender } = render(<ActivityItem {...defaultProps} icon="🌾" />);
    expect(screen.getByText('🌾')).toBeInTheDocument();

    rerender(<ActivityItem {...defaultProps} icon="📊" />);
    expect(screen.getByText('📊')).toBeInTheDocument();
  });

  test('renders with different text content', () => {
    render(<ActivityItem {...defaultProps} text="Added new soil sample" time="just now" />);
    expect(screen.getByText('Added new soil sample')).toBeInTheDocument();
    expect(screen.getByText('just now')).toBeInTheDocument();
  });
});