# Dave's Glass — Website

**Live preview:** https://dylanthrp.github.io/daves-glass/
**Local source:** `C:\Users\dylan\Documents\daves-glass\`

## What this is

A custom static website for **Dave's Glass LLC**, a full-service glass shop in **Caro, Michigan** (1900 W Caro Rd). Family-run since 1978, serving Tuscola, Huron, Sanilac, and Lapeer counties. Commercial, residential, auto glass, and custom frameless shower enclosures.

The site is a single-page static HTML/CSS/JS build hosted on GitHub Pages. The intent is a real client deliverable that can be pointed at the eventual `davesglassllc.com` domain.

## What's in the build

- **Topbar** with phone, hours, and service area
- **Sticky header** with logo + quick-CTA buttons (Call / Email / Quote)
- **Hero** with company tagline, trust points, and a 45+/3 gens/1,000s stats badge
- **Services** — 4 main categories: Commercial, Residential, Shower Enclosures, Auto Glass
- **Shower gallery** — featured frameless glass shower photo
- **Other services** — 7 secondary services: Mirrors, Commercial Door Repair, Table Tops, Seal Failure, Screens, Repairs, Auto Glass
- **Local & family-owned** section with 3-generation framing + trust callout
- **Contact** with phone, email, and a working quote form (opens user's mail app, sends to `office@davesglassllc.com`)
- **Footer** with address, hours, service area, and copyright

## What is real vs placeholder

**Real (from his current site and public information):**
- Shop name, address, phone, email
- Hours: Mon–Fri 8:00 AM – 5:00 PM
- Service area: Greater Thumb, Tuscola/Huron/Sanilac/Lapeer counties
- The 4 photos supplied by Dylan
- The Dave's Glass logo (isometric glass-block mark)
- The "Est. 1978" / "45+ years" framing from the existing site
- "3 generations of the family" — to be confirmed with Dave before going public

**Placeholder (awaiting real photos):**
- Main service card images for Commercial and Auto Glass
- 5 of the 7 Other Services cards
- Additional shower enclosure photos in the gallery
- Each placeholder is clearly labeled with the category name and a small SVG icon so the missing photo is obvious

**Drop-in replacement:** add a JPG to `assets/photos/` and tell me which category it belongs to, and the placeholder is swapped for a real photo.

## Running locally

No build step. Static files only.

```bash
cd "C:/Users/dylan/Documents/daves-glass"
python -m http.server 4177
# open http://127.0.0.1:4177/
```

## Audit status

Built and tested at 4 widths (320/390/768/1440) with **40/40 audit checks passing** as of the most recent commit. Verification covers: 0 JS errors, no horizontal overflow, single-row header at every width, all 4 service categories present, all 7 other-services named correctly, both logos loaded (header + footer), year rendered, no demo banner (this is a real client build, not a portfolio concept).

## What still needs review from Dave

1. The "3 generations of the family" claim in the hero stat — confirm with him.
2. The "by appointment" vs "Closed" weekend framing — confirm.
3. Replace placeholder photos with real job photos when available.
4. Switch from `noindex,nofollow` to indexable when pointed at the real domain.
5. 301-redirect the old `davesglass.biz` URL to the new domain once it's live.
