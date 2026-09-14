# GatherWell responsive landing page

Open `dist/index.html` in a browser after extracting this folder. No installation or build is needed. Keep the entire `dist` folder together so the images, styles, and menu script load.

For static hosting, upload the contents of `dist`. The existing Sites project is preserved in `.openai/hosting.json`.

## What's improved

- Responsive phone, tablet, and desktop layouts, including iPad portrait and landscape.
- Larger mobile text, full-width phone actions, and touch targets at least 44px tall.
- Refined feature cards, image framing, spacing, and consistent rounded corners.
- Sticky navigation, an accessible mobile menu, Escape dismissal, outside-click dismissal, and reset when changing to desktop layout.
- Original content, local images, and the demo destinations from the supplied ZIP are preserved.
- Reduced-motion preference and keyboard focus indicators remain supported.

`dist/styles.css` is the original theme. `dist/responsive.css` contains the UI refinements and responsive rules. `dist/site.js` controls the navigation disclosure. Main layouts change at 1000px, 767px, and 479px.

## Verification

Browser checks passed at 17 widths from 320px through 1920px. The download includes screenshots and a detailed verification report. Tests use Chromium viewport emulation; they are not physical-device Safari tests.

The external pastor and member applications are separate products. This update preserves their links; it does not modify those applications.

The existing destination check can be run with `node --test tests/landing-links.test.mjs` when Node.js is installed.
