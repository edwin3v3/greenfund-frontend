import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SoilReport from '../components/SoilReport';

// Mock API client used inside SoilReport
jest.mock('../services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() }
}));

// Mock ReportCard to simplify assertions
jest.mock('../components/ReportCard', () => ({
  __esModule: true,
  default: function MockReportCard({ report }) {
    return (
      <div>
        <div data-testid="report-date">{report.date}</div>
        <div>pH: {report.ph}</div>
        <div>N: {report.nitrogen}</div>
        <div>{report.ai_analysis_text}</div>
        {report.suggested_crops && (
          <ul>
            {report.suggested_crops.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        )}
      </div>
    );
  }
}));

describe('SoilReport Component', () => {
  const mockFarm = { id: 'farm-1', name: 'Test Farm' };

  const mockReports = [
    {
      id: 'r1',
      date: '2025-10-28T00:00:00Z',
      ph: 6.5,
      nitrogen: 45,
      phosphorus: 30,
      potassium: 25,
      moisture: 22,
      ai_analysis_text: 'Good structure, moderate nitrogen',
      suggested_crops: ['Maize', 'Beans']
    }
  ];

  beforeEach(() => {
    const apiClient = require('../services/api').default;
    apiClient.get.mockReset();
  });

  test('renders past reports when API returns data', async () => {
    const apiClient = require('../services/api').default;
    apiClient.get.mockResolvedValueOnce({ data: mockReports });

    render(<SoilReport farm={mockFarm} />);

    expect(screen.getByText(/Submit New Test/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Good structure, moderate nitrogen/i)).toBeInTheDocument();
    });
  });

  test('renders empty state when no reports', async () => {
    const apiClient = require('../services/api').default;
    apiClient.get.mockResolvedValueOnce({ data: [] });

    render(<SoilReport farm={mockFarm} />);

    await waitFor(() => {
      expect(screen.getByText(/No soil reports submitted for this farm yet./i)).toBeInTheDocument();
    });
  });

  test('displays recommendations and suggested crops', async () => {
    const apiClient = require('../services/api').default;
    apiClient.get.mockResolvedValueOnce({ data: mockReports });

    render(<SoilReport farm={mockFarm} />);

    await waitFor(() => {
      expect(screen.getByText(/Good structure, moderate nitrogen/i)).toBeInTheDocument();
      expect(screen.getByText(/Maize/)).toBeInTheDocument();
    });
  });
});