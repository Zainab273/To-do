---
name: frontend
description: Build modern, responsive pages, components, layouts, and styling systems. Use for all UI development tasks including React/Next.js components, CSS styling, and interactive elements.
---

# Frontend Skill – Build Pages, Components, Layout, Styling

## Overview
This skill covers building production-ready user interfaces with modern frameworks, responsive layouts, and polished styling. Focus on creating accessible, performant, and maintainable frontend code.

## Instructions

### 1. Component Architecture
- **Structure components logically**
  - Separate presentational and container components
  - Keep components focused and single-responsibility
  - Use composition over inheritance
  - Extract reusable UI elements

- **State management**
  - Use appropriate state solutions (useState, useContext, etc.)
  - Keep state as local as possible
  - Lift state only when necessary

### 2. Layout Systems
- **Responsive design**
  - Mobile-first approach (start at 320px)
  - Use CSS Grid and Flexbox appropriately
  - Breakpoints: mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
  - Test on multiple screen sizes

- **Layout patterns**
  - Container/wrapper components for content width
  - Consistent spacing system (4px, 8px, 16px, 24px, 32px, 48px, 64px)
  - Proper use of margins and padding
  - Grid systems for complex layouts

### 3. Styling Approaches
- **CSS methodologies**
  - Use Tailwind utility classes for rapid development
  - CSS Modules for component-scoped styles
  - Styled Components for dynamic styling
  - Plain CSS with BEM naming when appropriate

- **Design tokens**
  - Define color palette (primary, secondary, neutral, semantic)
  - Typography scale (text-sm, text-base, text-lg, text-xl, etc.)
  - Shadow system for depth
  - Border radius consistency

### 4. Interactive Elements
- **Animations and transitions**
  - Subtle hover effects (transform, opacity)
  - Page transition animations
  - Loading states with skeletons or spinners
  - Smooth scrolling behavior

- **User feedback**
  - Visual feedback on interactions
  - Disabled states clearly indicated
  - Error states with helpful messages
  - Success confirmations

### 5. Accessibility (a11y)
- **Semantic HTML**
  - Use proper heading hierarchy (h1 → h6)
  - Semantic elements (nav, main, article, section, aside, footer)
  - Button vs link usage (buttons for actions, links for navigation)

- **ARIA attributes**
  - aria-label for icon buttons
  - aria-hidden for decorative elements
  - aria-live regions for dynamic content
  - Proper form labels and associations

- **Keyboard navigation**
  - Logical tab order
  - Focus indicators visible
  - Keyboard shortcuts where appropriate

## Best Practices

### Performance
- Lazy load images and heavy components
- Optimize bundle size (code splitting)
- Minimize re-renders with React.memo, useMemo, useCallback
- Use web fonts efficiently (font-display: swap)

### Code Quality
- Follow consistent naming conventions
- Comment complex logic
- Keep functions small and focused
- DRY (Don't Repeat Yourself) principle

### Modern Patterns
- Server Components vs Client Components (Next.js)
- Suspense boundaries for loading states
- Error boundaries for graceful failure
- Progressive enhancement

### Browser Compatibility
- Test in major browsers (Chrome, Firefox, Safari, Edge)
- Use autoprefixer for CSS vendor prefixes
- Polyfills for older browser support when necessary

## Common Component Patterns

### Hero Section
```tsx