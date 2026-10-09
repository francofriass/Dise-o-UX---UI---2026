# Coffea landing page

Static, single-page landing for the fictional coffee shop Coffea. HTML5 + CSS3 only (no JavaScript, frameworks or preprocessors). Design source: Figma "Coffea - Free Responsive Coffee Shop Website Template", frame `Websites Design` (node `0:3`, 1920 x 4343 px).

## Structure

```
index.html            single page, semantic HTML
404.html              Netlify error page (same header and footer)
netlify.toml          publish dir, cache and security headers
css/
  main.css            @import of the layers, in order
  tokens.css          design tokens (custom properties)
  base.css            reset, base typography, :focus-visible
  layout.css          .container, .band, section title
  components/         one file per BEM block
  utilities.css       .visually-hidden, .skip-link, .btn
assets/
  img/                AVIF + JPG fallback
  icons/              optimized SVG
  fonts/              empty: fonts are loaded from Google Fonts
```

## Conventions

- BEM naming: `.product-card`, `.product-card__title`, `.product-card--featured`.
- Every color, font, radius and spacing comes from `css/tokens.css`.
- Mobile-first; breakpoints at 48rem (md), 64rem (lg) and 90rem (xl).
- Cascade controlled with `@layer tokens, base, layout, components, utilities`.
- All interaction is CSS-only: `<details>` menu, scroll-snap carousels, checkbox favorites, native form validation.

## Run locally

Use any static server from this folder (root-absolute links in `404.html` need one):

```
npx serve .
# or
python -m http.server 8000
```

## Deploy (Netlify)

1. Push the repository to GitHub or GitLab and connect it to Netlify.
2. Build command: none. Publish directory: `.`
3. `main` publishes to production; every pull request gets a Deploy Preview.
4. HTTPS is managed by Netlify.

`css/` and `assets/` are served with `immutable` caching. When a file changes, bump the `?v=` query in `index.html`, `404.html` and the `@import` lines of `css/main.css`.

## Notes

- Copy is placeholder text from the Figma template; typos in the design were fixed.
- Photos come from a Community template and may carry stock licenses: confirm or replace them before publishing.
