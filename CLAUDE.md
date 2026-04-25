# NS Jewels — Project Guide for AI Assistants

This document orients coding agents and contributors to the **ns-jewels** codebase, conventions, and the intended **pink–purple** visual direction.

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
- **Primary aesthetic**: **pinkish purple** — warm mauve, orchid, and plum accents on light rose or deep violet surfaces; avoid neon or harsh magenta unless used sparingly for CTAs.

### 5.2 Color scheme (canonical palette)

Use these as **design tokens** (map to CSS variables in `globals.css` and/or Tailwind `@theme` when implementing UI).

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

### 5.3 How to apply the palette in code

1. **Prefer CSS variables** in `:root` (and a `[data-theme="dark"]` or `prefers-color-scheme` block) mirroring the table above, e.g. `--color-brand-500`, `--color-surface-0`.
2. **Expose tokens in Tailwind v4** via `@theme inline { ... }` so utilities read `bg-brand-500`, `text-ink-900`, etc.
3. **Contrast**: Body text on `brand-50`–`brand-200` should use **ink-900** or **brand-900**; white or `brand-50` text on **brand-600+** for buttons.
4. **Metals / gems** in imagery: keep UI chrome in brand neutrals; let photography carry gold/silver sparkle.

### 5.4 Typography

- **Headings**: Consider **Cormorant Garamond** or similar serif for editorial luxury (optional future change from Geist).
- **UI / body**: **Geist Sans** (current) or a clean geometric sans; **Geist Mono** for SKUs, prices in tables, or technical footers.
- Scale: clear hierarchy (e.g. hero `text-4xl`–`text-6xl`, section titles `text-2xl`–`text-3xl`).

### 5.5 Motion & shape

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

- [ ] Colors use the **pink–purple** tokens above (or documented extensions).
- [ ] Light text on saturated purple/pink passes contrast (WCAG AA where applicable).
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
