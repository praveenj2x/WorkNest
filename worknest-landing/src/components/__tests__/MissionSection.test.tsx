import { render, screen } from '@testing-library/react';
import MissionSection from '../MissionSection';

describe('MissionSection', () => {
  it('renders the section label', () => {
    render(<MissionSection />);
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
  });

  it('renders the main heading', () => {
    render(<MissionSection />);
    expect(screen.getByText('Transforming HR for the Future of Work')).toBeInTheDocument();
  });

  it('renders mission statements', () => {
    render(<MissionSection />);
    
    expect(screen.getByText(/We believe that great companies are built by great people/)).toBeInTheDocument();
    expect(screen.getByText(/By combining cutting-edge AI with human-centered design/)).toBeInTheDocument();
  });

  it('renders all mission points', () => {
    render(<MissionSection />);
    
    expect(screen.getByText(/Simplify complex HR processes with intelligent automation/)).toBeInTheDocument();
    expect(screen.getByText(/Provide actionable insights that drive better decision-making/)).toBeInTheDocument();
    expect(screen.getByText(/Create more engaging and supportive employee experiences/)).toBeInTheDocument();
  });

  it('renders the large letter display', () => {
    render(<MissionSection />);
    
    const letter = screen.getByText('l');
    expect(letter).toBeInTheDocument();
    expect(letter).toHaveClass('yarndings-20-regular');
  });

  it('has correct background color', () => {
    const { container } = render(<MissionSection />);
    const section = container.querySelector('section');
    
    expect(section).toHaveClass('bg-[#F5F1DC]');
  });
});
