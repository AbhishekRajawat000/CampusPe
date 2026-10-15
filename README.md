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

Verified automatically:

- Next.js production compilation and static export.
- Exported HTML asset references resolve to non-empty local files.
- All page-section fragment links target existing IDs.
- All rendered images include alt attributes.
- All SVG assets parse as XML.

Browser automation was unavailable in the implementation environment. A screenshot overlay, actual viewport overflow checks, keyboard interaction testing, and live incognito testing have **not** been completed. Pixel-level equivalence is therefore not certified.

Before final assignment submission, review at 1440px, 1280px, 1024px, 768px, 600px, 375px (iPhone 13 mini CSS width), and 320px. Check every CTA, dialog close/Escape/focus return, mobile menu, filter, carousel dot, file validation, footer link, and reduced-motion behavior. Confirm that the hosting audience permits reviewer access and that the GitHub repository is public.

## Scope

The supplied file contains a desktop frame; smaller layouts are responsive adaptations. The assignment is frontend-only. Authentication, real matching, submissions, job applications, official policy pages, and live app-store destinations are outside this static build.

Design assets and brand names belong to their respective owners and are included for this replication assignment.
