# CampusPe — Figma Landing Page

A static, responsive CampusPe landing page built with **Next.js 16, React 19, JavaScript, and CSS**. The page follows the supplied 1440 × 7207 Figma frame and uses the original embedded images, exported SVG icons, and locally bundled fonts.

Design: https://www.figma.com/design/Dmx3vPT4wFLqXmeaeTj2HL/Untitled--Copy-?node-id=1-792

Deployment: https://campuspe-landing-abhishek.rajawatsinghabhishek.chatgpt.site

## Run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build
```

The production build is exported into `out/`. It can be hosted on any static host, including Netlify, Vercel, or GitHub Pages with the appropriate base path. No API, database, environment variables, or server runtime is needed.

With pnpm, use `pnpm install --frozen-lockfile`, `pnpm dev`, and `pnpm build`. The included lockfile uses pnpm 11.

## Project structure

```text
app/
  globals.css       Design tokens, layout, states, and breakpoints
  layout.js         Metadata and local font imports
  page.js           Landing-page route
components/
  CampusPe.jsx      Page sections and browser interactions
  ui.jsx            Reusable buttons, badges, icons, and image wrappers
data/
  content.js        Repeated cards, opportunities, and footer content
public/assets/      Original image and vector assets
next.config.mjs     Next.js static-export configuration
```

## Implementation

- Mobile-first CSS with breakpoints at 400, 600, 900, 1200, and 1400 pixels.
- Desktop section heights and container measurements follow the Figma reference.
- Original images converted to lossless WebP; Figma crop transforms are reproduced in CSS.
- Original SVG icons remain external assets rather than inline recreations.
- Inter, Roboto, Lora, Plus Jakarta Sans, and Caveat are bundled locally.
- Semantic page sections, skip link, visible keyboard focus, labeled controls, native dialogs, and reduced-motion support.
- Hover and active states on CTAs, cards, navigation, and the app gallery. Pointer movement subtly changes the hero glow.

## Static interactions

- Mobile menu opens and closes; navigation scrolls to page sections.
- Opportunity category filters update the sample feed.
- Step cards have selectable states.
- Resume selection supports file picker and drag/drop, validates PDF/DOC/DOCX and the 10MB limit, and shows the selected filename. Files are not uploaded or analyzed.
- App-gallery dots select the featured original screen.
- Waitlist, college, employer, and account CTAs open labeled demo forms with native validation. No submission is sent or stored.
- Opportunity buttons open sample details. Sample listings are copied from the design and are not live vacancies.
- Support links use the email and telephone supplied in the design.
- Destinations or official content not supplied by Figma open an explanatory dialog. Store buttons do not guess app-store listings; policy buttons do not invent policy text.
- The design-supplied Instagram and YouTube URLs are preserved. Other unspecified social destinations show an informational dialog.

## Validation

The October 2026 Figma audit covers every page section at the original 1440px desktop width. Source properties are preserved in `audit/figma-properties.json`; automated expected values live in `tests/figma-text-spec.json` and `tests/figma-layout-spec.json`.

Run the browser checks after installing dependencies:

```sh
npm install
npm install --no-save playwright
npx playwright install chromium
npm run build
node tests/figma-audit.mjs
```

The runner starts its own local static server, saves section screenshots and JSON to `audit/latest`, and exits nonzero on failed mapped typography/layout checks, missing images, overflow, broken fragments, interaction failures or browser errors. `CHROMIUM_PATH` and `PLAYWRIGHT_MODULE` can select an existing browser/runtime.

The recorded final run is in `audit/final`. It includes typography and line wrapping, layout bounds, seven responsive widths (1280, 1024, 768, 600, 390, 375, 320), image loading, links, dialogs, filters, upload validation, gallery controls and reduced motion. Original raster assets were also compared with the uploaded Figma image data; see `audit/raster-asset-verification.json`.

Figma live extraction reached the Starter quota. The complete property inventory was decoded from the supplied `.fig` snapshot and cross-checked with the retrieved live section contexts. This is a desktop-source audit, not a pixel-diff certification of every property or a mobile design match. Native emoji/font fallback can vary by OS; only Chromium was tested. SVG-contained text and disabled text paints are explicitly classified separately.

GitHub write access returned HTTP 403. This package contains local corrections; no repository push or deployment was performed.

## Scope

The supplied file contains a desktop frame; smaller layouts are responsive adaptations. The assignment is frontend-only. Authentication, real matching, submissions, job applications, official policy pages, and live app-store destinations are outside this static build.

Design assets and brand names belong to their respective owners and are included for this replication assignment.
