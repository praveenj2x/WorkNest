import '@testing-library/jest-dom'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    svg: ({ children, ...props }) => <svg {...props}>{children}</svg>,
    path: ({ children, ...props }) => <path {...props}>{children}</path>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  useInView: () => true,
}))

// Mock GSAP
jest.mock('gsap', () => ({
  gsap: {
    registerPlugin: jest.fn(),
    context: jest.fn(() => ({
      revert: jest.fn(),
    })),
    fromTo: jest.fn(),
  },
}))

jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}))
