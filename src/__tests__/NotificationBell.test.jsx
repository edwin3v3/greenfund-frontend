import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';

// Mock the API client
jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('NotificationBell Component', () => {
  const mockNotifications = [
    {
      id: 1,
      message: 'Test notification 1',
      is_read: false,
      created_at: '2025-10-28T10:00:00Z'
    },
    {
      id: 2,
      message: 'Test notification 2',
      is_read: true,
      created_at: '2025-10-28T09:00:00Z'
    }
  ];

  beforeEach(() => {
    // Reset mock API responses
    const apiClient = require('../services/api').default;
    apiClient.get.mockImplementation((url) => {
      if (url === '/notifications/unread-count') {
        return Promise.resolve({ data: { unread_count: 1 } });
      }
      if (url.startsWith('/notifications/')) {
        return Promise.resolve({ data: mockNotifications });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  test('renders notification bell with unread count', async () => {
    render(
      <BrowserRouter>
        <NotificationBell />
      </BrowserRouter>
    );
    
    const bellIcon = screen.getByRole('button', { name: /notifications/i });
    expect(bellIcon).toBeInTheDocument();
    
    // findBy wraps in act and waits for async updates
    const count = await screen.findByText('1');
    expect(count).toBeInTheDocument();
  });

  test('opens notification dropdown when clicked', async () => {
    render(
      <BrowserRouter>
        <NotificationBell />
      </BrowserRouter>
    );
    
    const bellIcon = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(bellIcon);
    
    expect(await screen.findByText('Test notification 1')).toBeInTheDocument();
    expect(await screen.findByText('Test notification 2')).toBeInTheDocument();
  });

  test('shows loading state when fetching notifications', async () => {
    render(
      <BrowserRouter>
        <NotificationBell />
      </BrowserRouter>
    );
    
    const bellIcon = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(bellIcon);
    
    // component shows a spinner SVG while loading; assert spinner exists
    await waitFor(() => expect(document.querySelector('.animate-spin')).toBeInTheDocument());
  });

  test('marks notification as read when clicking Mark Read', async () => {
    const apiClient = require('../services/api').default;
    apiClient.post.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <NotificationBell />
      </BrowserRouter>
    );
    
    const bellIcon = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(bellIcon);
    
    await screen.findByText('Test notification 1');

    const markReadButton = await screen.findByText('Mark Read');
    fireEvent.click(markReadButton);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/notifications/1/mark-read');
    });
  });

  test('marks all notifications as read', async () => {
    const apiClient = require('../services/api').default;
    apiClient.post.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <NotificationBell />
      </BrowserRouter>
    );
    
    const bellIcon = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(bellIcon);
    
    await screen.findByText('Mark all as read');

    const markAllButton = screen.getByText('Mark all as read');
    fireEvent.click(markAllButton);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/notifications/mark-all-read');
    });
  });

  test('shows error message when API request fails', async () => {
    const apiClient = require('../services/api').default;
    apiClient.get.mockRejectedValueOnce(new Error('API Error'));
    const toast = require('react-hot-toast').default;

    render(
      <BrowserRouter>
        <NotificationBell />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Could not load notifications.');
    });
  });

  test('shows empty state when no notifications', async () => {
    const apiClient = require('../services/api').default;
    apiClient.get.mockImplementation((url) => {
      if (url === '/notifications/unread-count') {
        return Promise.resolve({ data: { unread_count: 0 } });
      }
      if (url.startsWith('/notifications/')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Not found'));
    });

    render(
      <BrowserRouter>
        <NotificationBell />
      </BrowserRouter>
    );
    
    const bellIcon = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(bellIcon);
    
    await screen.findByText('No notifications yet.');
  });

  test('closes dropdown when clicking outside', async () => {
    render(
      <BrowserRouter>
        <div>
          <NotificationBell />
          <div data-testid="outside">Outside Element</div>
        </div>
      </BrowserRouter>
    );
    
    const bellIcon = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(bellIcon);

    await screen.findByText('Notifications');

    fireEvent.mouseDown(screen.getByTestId('outside'));

    await waitFor(() => {
      expect(screen.queryByText('Test notification 1')).not.toBeInTheDocument();
    });
  });
});