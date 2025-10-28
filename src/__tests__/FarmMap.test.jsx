import React from 'react';
import { render, screen } from '@testing-library/react';
import FarmMap from '../components/FarmMap';

// Mock Leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }) => <div data-testid="map-marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="map-popup">{children}</div>
}));

describe('FarmMap Component', () => {
  const mockFarm = {
    name: 'Test Farm',
    latitude: 34.0522,
    longitude: -118.2437,
    location_text: 'Los Angeles, CA'
  };

  test('renders map container', () => {
    render(<FarmMap farm={mockFarm} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  test('renders map layers', () => {
    render(<FarmMap farm={mockFarm} />);
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });

  test('renders farm marker', () => {
    render(<FarmMap farm={mockFarm} />);
    const marker = screen.getByTestId('map-marker');
    expect(marker).toBeInTheDocument();
  });

  test('displays farm information in popup', () => {
    render(<FarmMap farm={mockFarm} />);
    const popup = screen.getByTestId('map-popup');
    expect(popup).toBeInTheDocument();
    expect(popup.textContent).toMatch(/Test Farm/);
    expect(popup.textContent).toMatch(/Los Angeles, CA/);
  });

  test('renders with default center when no farm location', () => {
    const farmWithoutLocation = {
      name: 'Test Farm',
      size: '500 acres'
    };
    
    render(<FarmMap farm={farmWithoutLocation} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  test('handles zoom level prop', () => {
    render(<FarmMap farm={mockFarm} zoom={12} />);
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toBeInTheDocument();
  });
});