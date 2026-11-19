---
name: Electric Campus Culture
colors:
  surface: '#141317'
  surface-dim: '#141317'
  surface-bright: '#3a383d'
  surface-container-lowest: '#0f0d12'
  surface-container-low: '#1c1b20'
  surface-container: '#201f24'
  surface-container-high: '#2b292e'
  surface-container-highest: '#363439'
  on-surface: '#e6e1e7'
  on-surface-variant: '#cec2d6'
  inverse-surface: '#e6e1e7'
  inverse-on-surface: '#312f35'
  outline: '#988d9f'
  outline-variant: '#4c4354'
  surface-tint: '#dbb8ff'
  primary: '#dbb8ff'
  on-primary: '#470083'
  primary-container: '#7928ca'
  on-primary-container: '#e1c4ff'
  inverse-primary: '#7f30d0'
  secondary: '#ffb2ba'
  on-secondary: '#670020'
  secondary-container: '#d4004b'
  on-secondary-container: '#ffe6e8'
  tertiary: '#ffba20'
  on-tertiary: '#412d00'
  tertiary-container: '#755200'
  on-tertiary-container: '#ffc659'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#efdbff'
  primary-fixed-dim: '#dbb8ff'
  on-primary-fixed: '#2b0052'
  on-primary-fixed-variant: '#6600b7'
  secondary-fixed: '#ffd9dc'
  secondary-fixed-dim: '#ffb2ba'
  on-secondary-fixed: '#400011'
  on-secondary-fixed-variant: '#910030'
  tertiary-fixed: '#ffdea8'
  tertiary-fixed-dim: '#ffba20'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4200'
  background: '#141317'
  on-background: '#e6e1e7'
  surface-variant: '#363439'
typography:
  display:
    fontFamily: Syne
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 60px
    letterSpacing: -0.04em
  display-mobile:
    fontFamily: Syne
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Syne
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Syne
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system captures the raw pulse of underground campus nightlife, autonomous student culture, and cutting-edge creative showcases. Merging the kinetic grit of college event organizing with modern spatial computing aesthetics, the visual direction fuses sharp glass panels, high-contrast dark space, and piercing violet and hot neon energy.

The aesthetic philosophy bridges two key disciplines:
- **Experimental Underground Exhibition:** Expressive, architectural typography via Syne sets a defiant, non-institutional posture for campus festivals, late-night hackathons, and secret shows.
- **Precision Glass Interfaces:** Controlled, ultra-dark backdrops grounded by translucent glassmorphism modules, glowing micro-borders, and high-legibility Geist body metrics.

Interfaces must feel immediate, tactile, and electrified. Avoid corporate flatness, sterile educational templates, and muted, conservative academic palettes.

## Colors

The color architecture is built for nocturnal, battery-efficient mobile experiences with intense visual hierarchy:

- **Primary (`#7928CA`):** The signature electric neon violet. Anchors top-level brand actions, primary CTAs, active states, and focal light spills.
- **Secondary (`#FF3366`):** Kinetic hot coral. Reserved for high-urgency notifications, live status indicators, sell-out warnings, and dynamic stage tags.
- **Tertiary (`#FFB800`):** Electric amber. Deployed for VIP access tiers, ticket drop alerts, bookmarking toggles, and organizer badges.
- **Neutral Canvas (`#08070B`):** Deep obsidian abyss black. Provides infinite contrast against neon halos and glass translucent surfaces.

### Semantic Layers & Surfaces
- **Surface Deep:** `#08070B` (Canvas bedrock)
- **Surface Glass Layer 1:** `rgba(255, 255, 255, 0.03)` with `rgba(255, 255, 255, 0.08)` border strokes.
- **Surface Glass Layer 2 (Raised):** `rgba(26, 17, 39, 0.55)` with `rgba(121, 40, 202, 0.3)` border strokes.
- **Text Dominant:** `#F8F8FC` (High-contrast pure white)
- **Text Subdued:** `#9D98A9` (Muted violet-gray for tertiary details and timestamps)

## Typography

The typography system pairs experimental, structural display geometry with uncompromising digital utility:

- **Syne (Headlines & Display):** Selected for its hyper-expressive proportions, wide stances, and poster-like brutalist curves. Use for event titles, festival lineups, big metric callouts, and screen headers. Never set in body paragraphs.
- **Geist (Body & Metadata):** A razor-sharp, low-noise sans serif engineered for dense mobile screens, high legibility in low-light environments, and rapid parsing of ticket barcodes, line times, and campus locations.

Tracking should be pulled tighter on large Syne display tokens (`-0.04em`) to establish graphic punch. Metadata labels in Geist must use slight positive tracking with all-caps or medium/semibold treatments to ensure rapid scanning during live events.

## Layout & Spacing

The layout is built mobile-first, targeting fluid single-hand navigation across dense campus itineraries:

