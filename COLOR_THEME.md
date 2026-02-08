# Professional Color Theme - Elegant Teal & Slate

## Primary Colors

### Main Colors
- **Teal**: `#1F4959` - Primary accent, cards, backgrounds
- **Slate Blue**: `#5C7C89` - Secondary accent, borders, text highlights
- **Deep Teal**: `#011425` - Main background
- **Dark Gray**: `#242424` - Input backgrounds, secondary surfaces
- **White**: `#FFFFFF` - Primary text

## Usage Guide

### Backgrounds
- Main page background: `bg-[#011425]`
- Card/Container background: `bg-[#1F4959]/50` with `backdrop-blur-xl`
- Input fields: `bg-[#242424]/50`

### Text Colors
- Primary text: `text-white`
- Secondary text: `text-white/70` or `text-white/60`
- Accent text: `text-[#5C7C89]`
- Completed/muted text: `text-[#5C7C89]/50`

### Borders & Shadows
- Borders: `border-[#5C7C89]/20` (normal), `border-[#5C7C89]/40` (hover)
- Shadows: `shadow-[#5C7C89]/10` (normal), `shadow-[#5C7C89]/30` (buttons)

### Gradients
- Primary gradient: `from-[#5C7C89] to-[#1F4959]`
- Text gradient: `from-[#5C7C89] via-[#1F4959] to-[#5C7C89]`
- Background effects: `bg-[#5C7C89]/5` or `bg-[#1F4959]/5` with `blur-3xl`

### Interactive Elements
- Buttons: `bg-gradient-to-r from-[#5C7C89] to-[#1F4959]`
- Hover states: Add `/90` or `/80` opacity to colors
- Focus rings: `focus:ring-[#5C7C89]`
- Checkboxes: `text-[#5C7C89]` with `bg-[#242424]/50`

## Component Examples

### Card
```tsx
className="bg-[#1F4959]/50 backdrop-blur-xl border border-[#5C7C89]/20 rounded-2xl p-6 hover:border-[#5C7C89]/40 hover:shadow-lg hover:shadow-[#5C7C89]/10"
```

### Button
```tsx
className="bg-gradient-to-r from-[#5C7C89] to-[#1F4959] text-white hover:from-[#5C7C89]/90 hover:to-[#1F4959]/90 shadow-lg shadow-[#5C7C89]/30"
```

### Input
```tsx
className="bg-[#242424]/50 border border-[#5C7C89]/30 text-white placeholder-white/40 focus:ring-2 focus:ring-[#5C7C89]"
```

### Background Blur Effect
```tsx
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5C7C89]/5 rounded-full blur-3xl"></div>
  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1F4959]/5 rounded-full blur-3xl"></div>
</div>
```

## Design Principles
- Professional and elegant appearance
- Consistent use of teal/slate color palette
- Glassmorphism effects with backdrop blur
- Smooth transitions and hover states
- High contrast for accessibility
- Subtle shadows and borders for depth
