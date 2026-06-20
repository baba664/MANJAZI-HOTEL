# Egital Solutions — Website

A premium, dark-themed, fully responsive digital agency website built with plain HTML, CSS, and JavaScript (no build step required).

## Files
- `index.html` — all page markup and content
- `style.css` — design tokens, layout, animations, responsiveness
- `script.js` — preloader, navigation, counters, hero canvas mesh, portfolio filter, pricing search/filter, testimonial carousel, contact form, scroll-to-top

## How to use
Open `index.html` directly in a browser, or upload all three files (plus an `assets/` folder if you add images) to any static host (e.g. Netlify, Vercel, GitHub Pages, or your existing hosting/cPanel).

## Before you launch — replace these placeholders
1. **Social Media Management Guide PDF** — the "Download Social Media Management Guide" button links to `social-media-management-guide.pdf`. Add that file to the same folder as `index.html` once it's ready.
2. **Open Graph image** — `og:image` / `twitter:image` point to `assets/og-image.jpg`. Create an `assets` folder and add a 1200×630px image, or update the path.
3. **Portfolio items** — the 8 portfolio cards use icon placeholders and sample project names (e.g. "Corporate Website Redesign"). Swap in real screenshots and case studies as projects are completed.
4. **Testimonials** — the 4 client quotes are sample placeholders. Replace with verified client feedback.
5. **Google Map** — currently embeds a generic "Ndola, Zambia" map. Update the `q=` parameter in the iframe `src` (in the Contact section) with your exact office address for a precise pin.
6. **Social media links** — Facebook, Instagram, X, and LinkedIn icons in the header/footer/contact section currently link to `#`. Replace with your real profile URLs.
7. **Contact form** — the form currently shows a front-end-only success message (no backend). Connect it to an email service (e.g. Formspree, EmailJS, or your own backend/API endpoint) so submissions actually reach you.
8. **Canonical URL** — `<link rel="canonical">` and `og:url` are set to `https://www.egitalsolutions.com/`. Update once your domain is live.

## Notes
- Built with CSS custom properties matching the requested palette (Primary `#0F172A`, Accent Blue `#00C2FF`, Purple `#7C3AED`, Gold `#FBBF24`, White `#FFFFFF`).
- Uses Google Fonts (Space Grotesk, Inter, JetBrains Mono), Font Awesome 6, and the AOS scroll-reveal library — all loaded via CDN, so an internet connection is required when viewing.
- Fully responsive with a dedicated mobile menu, tested down to small phone widths.
- All pricing in the "Service Pricing" explorer is searchable and filterable by category, and every card includes a "Request Quote" button that scrolls to the contact form and pre-fills the service field.
