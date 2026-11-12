# Fonda & Carroza Fest

A polished, build-free landing page for a **fictional educational festival** connecting Chile's Fiestas Patrias with Colombia's Blacks and Whites' Carnival in Pasto. Concept date: **January 18, 2027**. All website content is in English.

## Technologies

Semantic HTML5, mobile-first CSS Grid and Flexbox, vanilla ES6+ JavaScript, Plus Jakarta Sans from Google Fonts, and Lucide 0.468.0 from CDN. The QR encoder is self-contained. No backend, API credentials, package manager, or build step.

## Features

- Sticky responsive navigation, active section indicators, Escape support, mobile focus handling, and smooth scrolling.
- Live countdown with event-day and completed states. The shared reference timezone is **America/Santiago**: `2027-01-18T00:00:00-03:00` (03:00 UTC; January 17 at 22:00 in Pasto). Event day ends at midnight January 19 in Santiago.
- Three accessible expandable fusion cards.
- Instant destination tabs with Arrow Left/Right, Home, End, Enter, and Space support.
- Intersection Observer animations and reduced-motion support.
- Locally generated QR of the actual deployed URL, with a four-module white quiet zone. Byte mode, error correction L, versions 1–10, up to 271 ASCII URL bytes. Overlong addresses retain the share button and show a clear message.
- Web Share API with clipboard and manually selectable link fallbacks. Share cancellation is handled silently.
- Verified cultural photographs, responsive image sizes, lazy loading, and original local illustration fallbacks with honest replacement captions and alt text.
- Semantic landmarks, skip link, visible focus, metadata, and Open Graph tags.
- Clearly qualified sustainability targets and proposed travel experiences.

## Project structure

```text
fonda-carroza-fest/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   └── images/
│       ├── festival-art.svg
│       └── andean-landscape.svg
├── README.md
├── .gitignore
└── favicon.svg
```

## Run locally

Open `index.html` directly in a modern browser. Navigation, countdown, cards, and tabs work with `file://`. An internet connection loads photographs, fonts, and Lucide. System fonts, CSS graphics, and local SVG fallbacks preserve the design when services are unavailable.

Optional development server, run from the project directory:

```sh
python -m http.server 8000
```

Visit `http://localhost:8000`. Stop with Ctrl+C. Python is not required to view or deploy the website.

Local files and localhost intentionally do not generate misleading public sharing links. Once published, the QR automatically encodes the actual HTTP(S) page address, including repository subpaths. Fragments and query strings are excluded. Native sharing and modern clipboard access depend on browser support and a secure context; a selectable-link fallback covers clipboard failures.

## Deploy to GitHub Pages

1. Create a repository and copy **the contents of `fonda-carroza-fest`** into its root.
2. Commit and push to `main`.
3. Open **Settings → Pages → Deploy from a branch**.
4. Choose `main` and **/ (root)**, then Save.
5. Open the HTTPS URL GitHub provides. The QR and sharing tools use it automatically.

All local resources use relative paths, including GitHub repository subpaths. No configuration or build is needed. If the project remains inside a larger repository, access `/fonda-carroza-fest/` under that repository's Pages URL. GitHub's branch publishing source supports `/` or `/docs`; copying this folder's contents to the repository root is simplest.

For a custom domain, use GitHub Pages' domain settings and documented DNS procedure. The QR follows the hostname visited. After choosing a permanent domain, optionally add a static absolute `og:url`; social crawlers may not execute JavaScript. The existing Open Graph image is an attributed Laguna de la Cocha photograph.

## Images and assets

Documentary photographs show real places and traditions, **not this fictional event**. Photos load from Wikimedia Commons in 640px/960px variants, with responsive CSS cropping. Their original licenses apply; visible source and license links are also in the website footer. Redistributed adapted photos must retain attribution and any share-alike conditions. No photographer endorsement is implied.

| Image | Creator and source | License |
| --- | --- | --- |
| Pasto artisan float, January 6, 2023 | [Hanksol](https://commons.wikimedia.org/wiki/File:Carroza_de_carnaval_de_Pasto_6_de_enero_01.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Fiestas Patrias, O'Higgins Park, 2018 | [kallerna](https://commons.wikimedia.org/wiki/File:Fiestas_Patrias_O%27Higgins_Park_2018.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Laguna de la Cocha, from La Corota island | [Juan Velasco](https://commons.wikimedia.org/wiki/File:Laguna_de_la_Cocha.JPG) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| Cajón del Maipo | [gaspar abrilot / Casper Abrilot](https://commons.wikimedia.org/wiki/File:Cajon_del_Maipo_-_Flickr_-_Casper_Abrilot.jpg) | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) |
| Traditional kites at Los Dominicos | [Paul Lowry](https://commons.wikimedia.org/wiki/File:Volantines_en_los_Dominicos.jpg) | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) |

Food and drink visuals are conceptual Lucide illustrations, avoiding generic photographs mislabeled as specific local dishes. Favicon, patterns, and fallback SVGs are original project artwork. No AI-generated photographs are used.

- [Lucide](https://lucide.dev/) — ISC license.
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — SIL Open Font License.
- Cultural background: [National Library of Chile](https://www.memoriachilena.gob.cl/602/w3-article-350380.html) and [UNESCO](https://ich.unesco.org/en/RL/blacks-and-whites-carnival-00287).

To self-host photos later, download the originals from their source pages, retain license and attribution, resize responsibly, and update both `src` and the image configuration in `main.js`.

## Validation

Implementation checks passed: JavaScript syntax; unique HTML IDs; anchor and ARIA targets; local asset paths; image alt text, dimensions, and lazy loading; and required project files. Fourteen isolated JavaScript logic checks passed for countdown boundaries, fusion-card states, and pointer/keyboard destination changes. Independent QR extraction recovered the original payload and validated Reed?Solomon syndromes for versions 1?10.

Full browser rendering, responsive screenshots, live external image delivery, real-device QR scanning, and Lighthouse could not be completed in the restricted execution environment. These remain deployment verification steps; no browser or Lighthouse result is implied by the logic checks.

- Check every navigation link, CTA, mobile menu, Escape action, and active marker.
- Confirm the countdown seconds change; emulate January 18/19, 2027 for boundary states.
- Open and close every fusion card with pointer and keyboard.
- Switch destinations with pointer, arrows, Home, and End.
- Inspect 360, 390, 768, 1024, 1440px, and wide desktop layouts for overflow.
- Check photo loading and accurately labeled fallbacks with the network disabled.
- Check focus order, reduced motion, and the browser console.
- Scan the QR on the deployed URL and exercise native sharing or clipboard fallback.
- Run Lighthouse on the deployed site; third-party font, icon, and photo services can affect scores. No unmeasured Lighthouse score is claimed.

## Fictional educational project disclaimer

This is a concept, not an announced event or booking service. The imagined January date does not change either real tradition's dates. Menus, transport, workshops, itineraries, and sustainability measures are proposals, not confirmed services. Temperatures are approximate context, not a forecast. “100% biodegradable” and “zero-plastic” are proposed targets, not audited results. Natural powders are not automatically safe to inhale or environmentally harmless. A real festival would require independent safety assessment, local permissions, careful handling, exclusion areas, cleanup, and responsible disposal.
