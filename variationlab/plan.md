# Variation Lab Live — implementation plan

## Product approach

Variation Lab Live is a single-page classroom dashboard. The left rail is the anonymous entry portal; the main stage is the shared display for live class evidence. Students may submit only the measurements or categories they choose to record—no names, codes, login, client identifiers, or arbitrary metadata. Each accepted request must include explicit consent; the server validates that consent and discards it rather than storing it. One anonymous database row is persisted per submission, including JSON arrays for Investigation 7 leaf lengths and Investigation 8 seed masses.

The server validates field bounds and categories, rejects malformed nonblank numeric input, and enforces a maximum of 40 measurements in each dynamic grid. It computes touching-bar histogram bins using the existing Freedman–Diaconis/Sturges hybrid and category tallies. The public snapshot and SSE payload contain only grouped chart summaries: no submission rows, raw observations, per-row arrays, or exact min/max values. Full rows remain available only through teacher-key-protected CSV export. Dashboard sample size N continues to count submission rows. Server-Sent Events deliver refreshed aggregates, with a five-second polling fallback.

Teacher-only operations are progressively disclosed and protected by `TEACHER_KEY`. The documented `variationlab` classroom key is a development-only fallback; production fails closed when `TEACHER_KEY` is absent. CSV export and destructive clear remain separate operations, and the client confirms before a clear request.

The supplied database export has zero user records and zero class submissions. The user selected Aiven service `pg-12682151`; a read-only TLS-verified connection confirmed PostgreSQL major version 18 and an initially empty public schema. The connection URI is stored as the protected Manus `POSTGRES_DATABASE_URL`. Use the supplied public Aiven project CA certificate with `rejectUnauthorized: true`; do not disable certificate or hostname verification. Keep PostgreSQL migrations separate from the archived MySQL migration history. Do not copy data from the existing MySQL service or run PostgreSQL DDL against it. The already-enabled Manus managed MySQL capability remains unchanged and is not used by the converted app.

## Project structure

- `client/src/pages/Home.tsx` — responsive entry/dashboard composition, consent state, bounded add-row controls, SSE/polling subscription, teacher utilities, and Recharts visualizations.
- `client/src/index.css` — the midnight-observatory × field-notebook visual system, preserving the existing left entry rail, cover, and form layout while changing only the right dashboard to two investigation cards per row when its content width can fit the unchanged PDF-sized pictures; use a one-column fallback within that panel to prevent overflow.
- `client/public/assets/pdf/` — supplied PDF-derived collage and matching investigation pictures extracted from the PDF; the header uses the supplied cover panels edge-to-edge. Investigation pictures display at the PDF's printed physical width (about 316 CSS px at 96 CSS px/in), with full natural aspect-derived height and no crop.
- `server/_core/index.ts` — Express endpoints for anonymous submission, aggregate-only snapshot/SSE, health, protected CSV export, and protected clear.
- `server/variation.ts` — input validation, aggregate histogram binning, category tallies, and response shaping; raw submission rows remain separate from public summaries.
- `server/db.ts` — CA-verified PostgreSQL connection pool, submission persistence, and dashboard queries; reject non-PostgreSQL DSNs rather than accidentally connecting the converted schema to Manus-managed MySQL.
- `drizzle/schema.ts` and `drizzle/postgres/` — PostgreSQL schema and checked-in additive migrations. `drizzle/legacy-mysql/` retains the original migration chain for reference; it is not active.
- `certs/aiven-ca.pem` — public Aiven project CA trust anchor used by Node's PostgreSQL driver with certificate verification enabled; refresh from Aiven when its CA rotates.
- `scripts/migrate-db.ts` — finite PostgreSQL migration command using the same explicit CA trust and strict TLS verification as the runtime.
- `DATABASE.md` — PostgreSQL connection, TLS, migration, and MySQL-history safety notes.
- `manus-routes.json` — page-route declaration for the dashboard.
- `app.config.ts` — project logo metadata.
- `worksheet/` — the Typst source, content manifest, selected build plan, research notes, and local copies of the exact header and eight investigation pictures shown by the website; no web-search/stock images are included.
- `client/public/downloads/variation-lab-student-worksheet.pdf` — the final English A4, print-ready blank workbook, served as a static download for offline classroom use.
- `worksheet/bilingual/` — a separate Typst source, Traditional Chinese keyword glossary, build plan, and Noto CJK TC font-fallback configuration for the bilingual duplicate; it retains the English instructions and reuses the same website pictures.
- `client/public/downloads/variation-lab-student-worksheet-bilingual.pdf` — the bilingual English + Traditional Chinese keyword edition, served as its own static offline download without changing the English PDF.
- `client/src/components/WorksheetDownload.tsx` — accessible dashboard links to both static PDFs; neither requests, exposes, nor embeds live class data.

## Printable student worksheet

Add a no-login PDF download action in the right dashboard’s classroom-information area, leaving the entry rail and cover/header composition intact. The bundled worksheet is an offline blank template, not a live-data export, and contains no student submissions, names, or identifiers. Build its source in `worksheet/` with the selected Typst base and include the resulting file under `client/public/downloads/` so a normal Vite production build serves the PDF without a new API or database dependency.

