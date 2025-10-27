import '@testing-library/jest-dom';

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock framer-motion animations
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}));

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => null,
  Tooltip: () => null,
}));