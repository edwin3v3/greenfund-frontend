import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ClimateActionSection from '../components/ClimateActionSection';

jest.mock('../services/api', () => ({
  get: jest.fn(),
}));

describe('ClimateActionSection Component', () => {
  const api = require('../services/api');

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading when fetching data and then displays fetched sections', async () => {
    api.get
      .mockResolvedValueOnce({ data: { alerts: [{ name: 'Locust Swarm', type: 'pest', risk_level: 'High', advice: 'Monitor fields' }] } })
      .mockResolvedValueOnce({ data: { guidance: { estimated_current_seq_rate: '0.5 t/ha', recommendations: ['Plant cover crops'] } } })
      .mockResolvedValueOnce({ data: { advice: { next_7_days_outlook: 'Dry', irrigation_advice: 'Irrigate deeply', tips: ['Mulch'] } } });

    render(<ClimateActionSection farmId="farm-1" />);

    expect(screen.getByText(/loading ai insights/i)).toBeInTheDocument();

  await waitFor(() => expect(api.get).toHaveBeenCalledTimes(3));

  await waitFor(() => expect(screen.getByText(/pest & disease alerts/i)).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText(/carbon sequestration guidance/i)).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText(/water management advice/i)).toBeInTheDocument());
  });

  test('shows error message when fetch fails', async () => {
    api.get.mockRejectedValue(new Error('Network error'));
    render(<ClimateActionSection farmId="farm-1" />);
    await waitFor(() => expect(screen.getByText(/could not load ai climate action insights/i)).toBeInTheDocument());
  });

  test('renders placeholder when no farmId provided', () => {
    render(<ClimateActionSection />);
    expect(screen.getByText(/could not load any ai climate action insights/i)).toBeInTheDocument();
  });
});