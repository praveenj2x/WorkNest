# WorkNest Landing Page - Development Instructions

## Project Overview

WorkNest is a hackathon project focused on creating an AI-powered HR management platform. This landing page showcases our vision and serves as the primary touchpoint for potential users, collaborators, and stakeholders.

## Code Standards & Best Practices

### TypeScript Requirements

**✅ Always use TypeScript**
- All components must be properly typed
- Use explicit types for props, state, and function parameters
- Avoid `any` type - use proper interfaces or union types
- Use generic types where appropriate

**Example:**
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export default function Button({ children, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  // Component implementation
}
```

### Component Structure

**✅ Functional Components Only**
- Use React functional components with hooks
- Prefer `export default` for main component exports
- Use named exports for utility functions and types

**✅ File Organization**
```
src/
├── app/                    # Next.js App Router pages
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── sections/         # Page sections
│   └── layout/           # Layout components
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── styles/               # Global styles
```

### Animation Standards

**✅ Framer Motion Guidelines**
- Use proper TypeScript types for variants
- Avoid cubic-bezier arrays in variants - use string easing instead
- Apply transitions directly to components when needed

**❌ Incorrect:**
```typescript
const variants = {
  visible: {
    opacity: 1,
    transition: { ease: [0.25, 0.46, 0.45, 0.94] } // TypeScript error
  }
}
```

**✅ Correct:**
```typescript
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

// Apply transition to component
<motion.div
  variants={variants}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
```

### Styling Guidelines

**✅ Tailwind CSS**
- Use Tailwind utility classes
- Create custom CSS classes only when necessary
- Use consistent spacing scale (4, 6, 8, 12, 16, 20, 24, 32)
- Follow mobile-first responsive design

**✅ Color Palette**
```css
/* Primary Colors */
--primary-blue: #001BB7
--secondary-blue: #0046FF
--background-cream: #F5F1DC

/* Typography */
--text-primary: #001BB7
--text-secondary: #001BB7/80
--text-muted: #001BB7/70
```

**✅ Typography System**
- Headings: `sorts-mill-goudy-regular` (serif)
- Body text: `funnel-sans-regular` (sans-serif)
- Decorative: `yarndings-20-regular` (symbols)

### Performance Optimization

**✅ Image Optimization**
- Use Next.js Image component for static images
- Implement ImageKit for dynamic image optimization
- Use proper alt text for accessibility
- Lazy load images below the fold

**✅ Code Splitting**
- Use dynamic imports for heavy components
- Implement proper loading states
- Minimize bundle size

### Accessibility Standards

**✅ WCAG 2.1 AA Compliance**
- Proper heading hierarchy (h1 → h2 → h3)
- Sufficient color contrast ratios
- Keyboard navigation support
- Screen reader compatibility
- Focus management

**✅ Semantic HTML**
```typescript
// Use semantic elements
<main>
  <section>
    <h2>Section Title</h2>
    <article>Content</article>
  </section>
</main>
```

### Error Handling

**✅ Graceful Degradation**
- Handle loading states
- Provide fallbacks for failed requests
- Use error boundaries for component errors

**✅ Form Validation**
- Client-side validation with proper error messages
- Accessible error announcements
- Clear success/failure feedback

## Development Workflow

### Getting Started

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env.local
# Add your environment variables
```

3. **Development Server**
```bash
npm run dev
```

### Code Quality

**✅ Before Committing**
- Run TypeScript check: `npm run type-check`
- Run linting: `npm run lint`
- Test responsive design on multiple devices
- Verify accessibility with screen reader

**✅ Component Checklist**
- [ ] Properly typed with TypeScript
- [ ] Responsive design implemented
- [ ] Accessibility features included
- [ ] Performance optimized
- [ ] Error handling implemented
- [ ] Clean, readable code

### Testing Strategy

**✅ Manual Testing**
- Test on Chrome, Firefox, Safari
- Mobile responsiveness (iOS/Android)
- Keyboard navigation
- Screen reader compatibility

**✅ Performance Testing**
- Lighthouse scores > 90
- Core Web Vitals optimization
- Image optimization verification

## Project-Specific Guidelines

### Hackathon Context

**✅ Honest Messaging**
- Always acknowledge prototype/development status
- No false promises about features
- Transparent about current capabilities
- Open about seeking feedback and collaboration

**✅ Contact Information**
- Use mailto links for contact forms
- Provide multiple contact options
- Clear response expectations

### Brand Guidelines

**✅ Tone of Voice**
- Professional but approachable
- Honest and transparent
- Innovation-focused
- People-first messaging

**✅ Visual Identity**
- Clean, minimal design
- Consistent spacing and typography
- Professional color palette
- Elegant animations

## File Structure Standards

```
worknest-landing/
├── public/                 # Static assets
│   ├── images/            # Optimized images
│   └── icons/             # SVG icons
├── src/
│   ├── app/               # Next.js pages
│   │   ├── about/         # About page
│   │   ├── contact/       # Contact page
│   │   ├── privacy/       # Privacy page
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # React components
│   │   ├── ui/            # Basic UI components
│   │   ├── about/         # About page components
│   │   ├── contact/       # Contact page components
│   │   └── privacy/       # Privacy page components
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript definitions
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── INSTRUCTIONS.md       # This file
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies
├── README.md             # Project overview
└── tailwind.config.js    # Tailwind configuration
```

## Common Patterns

### Page Component Structure
```typescript
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: "Page Title - WorkNest",
  description: "Page description for SEO",
};

export default function PageName() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Page content */}
      </main>
      <Footer />
    </div>
  );
}
```

### Animation Component Pattern
```typescript
"use client";
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function AnimatedSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div variants={itemVariants}>
        Content
      </motion.div>
    </motion.section>
  );
}
```

## Deployment

### Production Checklist
- [ ] All TypeScript errors resolved
- [ ] Responsive design tested
- [ ] Accessibility verified
- [ ] Performance optimized
- [ ] SEO metadata complete
- [ ] Error handling implemented
- [ ] Contact forms working
- [ ] Analytics configured

### Environment Variables
```bash
# ImageKit Configuration
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_endpoint
IMAGEKIT_PRIVATE_KEY=your_private_key

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_ga_id
```

## Support & Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **TypeScript**: https://www.typescriptlang.org/docs/

---

**Remember**: This is a hackathon project with real potential. Write code as if it will scale, but be honest about current limitations. Focus on clean, maintainable code that showcases our technical capabilities while remaining transparent about our development stage.