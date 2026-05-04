# NS Jewels — Project Guide for AI Assistants

This document orients coding agents and contributors to the **ns-jewels** codebase, conventions, and the approved **soft pink** UI palette (see §5.2), plus extended **pink–purple** tokens for gradual alignment or legacy UI.

---

## 1. Project summary

| Item | Detail |
|------|--------|
| **Name** | `ns-jewels` |
| **Purpose** | Jewelry brand / storefront (name implies NS Jewels; evolve copy and routes as the product grows). |
| **Repository root** | Next.js app with source under `src/`. |
| **Path alias** | `@/*` → `./src/*` (see `tsconfig.json`). |

---

## 2. Tech stack

| Layer | Choice |
|-------|--------|
| **Framework** | [Next.js](https://nextjs.org/) **16.2.4** (App Router) |
| **Runtime UI** | React **19.2.4** |
| **Language** | TypeScript **5** (strict) |
| **Styling** | Tailwind CSS **4** with `@import "tailwindcss"` in `src/app/globals.css` |
| **Lint** | ESLint **9** with `eslint-config-next` **16.2.4** |

### Commands

```bash
npm run dev    # Next dev server
npm run build  # Production build
npm run start  # Serve production build
npm run lint   # ESLint
```

---

## 3. Directory layout (high level)

```
src/
  app/
    layout.tsx    # Root layout, fonts, metadata
    page.tsx      # Home route
    globals.css   # Tailwind import + CSS variables + @theme
next.config.ts
tsconfig.json
package.json
public/           # Static assets (e.g. images, SVGs)
```

- Use the **App Router** only (`src/app/`). No `pages/` router in this template.
- Prefer **Server Components** by default; add `"use client"` only when hooks, browser APIs, or event handlers require it.

---

## 4. Configuration notes

- **`next.config.ts`**: Default/empty options object; extend for images, redirects, headers, etc.
- **`src/app/layout.tsx`**: Loads **Geist** and **Geist Mono** from `next/font/google` and exposes `--font-geist-sans` / `--font-geist-mono`.
- **`src/app/globals.css`**: Defines `--background`, `--foreground`, maps them in `@theme inline` for Tailwind (`background`, `foreground` colors), and sets `body` font/color.

---

## 5. Brand & UI direction

### 5.1 Overall feel

- **Luxury jewelry** tone: refined typography, generous whitespace, soft gradients optional.
- **Primary aesthetic**: **soft pink** — blush backgrounds, rose accents, strong pink **only** on primary CTAs; optional gradients from main pink to light pink (see §5.2). Extended violet tokens (§5.3) remain available where purple accents are still in use.

### 5.2 Soft Pink UI color scheme (approved — use for new UI)

Canonical NS Jewels palette. Mirror these in `:root` / `@theme inline` in `src/app/globals.css` when building or refactoring screens. Human-readable copy also lives in [`README.md`](./README.md).

#### Primary colors

| Role | Hex | Usage |
|------|-----|--------|
| **Soft Pink (main CTA)** | `#E96A7A` | Buttons (Buy Now, Checkout), price / CTA highlights |
| **Light Pink** | `#F6C1CC` | Cards, highlights, backgrounds |
| **Very Light Blush** | `#FDF2F5` | Main page background |

#### Accent colors

| Role | Hex | Usage |
|------|-----|--------|
| **Rose Gold Soft** | `#E8A9A9` | Borders, icons, subtle luxury touch |
| **Peach Pink Accent** | `#F4A6A6` | Hover states, badges (e.g. discounts) |

#### Neutrals

| Role | Hex | Usage |
|------|-----|--------|
| **Primary text** | `#2B2B2B` | Body and headings on light surfaces |
| **Secondary text** | `#6E6E6E` | Supporting copy |
| **White** | `#FFFFFF` | Cards, panels; text on saturated pink |

#### Structural tokens

| Role | Hex | Usage |
|------|-----|--------|
| **Button hover** | `#D85C6C` | Primary button hover (slightly darker than main CTA) |
| **Card / section border** | `#F0D3DA` | Borders on cards and grouped sections |

#### Gradient (buttons / highlights)

`linear-gradient(135deg, #E96A7A, #F6C1CC)`

#### Usage breakdown

- **Buttons**: background `#E96A7A`, hover `#D85C6C`, text white (or suitable contrast-safe equivalent).
- **Cards / sections**: background `#FFFFFF` or `#F6C1CC`; border `#F0D3DA`.
- **Page background**: `#FDF2F5`.
- **Balance**: ~70% light background, ~20% soft pink surfaces, ~10% strong pink for CTAs only — keeps layout calm while preserving conversion focus on primary actions.

### 5.3 Extended pink–purple tokens (optional / legacy)

Use these as **design tokens** where violet accents still apply; prefer §5.2 for new customer-facing UI.

#### Core brand (pink–purple family)

| Token name | Hex | Role |
|------------|-----|------|
| **brand-50** | `#faf5ff` | Lightest wash (page tint) |
| **brand-100** | `#f3e8ff` | Subtle section backgrounds |
| **brand-200** | `#e9d5ff` | Borders, dividers (light) |
| **brand-300** | `#d8b4fe` | Disabled fills, decorative |
| **brand-400** | `#c084fc` | Secondary accents, icons |
| **brand-500** | `#a855f7` | **Primary accent** (violet) |
| **brand-600** | `#9333ea` | **Primary hover / emphasis** |
| **brand-700** | `#7e22ce` | Headings on light backgrounds |
| **brand-800** | `#6b21a8` | Dark UI surfaces (light mode text on pale bg) |
| **brand-900** | `#581c87` | Hero text, dark cards |
| **brand-picked** | `#600080` | User-selected primary purple from approved swatch |

#### Warm pink highlights (jewelry warmth)

| Token name | Hex | Role |
|------------|-----|------|
| **rose-tinge-50** | `#fdf2f8` | Blush background blend |
| **rose-tinge-100** | `#fce7f3` | Cards, modals (soft) |
| **rose-tinge-200** | `#fbcfe8` | Hover on pink chips |
| **rose-tinge-500** | `#ec4899` | **CTA / “Shop” highlights** (use with restraint) |
| **rose-tinge-600** | `#db2777` | CTA hover |

#### Neutrals (supporting, not competing with brand)

| Token name | Hex | Role |
|------------|-----|------|
| **ink-900** | `#1c1917` | Body text (light mode) |
| **ink-600** | `#57534e` | Secondary text |
| **ink-400** | `#a8a29e` | Muted / captions |
| **surface-0** | `#ffffff` | Cards, panels |
| **surface-1** | `#fafafa` | Page background alternative |

#### Dark mode (optional later)

| Token name | Hex | Role |
|------------|-----|------|
| **dark-bg** | `#0f0a14` | Deep violet-black page |
| **dark-surface** | `#1a1224` | Elevated surfaces |
| **dark-text** | `#f5f3ff` | Primary text |
| **dark-muted** | `#c4b5fd` | Secondary text |
| **dark-accent** | `#e879f9` | Links / focus (pink-purple glow) |

### 5.4 How to apply the palette in code

1. **Primary CTAs / buttons**: In `src/app/globals.css`, `--brand-cta` (`#E96A7A`) and `--brand-cta-hover` (`#D85C6C`) map to Tailwind v4 `--color-cta` / `--color-cta-hover`. Use **`bg-cta`**, **`hover:bg-cta-hover`**, **`text-white`** for filled buttons; **`border-cta`**, **`text-cta`** for outlines — matching **§5.2** and [`README.md`](./README.md). Add other §5.2 tokens (`--color-blush-bg`, card borders, etc.) to `:root` / `@theme inline` as you extend UI.
2. **Legacy / violet**: Continue mapping §5.3 tokens (`--color-brand-500`, `--color-surface-0`, …) where existing components depend on them; migrate screens toward §5.2 over time.
3. **Contrast**: Primary text `#2B2B2B` / secondary `#6E6E6E` on blush `#FDF2F5` and white cards; white text on `#E96A7A` / `#D85C6C` for buttons — verify WCAG AA where applicable.
4. **Metals / gems** in imagery: keep UI chrome aligned to §5.2 neutrals and accents; let photography carry gold/silver sparkle.

### 5.5 Typography

- **Headings**: Consider **Cormorant Garamond** or similar serif for editorial luxury (optional future change from Geist).
- **UI / body**: **Geist Sans** (current) or a clean geometric sans; **Geist Mono** for SKUs, prices in tables, or technical footers.
- Scale: clear hierarchy (e.g. hero `text-4xl`–`text-6xl`, section titles `text-2xl`–`text-3xl`).

### 5.6 Motion & shape

- Subtle transitions (`transition-colors`, `duration-200`).
- Prefer **rounded-2xl** or **rounded-full** for primary buttons to match soft gem-like curves.

---

## 6. Coding conventions (repository expectations)

- **Imports**: Sorted (external → internal, alphabetical within groups).
- **Environment variables**: Read from `process.env` only at **module boundaries** (e.g. route handlers, `next.config`); declare any parsed config **immediately after imports** in that file — avoid hidden globals in pure helpers.
- **Style**: Prefer small, composable functions; immutable data flow; isolate side effects at the edges (Server Actions, API routes, event handlers).
- **Scope**: Change only files and lines needed for the task; match existing naming and patterns.

---

## 7. Metadata & SEO (current state)

- `layout.tsx` still uses Create Next App defaults (`title: "Create Next App"`). When branding lands, update `metadata` to NS Jewels–specific title, description, and Open Graph fields.

---

## 8. Quick checklist before shipping UI changes

- [ ] Colors follow **§5.2 Soft Pink** (or documented extensions / legacy §5.3 during migration).
- [ ] Light text on saturated pink / purple passes contrast (WCAG AA where applicable).
- [ ] Responsive breakpoints tested (`sm`, `md`, `lg`).
- [ ] `npm run lint` and `npm run build` succeed.

---

## 9. Reference files

| Topic | File |
|-------|------|
| Global styles & theme hook-in | `src/app/globals.css` |
| Root shell & fonts | `src/app/layout.tsx` |
| Home page | `src/app/page.tsx` |
| Next behavior | `next.config.ts` |
| Type paths | `tsconfig.json` |

---

*Last aligned with package versions: Next 16.2.4, React 19.2.4, Tailwind 4. Extend this file when routes, CMS, or payment flows are added.*
