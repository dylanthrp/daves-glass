# Dave’s Glass — website draft

**GitHub Pages review preview:** https://dylanthrp.github.io/daves-glass/

The checked-in files are the review draft. Verify the Pages deployment after each push; a local test pass alone does not establish that it is live.

Plain HTML, CSS and JavaScript; no runtime dependencies or build step. Navy, cream and gold branding and the existing logo are retained. This real-client draft remains `noindex,nofollow` pending owner review and an authorized launch.

## Content and photos

- Compact Caro/Michigan hero, established-1978 / Greater Thumb strip, four services, six featured project photos, expanded project gallery, short About, six other services, contact/address/directions.
- All **29 supplied photographs** are included. The 30th supplied file is a bug-report screenshot and is excluded.
- `assets/photos/manifest.json` records exact original filenames, descriptive output names, captions and dimensions. Each has a full-scene WebP (maximum 1600px) and thumbnail (maximum 600px); Pillow never upscales or crops the files. CSS crops thumbnail presentation only; full scenes remain available through image links/lightbox.
- Photos 2–22 form the project gallery; the building/van photo appears in About. Labeled service illustrations 23–29 have a separate disclosure/gallery rather than being presented as completed projects. Six are also compact other-service thumbnails.
- Existing `img-0268.jpg` is used **only for Auto**. Residential and Seal Failure use the supplied fogged-window image. The old `img-3942.jpg` is no longer referenced. Unused original legacy assets remain on disk.
- User-supplied business details: established 1978, Greater Thumb, 1900 W Caro Rd, Caro MI 48723, (989) 673-3828, office@davesglassllc.com, weekdays 8 AM–5 PM. Saturday and Sunday: **call to confirm**. No generational narrative, job counts, insurance/licensing claims or turnaround promises.

## Email draft, not online submission

**Open email draft** validates fields and prepares a `mailto:` message. Nothing is submitted to a backend, and nothing is sent until the visitor sends it from their email app. Fields remain in the page. The body uses a neutral Dave’s Glass website attribution, not an unverified website domain.

**Copy message instead** works with webmail; if clipboard access is unavailable, the full selectable message and recipient remain visible. Visitors may attach photos in their email app. Without JavaScript, native mailto form behavior and direct contact links remain available, with an explanatory fallback. Closing/reloading the page does not persist entered information.

Gallery anchors open image files without JavaScript. With JavaScript, the native modal dialog supports keyboard opening, Escape, Close, focus containment and focus return. Native details elements expand the additional images.

## Local preview and regression

```bash
cd "C:/Users/dylan/Documents/daves-glass"
python qa/serve.py --port 4189
# http://127.0.0.1:4189/
```

Use this helper instead of stock `python -m http.server` on this Windows installation: its MIME database lacks WebP, which otherwise downloads native gallery links instead of displaying them.

In a separate terminal:

```bash
node --check assets/site.js
node qa/audit.cjs
# Optional remote/subpath target:
BASE_URL=https://example.com/daves-glass/ node qa/audit.cjs
```

The audit defaults to the installed Playwright at `C:/Users/dylan/Downloads/study-spot/node_modules/playwright`. Override with `PLAYWRIGHT_PATH` (package/module path) on another machine. Screenshots default to ignored `tests/audit-*.png`; override `SCREENSHOT_DIR` for a separate run.

Latest local run: **99 checks passed, exit 0**. Widths 320/390/768/1440; header non-overlap, overflow, stacked mobile contact, phone nowrap, content/navigation, correct images, all 29 originals reachable, lazy images loaded, gold button normal/hover contrast ≥4.5, lightbox keyboard/Escape/focus, form payload and validation, clipboard/manual fallback, no-JS gallery and no JavaScript errors. The test intercepts only the external email launcher; **no inquiry is sent**. These focused regressions are not a full accessibility certification.

Regression-first sequence: content/layout regression failed on the old hero, then passed; keyboard gallery regression failed before lightbox implementation, then passed; copy/email regression failed before draft implementation, then passed. The expanded no-JS test exposed the local server’s missing WebP MIME type, fixed by `qa/serve.py`.

Optional maintenance utilities (Pillow required): `python qa/prepare-photos.py` regenerates image derivatives from the original local composer image folder; `python qa/build-page.py` regenerates static `index.html` from its template and the manifest. If editing page copy, update that template as well. Neither is needed to serve the checked-in site.

Owner review remains the user’s responsibility. Keep `noindex,nofollow` until authorized for the real launch. GitHub Pages is the review preview, not a real-domain launch. No DNS changes are part of this refresh.
