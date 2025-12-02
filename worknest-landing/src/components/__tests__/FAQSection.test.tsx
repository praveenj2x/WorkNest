import { render, screen, fireEvent } from '@testing-library/react';
import FAQSection from '../FAQSection';

describe('FAQSection', () => {
  it('renders the FAQ section title', () => {
    render(<FAQSection />);
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('renders all FAQ questions', () => {
    render(<FAQSection />);
    expect(screen.getByText('What is WorkNest?')).toBeInTheDocument();
    expect(screen.getByText('What features are you planning to offer?')).toBeInTheDocument();
    expect(screen.getByText('Is WorkNest available now?')).toBeInTheDocument();
  });

  it('toggles FAQ answer when question is clicked', () => {
    render(<FAQSection />);
    
    const firstQuestion = screen.getByText('What is WorkNest?');
    
    // Answer should not be visible initially
    expect(screen.queryByText(/WorkNest is a modern HR management platform/)).not.toBeInTheDocument();
    
    // Click to open
    fireEvent.click(firstQuestion);
    
    // Answer should now be visible
    expect(screen.getByText(/WorkNest is a modern HR management platform/)).toBeInTheDocument();
    
    // Click to close
    fireEvent.click(firstQuestion);
    
    // Answer should be hidden again
    expect(screen.queryByText(/WorkNest is a modern HR management platform/)).not.toBeInTheDocument();
  });

  it('changes icon color when FAQ is toggled', () => {
    render(<FAQSection />);
    
    const firstQuestion = screen.getByText('What is WorkNest?');
    const button = firstQuestion.closest('button');
    
    // Get the SVG icon
    const svg = button?.querySelector('svg');
    
    // Initially should have blue color class
    expect(svg).toHaveClass('text-[#0046FF]');
    
    // Click to open
    fireEvent.click(firstQuestion);
    
    // Should now have orange color class
    expect(svg).toHaveClass('text-[#FF8040]');
  });

  it('only one FAQ can be open at a time', () => {
    render(<FAQSection />);
    
    const firstQuestion = screen.getByText('What is WorkNest?');
    const secondQuestion = screen.getByText('What features are you planning to offer?');
    
    // Open first FAQ
    fireEvent.click(firstQuestion);
    expect(screen.getByText(/WorkNest is a modern HR management platform/)).toBeInTheDocument();
    
    // Open second FAQ
    fireEvent.click(secondQuestion);
    expect(screen.getByText(/We're developing features for employee onboarding/)).toBeInTheDocument();
    
    // First FAQ should be closed
    expect(screen.queryByText(/WorkNest is a modern HR management platform/)).not.toBeInTheDocument();
  });
});
