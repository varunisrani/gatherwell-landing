# GatherWell responsive verification

Checked on 14 September 2026 using a local browser preview of the delivered files.

## Layout checks — all passed

17 viewport sizes: 320×740, 360×800, 375×812, 390×844, 430×932, 600×960, 767×1024, 768×1024, 800×1100, 820×1180, 834×1194, 1000×800, 1024×768, 1180×820, 1280×800, 1440×1000, and 1920×1080.

At every size:

- Document width matched the viewport: no horizontal page scrolling.
- No visible elements extended beyond the left or right viewport edges.
- All five image elements loaded successfully.
- Visible links, menu buttons, and FAQ summaries were at least 44px tall.

## Interaction checks — passed

- Mobile menu opens with synchronized expanded state.
- Escape closes the menu and restores focus to its button.
- Selecting the FAQ navigation link closes the menu and reaches the FAQ section.
- FAQ answer expands and collapses.
- Resizing an open mobile menu to desktop resets it to closed.
- The existing test confirms all five external demo links match the destinations from the supplied ZIP.
- JavaScript syntax check passed and no browser runtime errors were reported.
- At 1440px with the root text size enlarged to 200%, no horizontal overflow or undersized targets were found.

## Visual and accessibility review

Reviewed screenshots for phone, iPad portrait, iPad landscape, desktop, the mobile menu, and an expanded FAQ. Full-page captures are included.

Automated accessibility scans at 390px and 768px reported zero violations. Text over photos required manual review because the scanner cannot resolve photo/gradient backgrounds; these captions were visually reviewed. This is not a claim of complete accessibility certification.

## Scope

Tests used Chromium viewport emulation, including sizes representative of iPad and iPad Air. Physical iPhone/iPad hardware and Safari were not tested. External demo application functionality is outside this landing-page update.

See `responsive-checks.json` for the per-viewport measurements.
