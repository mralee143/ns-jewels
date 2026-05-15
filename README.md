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

### Database (Docker MySQL)

Start the database (maps host **3307** to MySQL **3306** inside the container so it does not conflict with another service already using **3306** on your machine):

```bash
docker compose up -d mysql
```

Set the app connection in `.env.local` (matches `docker-compose.yml`):

```bash
DATABASE_URL="mysql://ns_app:ns_app@localhost:3307/ns_jewels"
```

If nothing else uses **3306**, you can change the compose `ports` line to `"3306:3306"` and use `:3306` in the URL instead.

**DBeaver (Connect by URL):** choose **URL**, then use:

`jdbc:mysql://localhost:3307/ns_jewels`

Use **Username** `ns_app` and **Password** `ns_app` (same as `DATABASE_URL`). Check **Save password** if you want.

If you previously created the volume with different MySQL users, reset the data volume once:

```bash
docker compose down -v
docker compose up -d mysql
```

**Prisma: `Unknown authentication plugin 'sha256_password'`** — the account on that server uses a plugin Prisma’s migration engine does not speak. Either:

1. **Use local Docker for migrations:** put the `DATABASE_URL` line above in **`.env.local`** (it overrides `.env` for Prisma). Then run `npm run db:migrate:deploy` again.

2. **Stay on that MySQL server:** change the account’s auth plugin (Prisma cannot use `sha256_password`). In DBeaver or your host’s SQL console, run as an admin — see commented steps in [`prisma/fix-mysql-auth-plugin.sql`](./prisma/fix-mysql-auth-plugin.sql). Typical form:

```sql
ALTER USER 'your_user'@'your_host' IDENTIFIED WITH caching_sha2_password BY 'your_password';
FLUSH PRIVILEGES;
```

If the server rejects `caching_sha2_password`, use `mysql_native_password` instead (when your MySQL version still allows it).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

Deploy via the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