The A4 portrait workbook uses a print-friendly field-notebook treatment: 12 pt body text, no smaller than 11.5 pt for any visible words, larger headings and labels, 14 mm margins, restrained navy/cobalt/coral markers, and no large ink-heavy backgrounds. The exact `header-edge-to-edge.png` picture shown in the website becomes the cover picture. Each of Investigations 1–8 spans two pages and uses the matching picture already displayed on that investigation's dashboard card, copied locally from `client/public/assets/pdf/investigations/`; each page captions the picture as Variation Lab Live website artwork. The workbook replaces all earlier web-search/stock images, has no separate bibliography or image-credit appendix, and retains research/source notes only in the project files. It begins with class-level learning goals and usage/safety reminders. Each investigation has an objective, safe numbered method, item-specific risk assessment, and blank data table on the first page; graph guidance, correctly labeled axes and plotting space, and neutral interpretation prompts on the second. Numerical traits use histograms and category traits use separated bar charts. Final PDF: 18 physical pages—cover, student guide, and the 16 pages for all eight investigations; no printed pages 17–18 appendix.

## Bilingual keyword edition

Create a separate PDF from a copy of the approved English Typst source; preserve the final English PDF byte-for-byte. Keep the English workbook text, methods, questions, safety directions, data ranges, site pictures, and 18-page structure, while translating only key terms into Traditional Chinese. Add a clearly labelled bilingual cover, a compact English–Traditional Chinese keyword key within the existing student guide, and inline Chinese equivalents for investigation names plus important risk, data, and graph/table labels; do not add an appendix or translate full paragraphs. Use the installed Noto CJK TC font for Chinese glyphs with the existing English serif/sans families as fallbacks; keep the large-print hierarchy (12 pt body and no visible text below 11.5 pt). Place the duplicate at `/downloads/variation-lab-student-worksheet-bilingual.pdf` and add a second accessible static-download link beside the English option. The bilingual file remains a blank offline template with no live class/student data and no new API/database behavior.

## Design

### Chosen direction: midnight observatory × field notebook

- **Design movement:** contemporary scientific editorial with the focus of a classroom observation wall.
- **Core principles:** evidence first; calm enough for projection; tactile enough for data entry; anonymity is visible, not buried.
- **Color philosophy:** deep navy makes the display legible in a classroom, warm paper panels keep forms approachable, cobalt marks continuous measurements, coral marks categories, and mint indicates the live signal.
- **Layout paradigm:** keep the existing left field-notebook rail, cover/header, and form layout unchanged. Only the right evidence board changes: it uses two wider investigation cards per row in the exact pairs 1/2, 3/4, 5/6, and 7/8. A container-width fallback switches that board to one column when it cannot fit two cards around the unchanged 316px PDF pictures, preventing overlap or overflow. The page remains vertically scrolling and avoids a centered marketing hero.
- **Signature elements:** a small pulsing live beacon; “continuous / discontinuous” evidence tags; thin measurement rules and interval ticks beneath charts.
- **Interaction philosophy:** one clear primary submit action, progressive disclosure for teacher controls, and every validation message framed as a helpful lab note.
- **Animation:** no hover lift or drop shadow on investigation cards, preventing card effects from visually intruding on neighboring text; retain a soft pulse around the live beacon and chart-bar motion only when the data snapshot changes.
- **Typography system:** `DM Sans` for controls and data; `Space Grotesk` for display headings and large N counters. Font imports fall back to system sans if offline. Essential classroom labels, input text, actions, consent text, and chart titles remain at least 26px, including at mobile widths.
- **Brand essence:** a shared class lab bench for seeing variation together — precise, welcoming, alive.
- **Brand voice:** headings are concise and observational; CTAs sound like lab actions. Example: “Add your evidence.” “Watch the class pattern settle.”
- **Wordmark / logo:** a stacked “VL” monogram formed from one vertical measurement rule and one split category bar.
- **Signature brand color:** electric cobalt `#5b7cff`.

## Backend and frontend behavior

- Public POST submissions never require authentication and never accept a name, email, student ID, or arbitrary metadata. A required `consent: true` value is checked server-side and never persisted.
- Continuous traits use school-lab validation bounds: body mass 20–300 kg, height 80–230 cm, hand span 5–35 cm, leaf lengths 0.5–60 cm, and seed mass 0.001–10 g. Invalid supplied numbers are rejected rather than silently omitted.
- Investigation 7 and 8 each support one to 40 rows in the interface and server validation; rows can be removed and multiple observations persist in the same submission.
- The public live snapshot includes `totalSampleSize` (submission-row count), histogram interval labels/frequencies, and category tallies only. Do not expose per-student values, exact extrema, submission IDs, or other row-level data in GET or SSE responses.
- Export returns a CSV with one row per submission and leaf values in a quoted JSON column. Clear requires the teacher key and a second confirmation on the client.
- The live dashboard continues using only the supplied PDF-derived artwork: the cover collage is the large header, worksheet Name/Date lines are removed, the two header panels touch edge-to-edge, and each matching investigation picture is displayed at the same printed physical size as in the PDF (about 316 CSS px wide at 96 CSS px/in, with its natural aspect-derived height). Preserve the complete image without scaling it into a shorter fixed-height panel or cutting/cropping it. The left entry panel is text-only; the full PDF is not presented as a gallery. The downloadable student workbook reuses the same website header picture on its cover and all eight investigation pictures already shown on the website; it includes no separate web-search or Manus-generated picture.
- Before submit, a student explicitly consents to anonymous sharing; consent resets after each successful submission and is not recorded.
- Dashboard cards appear in chronological Investigation 1–8 order, with two wider cards per row paired 1/2, 3/4, 5/6, and 7/8 whenever the layout can fit the PDF-sized pictures. Screens too narrow for two cards switch to one column to avoid overflow. Chart titles, tags, plots, and footnotes wrap or size within each card with no overlapping text; investigation cards have no drop shadow or hover lift. Student-facing grouping labels remain neutral and do not classify the investigations for them.
