import { render, screen } from '@testing-library/react';
import FeaturesSection from '../FeaturesSection';

describe('FeaturesSection', () => {
  it('renders the section heading', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/WorkNest meets HR teams where they are/)).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    render(<FeaturesSection />);
    
    expect(screen.getByText('Easy Onboarding')).toBeInTheDocument();
    expect(screen.getByText('Easy Management')).toBeInTheDocument();
    expect(screen.getByText('Easy Review Process')).toBeInTheDocument();
    expect(screen.getByText('Better Analytics')).toBeInTheDocument();
  });

  it('displays feature descriptions', () => {
    render(<FeaturesSection />);
    
    expect(screen.getByText(/Welcome new hires with streamlined digital onboarding/)).toBeInTheDocument();
    expect(screen.getByText(/Manage your entire workforce from one intuitive dashboard/)).toBeInTheDocument();
  });

  it('renders feature letters', () => {
    render(<FeaturesSection />);
    
    // Check for the actual letters rendered (a, i, f, p based on the output)
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('i')).toBeInTheDocument();
    expect(screen.getByText('f')).toBeInTheDocument();
    expect(screen.getByText('p')).toBeInTheDocument();
  });

  it('has correct background color', () => {
    const { container } = render(<FeaturesSection />);
    const section = container.querySelector('section');
    
    expect(section).toHaveClass('bg-[#F5F1DC]');
  });
});
