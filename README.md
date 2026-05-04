# NS Jewels

Jewelry brand storefront built with [Next.js](https://nextjs.org) (App Router). Source lives under `src/`. For contributor conventions and tooling details, see [`CLAUDE.md`](./CLAUDE.md).

---

## Design: Soft Pink UI color scheme

Approved palette for NS Jewels UI. Implement via CSS variables / Tailwind in `src/app/globals.css` where possible.

**Primary buttons in code:** `--brand-cta` / `--brand-cta-hover` in `:root`, exposed as Tailwind colors **`cta`** and **`cta-hover`** (e.g. `bg-cta hover:bg-cta-hover text-white`).

### Primary colors

| Role | Hex | Usage |
|------|-----|--------|
| **Soft Pink (main CTA)** | `#E96A7A` | Primary buttons (Buy Now, Checkout), price highlights |
| **Light Pink** | `#F6C1CC` | Cards, highlights, soft backgrounds |
| **Very Light Blush** | `#FDF2F5` | Main page background |

### Accent colors

| Role | Hex | Usage |
|------|-----|--------|
| **Rose Gold Soft** | `#E8A9A9` | Borders, icons, subtle luxury accents |
| **Peach Pink Accent** | `#F4A6A6` | Hover states, badges (e.g. discounts) |

### Neutrals

| Role | Hex | Usage |
|------|-----|--------|
| **Primary text** | `#2B2B2B` | Body and headings on light surfaces |
| **Secondary text** | `#6E6E6E` | Supporting copy |
| **White** | `#FFFFFF` | Cards, panels, text on strong pink |

### Gradient (buttons / highlights)

```css
linear-gradient(135deg, #E96A7A, #F6C1CC)
```

### Usage breakdown

| Area | Specification |
|------|----------------|
| **Buttons** | Background `#E96A7A`; hover `#D85C6C`; text white |
| **Cards / sections** | Background `#FFFFFF` or `#F6C1CC`; border `#F0D3DA` |
| **Page background** | `#FDF2F5` |
| **Price / CTA highlights** | Main pink `#E96A7A` |

### Balance guideline

- Roughly **70%** light background, **20%** soft pink surfaces, **10%** strong pink reserved for CTAs.
- Soft tones support a luxury, feminine feel; strong pink only on primary actions improves clarity and conversion; generous white space keeps the layout clean and modern.

---

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Edit `src/app/page.tsx` to change the home route; the dev server hot-reloads.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) with [Geist](https://vercel.com/font).

### Commands

```bash
npm run dev    # development server
npm run build  # production build
npm run start  # serve production build
npm run lint   # ESLint
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

Deploy via the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
