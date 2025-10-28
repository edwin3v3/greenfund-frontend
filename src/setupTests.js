import React from 'react';
import '@testing-library/jest-dom';

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock framer-motion animations (provide AnimatePresence and motion.* passthroughs)
jest.mock('framer-motion', () => {
  const React = require('react');
  const MotionDiv = ({ children, ...props }) => React.createElement('div', props, children);
  const MotionSpan = ({ children, ...props }) => React.createElement('span', props, children);
  return {
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    motion: {
      div: MotionDiv,
      span: MotionSpan,
      // fallback for other motion.* usages
    },
  };
});

// Mock recharts
jest.mock('recharts', () => {
  const React = require('react');
  return {
    ResponsiveContainer: ({ children }) => React.createElement('div', null, children),
    LineChart: ({ children }) => React.createElement('div', null, children),
    Line: () => React.createElement('div', { 'data-testid': 'line' }),
    Tooltip: () => React.createElement('div', null),
  };
});

// Provide a lightweight global mock for the api client so tests don't make real network calls by default.
// Export both named and default to match different import styles in the codebase/tests
jest.mock('./services/api', () => {
  const get = jest.fn();
  const post = jest.fn();
  const defaults = { headers: { common: {} } };
  const api = { get, post, defaults };
  return { __esModule: true, default: api, ...api };
});