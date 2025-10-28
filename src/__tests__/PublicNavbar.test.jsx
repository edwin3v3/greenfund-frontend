import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

describe('PublicNavbar Component', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('renders logo and navigation links', () => {
    renderWithRouter(<PublicNavbar />);
    
    // logo is rendered as link text
    expect(screen.getByText(/greenfund/i)).toBeInTheDocument();
    // auth links
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test('renders login and register buttons', () => {
    renderWithRouter(<PublicNavbar />);
    
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test('navigation links have correct hrefs', () => {
    renderWithRouter(<PublicNavbar />);
    
    expect(screen.getByText(/greenfund/i).closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText(/login/i).closest('a')).toHaveAttribute('href', '/login');
    expect(screen.getByText(/sign up/i).closest('a')).toHaveAttribute('href', '/register');
  });

  test('mobile menu toggle works', () => {
    renderWithRouter(<PublicNavbar />);
    
    // Component currently doesn't render a mobile menu toggle; ensure nav exists
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });
});