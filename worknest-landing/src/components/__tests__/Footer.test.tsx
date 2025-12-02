import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the animated WorkNest branding', () => {
    render(<Footer />);
    
    // Check if all letters of WorkNest are rendered
    const letters = screen.getAllByText(/[WorkNest]/);
    expect(letters.length).toBeGreaterThan(0);
  });

  it('renders the tagline', () => {
    render(<Footer />);
    expect(screen.getByText('Empowering HR teams with intelligence.')).toBeInTheDocument();
  });

  it('renders all footer links', () => {
    render(<Footer />);
    
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2025 WorkNest/)).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    
    const socialLinks = screen.getAllByRole('listitem');
    expect(socialLinks.length).toBe(3); // Twitter, LinkedIn, GitHub
  });

  it('has correct background color', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    
    expect(footer).toHaveClass('bg-[#001BB7]');
  });

  it('footer links have correct href attributes', () => {
    render(<Footer />);
    
    const aboutLink = screen.getByText('About').closest('a');
    expect(aboutLink).toHaveAttribute('href', '/about');
    
    const featuresLink = screen.getByText('Features').closest('a');
    expect(featuresLink).toHaveAttribute('href', '/#features');
  });
});
