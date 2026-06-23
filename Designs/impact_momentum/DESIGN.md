---
name: Impact Momentum
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#424656'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#727687'
  outline-variant: '#c2c6d8'
  surface-tint: '#0054d6'
  primary: '#0050cb'
  on-primary: '#ffffff'
  primary-container: '#0066ff'
  on-primary-container: '#f8f7ff'
  inverse-primary: '#b3c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#954000'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc5200'
  on-tertiary-container: '#fff6f3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#001849'
  on-primary-fixed-variant: '#003fa4'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783200'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
  hero-blue-light: '#E6F0FF'
  hero-blue-dark: '#003BB3'
  impact-green-light: '#DCFCE7'
  impact-green-dark: '#059669'
  momentum-orange-light: '#FFEDD5'
  momentum-orange-dark: '#C2410C'
  win-gold: '#FBBF24'
  win-gold-muted: '#FCD34D'
  win-gold-light: '#FFFBEB'
  dark-slate: '#1E293B'
  charcoal: '#475569'
  subtle-gray: '#94A3B8'
  light-mist: '#F8FAFC'
  off-white: '#FAFBFF'
  alert-red: '#EF4444'
typography:
  display:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -1px
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-sm:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
  mono:
    fontFamily: Monaco
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
  5xl: 96px
  gutter: 24px
  margin: 24px
---

## Brand & Style

The design system is built on a foundation of **Modern Corporate** aesthetics, blending high-utility SaaS patterns with an evocative, human-centric emotional layer. The personality is defined by trust, growth, and the tangible impact of generosity. It intentionally pivots away from industry clichés—specifically avoiding any golf-related visual metaphors—in favor of a clean, tech-forward interface that emphasizes data clarity and achievement.

The visual language uses a sophisticated balance of generous white space ("breathing room") and vibrant color-coded zones to categorize the user experience. By utilizing tonal layers and crisp typography, the design system evokes a sense of momentum and professional reliability, ensuring that the act of giving feels as modern and impactful as a high-growth fintech platform.

## Colors

The color strategy employs a "Toned Categorization" model. Each primary brand color is paired with a specific functional pillar:
- **Hero Blue:** Represents the platform core, subscriptions, and navigation.
- **Impact Green:** Reserved for charity-specific actions and success states.
- **Momentum Orange:** Used for achievements and motivational feedback.
- **Win Gold:** A specialized accent for prizes and high-value rewards.

The **Neutral Foundation** uses `Light Mist` for global backgrounds to maintain a soft, accessible canvas, while `Dark Slate` provides high-contrast legibility for primary text. Surfaces use `Off-White` and `Pure White` to create a tiered hierarchy of information density.

## Typography

This design system uses a singular, highly-legible typeface (Inter) across all functional roles to ensure a systematic and utilitarian feel. 

**Scale & Hierarchy:**
- **Display & H1:** Used sparingly for hero moments and major dashboard headers.
- **Body Large:** Reserved for feature descriptions to ensure high readability on marketing-heavy surfaces.
- **Labels:** Utilized for buttons and badges, featuring a slight tracking (letter spacing) increase to maintain legibility at small sizes.
- **Mono:** Used exclusively for technical data, transaction IDs, or code-related snippets.

## Layout & Spacing

The layout follows a **Fluid Grid** model anchored by a 4px rhythm. On desktop, a 12-column system is used with 24px gutters and margins. On mobile devices, the system collapses to a single column with 16px horizontal margins to maximize content width.

**Spacing Rhythm:**
- Use `xs` and `sm` for tight internal component relationships (e.g., icon to text).
- Use `xl` for standard card padding and vertical separation between dashboard widgets.
- Use `3xl` to `5xl` for section-level separation and page-edge breathing room.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layers** rather than heavy borders. The depth system is designed to feel light and airy.

- **Surface Tiers:** Backgrounds use `Light Mist`. Primary cards use `Pure White`. High-impact highlighted cards use the "Light" variants of the brand colors (e.g., `Hero Blue Light`).
- **Shadow Character:** Shadows are extra-diffused and low-opacity. 
  - **Subtle (Cards):** Used for default states to lift elements off the background.
  - **Medium (Hover/Modals):** Used when a user interacts with a card or when a medium-priority overlay appears.
  - **High (Dropdowns):** Sharp focus on the top-most layer, creating a distinct physical separation from the UI below.

## Shapes

The shape language is **Rounded**, reflecting a modern and approachable software aesthetic. 
- **Radius SM (4px):** Used only for small interactive components like checkboxes.
- **Radius MD (8px):** The standard for buttons and input fields.
- **Radius LG (12px):** Default for all cards and dashboard containers.
- **Radius Full:** Strictly for badges, tags, and user avatars to create a clear visual distinction from structural UI elements.

## Components

### Buttons
- **Primary:** Background `Hero Blue`, Text `Pure White`. On hover, shift to `Hero Blue Dark` with a `scale(1.02)` transform.
- **Secondary:** Transparent background with a 2px border of `Hero Blue`.
- **Destructive:** Background `Alert Red`. Implement a 2-second "Stall/Wait" interaction (visual progress bar on hover) before the action becomes clickable.
- **Radius:** Always `8px`. Text uses the `Label` typography style.

### Cards
- **Base:** Background `Pure White`, `Radius LG`, Subtle Elevation.
- **Category Specific:** Add a 4px left-border or top-accent-border using `Impact Green` (Charity), `Momentum Orange` (Stats), or `Win Gold` (Prizes).
- **Interactions:** Lift to Medium Elevation on hover with a 200ms transition.

### Input Fields
- **Default:** Background `Off-White`, Border 1px `Subtle Gray`, `Radius MD`.
- **Focus:** Border 2px `Hero Blue`, Background `Pure White`.
- **Label:** Use `H4` typography for field labels, placed above the input.

### Badges & Chips
- **Style:** `Radius Full`, `Label` typography.
- **Coloration:** Use "Light" brand color for the background and "Dark" brand color for the text (e.g., `Impact Green Light` background with `Impact Green Dark` text).

### Lists & Tables
- **Rows:** Use `Light Mist` for alternating row backgrounds or 1px `Subtle Gray` bottom borders for clear separation.
- **Typography:** Body Regular for primary data, Body Small for secondary metadata.