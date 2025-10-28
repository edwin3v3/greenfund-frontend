import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabPanel } from '../components/Tabs';

describe('Tabs Component', () => {
  test('renders all tabs', () => {
    render(
      <Tabs defaultIndex={0}>
        <TabPanel label="Overview">Overview Content</TabPanel>
        <TabPanel label="Details">Details Content</TabPanel>
        <TabPanel label="History">History Content</TabPanel>
      </Tabs>
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  test('shows correct content for active tab', () => {
    render(
      <Tabs defaultIndex={0}>
        <TabPanel label="Overview">Overview Content</TabPanel>
        <TabPanel label="Details">Details Content</TabPanel>
        <TabPanel label="History">History Content</TabPanel>
      </Tabs>
    );

    expect(screen.getByText('Overview Content')).toBeInTheDocument();
    expect(screen.queryByText('Details Content')).not.toBeInTheDocument();
    expect(screen.queryByText('History Content')).not.toBeInTheDocument();
  });

  test('switches content when clicking tabs', () => {
    render(
      <Tabs defaultIndex={0}>
        <TabPanel label="Overview">Overview Content</TabPanel>
        <TabPanel label="Details">Details Content</TabPanel>
        <TabPanel label="History">History Content</TabPanel>
      </Tabs>
    );

    fireEvent.click(screen.getByText('Details'));
    expect(screen.queryByText('Overview Content')).not.toBeInTheDocument();
    expect(screen.getByText('Details Content')).toBeInTheDocument();

    fireEvent.click(screen.getByText('History'));
    expect(screen.queryByText('Details Content')).not.toBeInTheDocument();
    expect(screen.getByText('History Content')).toBeInTheDocument();
  });

  test('renders with defaultIndex', () => {
    render(
      <Tabs defaultIndex={1}>
        <TabPanel label="Overview">Overview Content</TabPanel>
        <TabPanel label="Details">Details Content</TabPanel>
        <TabPanel label="History">History Content</TabPanel>
      </Tabs>
    );

    expect(screen.queryByText('Overview Content')).not.toBeInTheDocument();
    expect(screen.getByText('Details Content')).toBeInTheDocument();
    expect(screen.queryByText('History Content')).not.toBeInTheDocument();
  });
});