# HireFlow Brand & Design System

## Color Palette

### Primary Colors

- **Primary Blue**: `#2563EB` — Main brand color, CTAs, primary elements
- **Accent Blue**: `#0EA5E9` — Secondary highlights, hover states
- **Dark BG**: `#0F172A` — Dark mode background (optional)

### Semantic Colors

- **Success**: `#10B981` — Positive actions, completed tasks
- **Warning**: `#F59E0B` — Alerts, pending items
- **Danger**: `#EF4444` — Errors, critical actions
- **Gray**: `#6B7280` — Text, disabled states

### Text Colors

- **Primary Text**: `#1F2937` — Dark gray for body text
- **Secondary Text**: `#6B7280` — Lighter gray for descriptions
- **Light Text**: `#FFFFFF` — For dark backgrounds

## Typography

```
Font Stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

### Headings
- H1: 32px, 700 weight, 1.2 line-height
- H2: 28px, 700 weight, 1.2 line-height
- H3: 20px, 600 weight, 1.3 line-height
- H4: 16px, 600 weight, 1.4 line-height

### Body Text
- Regular: 14px, 400 weight, 1.5 line-height
- Small: 12px, 400 weight, 1.5 line-height

### UI Text
- Button: 14px, 600 weight
- Label: 12px, 500 weight
```

## Component Guidelines

### Buttons

- **Primary**: Blue background, white text, rounded corners (6px)
- **Secondary**: Gray background, dark text
- **Outline**: Border only, transparent background
- **States**: Hover (darker), Active (pressed), Disabled (opacity 0.5)

### Cards

- Background: White (light mode) / `#1E293B` (dark mode)
- Border: Subtle gray (1px)
- Radius: 8px
- Shadow: Subtle elevation (0px 1px 3px rgba(0,0,0,0.1))
- Spacing: 16px padding

### Forms

- Input height: 40px
- Label: 12px, 500 weight, gray color
- Error state: Red border + error message
- Focus: Blue border, no outline

### Navigation

- Header height: 64px
- Sidebar width: 280px (desktop), collapsible on mobile
- Active state: Blue background or bottom border

## Spacing System

- Base unit: 4px
- Common: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

## Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Motion & Animation

- **Micro interactions**: 150ms (hover, focus states)
- **Page transitions**: 300ms (fade, slide)
- **Loading states**: Smooth spinner (2s rotation)
- **Timing function**: ease-in-out for smoother feel

## Logo Usage

- **Min size**: 24px (favicon), 40px (header)
- **Clear space**: 8px minimum around logo
- **Versions**: Full logo (with text), icon-only, horizontal, vertical
- **Files**:
  - `hireflow-logo.svg` (full logo with text)
  - `hireflow-logo-icon.svg` (icon only)

## Tone & Voice

- Professional, yet approachable
- Encouraging and empowering (for students)
- Clear and concise communication
- Action-oriented language

---

**Next Steps**: Update colors in `tailwind.config.ts` and start building components with this system.