- **Mobile (<768px):** 4-column fluid layout with `1rem` outer canvas padding and `1rem` column gutters. Bottom app bar fixed with contextual thumb-zone triggers for immediate RSVP/Ticket activation.
- **Tablet (768px - 1024px):** 8-column layout with `2rem` margins. Split view for feeds and live map panels.
- **Desktop (>1024px):** 12-column fixed container (max-width `1200px`) centered with multi-panel management consoles for event organizers.

Horizontal carousels must "peek" out by precisely `1.25rem` over the canvas boundary to signal horizontal swipe affordance without needing visible scroll indicators.

## Elevation & Depth

Visual depth is achieved through translucent optical glass stacking and directional colored illumination rather than traditional blurred drop shadows:

- **Backdrop Diffusion:** Heavy backdrop filter blurs (`backdrop-filter: blur(16px)`) applied to floating bottom bars, sheet modals, and card surfaces.
- **Edge Illumination:** Surface layers feature a 1px composite outline (`rgba(255, 255, 255, 0.1)` on top/left, fading to `rgba(255, 255, 255, 0.02)` on bottom/right) simulating top-down ambient light.
- **Glow Halos:** Active cards, live status pulses, and featured hero events omit drop shadows in favor of localized radial glows:
  - *Primary Aura:* `0 0 24px -4px rgba(121, 40, 202, 0.45)`
  - *Hot Coral Accent Aura:* `0 0 20px -4px rgba(255, 51, 102, 0.40)`
- **Modals & Overlays:** Background scrim uses `#08070B` at 75% opacity combined with a `8px` gaussian blur.

## Shapes

The interface balances sharp architectural lines with soft internal curves to maintain a technical edge:

- **Base Radius (`0.25rem`):** Applied to tooltips, square preview thumbs, and mini data pills.
- **Large Radius (`rounded-lg` / `0.5rem`):** Standard for glass event cards, interactive inputs, nested containers, and segmented controls.
- **Extra Large Radius (`rounded-xl` / `0.75rem`):** Used for elevated bottom sheets, swipeable discovery decks, and full-screen event preview modals.
- **Role & Action Pills (Full Round):** Role indicators (Student, Organizer, Admin) and high-priority action triggers use a fully rounded border radius (`9999px`) to create striking contrast against the structured, rectangular glass architecture.

## Components

### Buttons
- **Primary Electric:** Background `#7928CA` with subtle inner white highlight. Text `#FFFFFF`, font `Geist` semibold. On hover/press: halo flare `0 0 28px rgba(121, 40, 202, 0.6)`.
- **Secondary Ghost Glass:** Background `rgba(255, 255, 255, 0.05)`, border `1px solid rgba(255, 255, 255, 0.15)`. Text `#F8F8FC`.
- **Live / Urgent Action:** Hot coral background `#FF3366`, white text, micro-pulse animation on active broadcast tags.

### Role Badges & Chips
- **Geometry:** Height 24px, pill-shaped (`9999px`), uppercase `label-sm` tracking.
- **Student Badge:** Dark purple fill `rgba(121, 40, 202, 0.15)`, violet text `#B67BFF`, border `1px solid rgba(121, 40, 202, 0.4)`.
- **Organizer Badge:** Neon amber fill `rgba(255, 184, 0, 0.12)`, amber text `#FFB800`, border `1px solid rgba(255, 184, 0, 0.35)`.
- **Admin Badge:** Coral fill `rgba(255, 51, 102, 0.15)`, coral text `#FF3366`, border `1px solid rgba(255, 51, 102, 0.45)`.
- **Category Filter Chips:** Horizontal scrolling pills. Default state transparent with 1px border; selected state features an electric violet solid fill with glow.

### Cards (Glassmorphism)
- Background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)`.
- Border: `1px solid rgba(255, 255, 255, 0.08)`.
- Backdrop: `backdrop-filter: blur(12px)`.
- Content Stack: Bold `Syne` title, location subtext with glowing status dot (Green for active now, Amber for upcoming), attendee avatar overlaps, and quick-save bookmark button top-right.

### Form Inputs
- Background: `rgba(255, 255, 255, 0.03)`.
- Border: `1px solid rgba(255, 255, 255, 0.1)`. Height: 48px. Radius: `0.5rem`.
- Focus State: Border transitions to `#7928CA` with an external glow `0 0 0 3px rgba(121, 40, 202, 0.25)`. Placeholder text `#9D98A9`.

### Selection Controls (Checkboxes & Radios)
- Base: 20x20px square/circle with `1px solid rgba(255, 255, 255, 0.2)`.
- Checked: Electric violet fill `#7928CA` centered with crisp white checkmark or inner dot.

### Specialized Campus Event Modules
- **Pass & Ticket Barcode Sheet:** Frosted dark panel with high-contrast inverted white canvas strictly framing the QR/barcode for scanner reliability in low-light venues.
- **Live Now Ticker:** A sticky micro-banner with an animated coral radar dot indicating concurrent events happening across campus grounds right now.