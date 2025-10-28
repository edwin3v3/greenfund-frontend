import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FarmCard from '../components/FarmCard';

describe('FarmCard Component', () => {
  const mockFarm = {
    id: '123',
    name: 'Green Acres Farm',
    location_text: 'California',
    size_acres: 500,
    current_crop: 'Corn'
  };

  test('renders farm information correctly', () => {
    render(
      <BrowserRouter>
        <FarmCard farm={mockFarm} />
      </BrowserRouter>
    );

    expect(screen.getByText('Green Acres Farm')).toBeInTheDocument();
    expect(screen.getByText('California')).toBeInTheDocument();
    expect(screen.getByText('500 acres')).toBeInTheDocument();
  });

  test('renders current crop information', () => {
    render(
      <BrowserRouter>
        <FarmCard farm={mockFarm} />
      </BrowserRouter>
    );

    expect(screen.getByText('Current Crop: Corn')).toBeInTheDocument();
  });

  test('renders link to farm details', () => {
    render(
      <BrowserRouter>
        <FarmCard farm={mockFarm} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/app/farms/123');
    expect(screen.getByText('View Details →')).toBeInTheDocument();
  });

  test('shows N/A when no current crop', () => {
    const farmWithoutCrop = { ...mockFarm, current_crop: null };
    render(
      <BrowserRouter>
        <FarmCard farm={farmWithoutCrop} />
      </BrowserRouter>
    );

    expect(screen.getByText('Current Crop: N/A')).toBeInTheDocument();
  });
});