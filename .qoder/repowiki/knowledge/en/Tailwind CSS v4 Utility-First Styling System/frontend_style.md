## Overview

The BuddyAI frontend uses **Tailwind CSS v4** as its sole styling framework, applied through a utility-first methodology across all Next.js pages and components. There is no component library (e.g., Material UI, Chakra UI) — all UI elements are hand-crafted using Tailwind utility classes.

## Framework & Tooling

- **CSS Framework**: Tailwind CSS v4 (`tailwindcss@^4`)
- **PostCSS Plugin**: `@tailwindcss/postcss@^4`
- **Build Tool**: Next.js 16 with built-in CSS processing
- **Font System**: Google Fonts via `next/font/google` (Geist Sans + Geist Mono)

## Key Files

| File | Purpose |
|------|---------|
| `client/src/app/globals.css` | Single global stylesheet; imports Tailwind, defines CSS custom properties for theme tokens |
| `client/postcss.config.mjs` | PostCSS configuration wiring `@tailwindcss/postcss` plugin |
| `client/src/app/layout.tsx` | Root layout applying font variables to `<html>` and base flex structure to `<body>` |
| `client/package.json` | Declares `tailwindcss` and `@tailwindcss/postcss` as dev dependencies |

## Design Tokens & Theme Configuration

Theme values are defined as CSS custom properties in `globals.css` using Tailwind v4's `@theme inline` directive:

```css
:root {
  --background: #f8fafc;   /* slate-50 equivalent */
  --foreground: #0f172a;   /* slate-900 equivalent */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

These tokens are referenced indirectly — the body applies `var(--background)` and `var(--foreground)` directly rather than through Tailwind utility classes.

### Color Palette (conventional usage)

Across all pages, the following color conventions are consistently applied:

- **Primary brand**: `indigo-600` (buttons, navbar background, links, active states)
- **Primary hover**: `indigo-700` / `indigo-500` / `indigo-400` (button hovers, focus rings)
- **Neutral text**: `gray-900` (headings), `gray-700` (labels), `gray-500` (secondary text), `gray-400` (placeholders/empty states)
- **Semantic colors**:
  - Success/Low risk: `green-600` text on `green-50` background
  - Warning/Moderate: `yellow-600` text on `yellow-50` background
  - High risk: `orange-600` text on `orange-50` background
  - Severe/Error: `red-600`/`red-700` text on `red-50` background
  - Sentiment badges: `green-100`/`red-100`/`gray-100` backgrounds

### Typography

- **Font families**: Geist Sans (variable `--font-geist-sans`) for body text, Geist Mono (variable `--font-geist-mono`) for monospace contexts
- **Applied via**: CSS class variables on `<html>` element in `layout.tsx`
- **Fallback**: `Arial, Helvetica, sans-serif` declared in `globals.css` body rule

## Architecture & Conventions

### Layout Structure

The root layout (`layout.tsx`) establishes a full-height flex column:

```tsx
<body className="min-h-full flex flex-col">
  <Navbar />
  <main className="flex-1">{children}</main>
</body>
```

This ensures the navbar stays at top while main content fills remaining viewport space.

### Component Styling Patterns

All styling is done inline via Tailwind utility classes. Common patterns observed:

1. **Card containers**: `bg-white rounded-xl shadow-sm border border-gray-100 p-6`
2. **Form inputs**: `w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm`
3. **Primary buttons**: `bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed`
4. **Page wrappers**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8` (dashboard) or `flex items-center justify-center min-h-[calc(100vh-4rem)]` (centered auth pages)
5. **Grid layouts**: `grid grid-cols-1 md:grid-cols-3 gap-6` for responsive card grids

### Responsive Strategy

Responsive design uses Tailwind's mobile-first breakpoint prefixes:
- `sm:` (640px+): Applied to padding (`sm:px-6`)
- `md:` (768px+): Applied to grid columns (`md:grid-cols-3`)
- `lg:` (1024px+): Applied to padding (`lg:px-8`)

No explicit media queries are written — all responsiveness is handled through Tailwind's utility class breakpoints.

### State & Interaction Patterns

- **Hover states**: `hover:bg-indigo-700`, `hover:text-indigo-200`, `hover:bg-indigo-50`
- **Focus states**: `focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`
- **Disabled states**: `disabled:opacity-50 disabled:cursor-not-allowed`
- **Transitions**: `transition` class applied universally for smooth state changes

## Rules Developers Should Follow

1. **No custom CSS files**: All styling must use Tailwind utility classes. The only CSS file (`globals.css`) is reserved for theme token definitions and the Tailwind import.

2. **Use semantic color helpers**: Risk/severity levels should use the established color mapping functions (e.g., `getRiskColor()`, `getSeverityColor()`) rather than hardcoding color classes.

3. **Maintain consistent spacing**: Use Tailwind's spacing scale (`p-4`, `p-6`, `gap-3`, `gap-6`) consistently. Card padding is typically `p-6`, form field spacing is `space-y-5`.

4. **Follow the indigo primary convention**: All primary actions, navigation highlights, and brand elements use `indigo-600` as the base color.

5. **Apply rounded corners consistently**: Cards use `rounded-xl`, buttons/inputs use `rounded-lg`, chat bubbles use `rounded-2xl`.

6. **Shadow hierarchy**: Cards use `shadow-sm` with `border border-gray-100`. The navbar uses `shadow-lg`. Avoid heavier shadows unless justified.

7. **Font sizing**: Body text defaults to Tailwind's base size. Headings use `text-2xl`, `text-3xl`, or `text-4xl`. Small/caption text uses `text-sm`.

8. **No external component libraries**: Do not introduce UI libraries like Material UI, Ant Design, or Radix UI. All components are built from scratch with Tailwind utilities.

9. **Centered page pattern**: Auth and landing pages use `flex items-center justify-center min-h-[calc(100vh-4rem)] px-4` for vertical centering with navbar offset.

10. **Max-width containers**: Content pages wrap content in `max-w-7xl mx-auto` with responsive padding (`px-4 sm:px-6 lg:px-8`).