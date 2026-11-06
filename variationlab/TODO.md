# Variation Lab Live — delivery outcomes

## Anonymous entry and submissions

- [x] Students can participate optionally and submit any subset of Investigations 1–8 together in one anonymous submission. The portal does not require or accept a name, student ID, login, class code, client identifier, or arbitrary identifying metadata; unexpected fields are rejected server-side.
- [x] Before submission, students must tick an unchecked consent checkbox explaining that the selected result may be shared anonymously. The server rejects submissions without `consent: true`; consent resets after a successful submission and is never stored with identity or submission records.
- [x] Investigation 1 accepts body mass from 20–300 kg; Investigation 2 accepts height from 80–230 cm; Investigation 3 accepts hand span from 5–35 cm. Invalid nonblank numeric values are rejected with clear validation feedback, not silently dropped.
- [x] Investigation 4 offers Can/Cannot tongue-rolling choices; Investigation 5 offers Brown/Blue/Green/Hazel eye-colour choices; Investigation 6 offers simulated A/B/AB/O blood-group choices.
- [x] Investigation 7 provides a dynamic add/remove-row grid for 1–40 leaf-length measurements, each from 0.5–60 cm. Investigation 8 provides a dynamic add/remove-row grid for 1–40 seed-mass measurements, each from 0.001–10 g. The interface prevents adding a 41st row and the server independently enforces the same limit.
- [x] A single submit action validates all selected values on the server, persists one anonymous row per submission, supports multiple leaf-length and seed-mass observations in the same row, and provides clear validation feedback.

## Live shared dashboard

- [x] The dashboard shows total sample size N as the number of submission rows and refreshes from the shared data without a forced page reload.
- [x] Server-Sent Events are served at `/api/class-data/stream`; the client has a five-second polling fallback when the live stream is unavailable.
- [x] Dashboard cards are strictly ordered Investigations 1–8. Investigations 1, 2, 3, 7, and 8 show touching-bar histograms with automatically adapting intervals; Investigations 4, 5, and 6 show separated categorical bars and tallies.
- [x] Change only the right-hand investigation board: preserve the existing left entry rail, cover/header, form, and all other layout. Show two wider cards per row in pairs 1/2, 3/4, 5/6, and 7/8 whenever that panel can fit them; switch only that board to one column when it is too narrow. Keep every investigation picture at its existing 316px width and natural height; do not resize, overlap, or crop pictures. Chart titles, tags, plots, and footnotes must fit or wrap without overlapping text or overflowing the board. Remove investigation-card drop shadows and hover lift.
- [x] The public GET snapshot and SSE payload contain only grouped histogram intervals/frequencies and category tallies—not raw observations, per-row arrays, submission IDs, or exact minimum/maximum values. Student-facing grouping labels remain neutral and totals protect privacy; full rows are available only through teacher-key-protected CSV export.

## Teacher utilities and production safety

- [x] Teacher controls are progressively disclosed and protected server-side by `TEACHER_KEY`. CSV export is available at `GET /api/export.csv?key=...` and contains one row per submission, with leaf values in a quoted JSON column.
- [x] Clearing class data uses `DELETE /api/class-data` with the teacher key and requires a second client-side confirmation before deletion.
- [x] The default `variationlab` key is used only as a development fallback; a production server with no configured `TEACHER_KEY` fails closed instead of accepting the default.
- [ ] A strong private `TEACHER_KEY` is configured before any public deployment. No production key is stored in the repository or browser bundle.

## Supplied artwork, design, and accessibility

- [x] Use only the supplied PDF-derived artwork: the two cover pictures form a gapless edge-to-edge header, worksheet Name/Date lines are removed, and each investigation chart uses its matching original picture from the supplied PDF. Show each picture at the same printed physical size as in the PDF—approximately 316 CSS px wide at 96 CSS px/in, with the natural aspect-derived height—without scaling it into a smaller or larger fixed-size box and without cutting or cropping it. Do not embed the full PDF as a lesson gallery; keep the left entry panel text-only.
- [x] Preserve the approved midnight-observatory × field-notebook visual direction: deep navy display stage, warm paper panels, cobalt continuous-measurement cues, coral category cues, mint live beacon, measurement rules/interval ticks, DM Sans for controls/data, Space Grotesk for display headings, and restrained motion.
- [x] Essential classroom labels, inputs, actions, consent text, and chart titles use large-print typography at approximately 26px or larger at desktop and mobile widths.

## Printable student worksheet export

- [x] Keep the accessible no-login “Download student worksheet (PDF)” action in the shared dashboard. It downloads a bundled, print-ready A4 PDF students can use offline after download; the template contains no live class submissions, names, or identifiers and requires no API or database request.
- [x] Include an overall learning objective and a section for each of Investigations 1–8. Each section contains a student-ready learning objective, safe step-by-step methodology, an item-specific risk assessment with hazard/control actions, a blank data-recording table, graph-planning instructions with plotting space and labeled axes, and neutral interpretation questions. Match the dashboard values/ranges: body mass 20–300 kg, height 80–230 cm, hand span 5–35 cm, tongue rolling Can/Cannot, eye colour Brown/Blue/Green/Hazel, simulated blood group A/B/AB/O, leaf lengths 0.5–60 cm up to 40 observations, and seed masses 0.001–10 g up to 40 observations. Use histograms for continuous traits and separated bar charts for categorical traits. Make participation optional and avoid public comparison of sensitive body measurements; Investigation 6 uses simulation only, never real blood.
- [x] Use the exact pictures shown on the website: make the existing `header-edge-to-edge.png` picture the workbook cover picture and include the matching visible dashboard picture in each of all eight investigation sections, with a readable caption attributing it to the Variation Lab Live website. Do not use the earlier web-search/stock/Manus pictures; remove the separate source/image-credit appendix and put necessary picture credits directly on the relevant pages.
- [x] Make all words in the entire workbook larger and readable: body text 12 pt and no visible text smaller than 11.5 pt, including graph labels, table headings/numbers, image captions, and page furniture.
- [x] Remove printed workbook pages 17–18 (sources/credits appendix), keep all eight investigations, and deliver exactly 18 physical PDF pages: cover, guide, and two pages for each investigation.

## Bilingual keyword edition

- [x] Preserve the final English booklet byte-for-byte and provide a separate downloadable duplicate that retains its English directions, methods, risks, questions, data ranges, website pictures, and all eight investigations; translate selected keywords only into Traditional Chinese, not the complete paragraphs.
- [x] Include a compact English–Traditional Chinese keyword key within the existing student guide and inline translations for the investigation names and essential keywords: variation, continuous/discontinuous variation, measurement, sample, risk assessment, hazard/control, safety/privacy/voluntary participation, category, tally, frequency, frequency table, histogram, bar chart, interval/bin, horizontal/x-axis, vertical/y-axis, and the eight investigation traits/categories. Do not translate full paragraphs or add appendix pages. Render every Traditional Chinese glyph correctly with an installed CJK font and keep large-print sizing (12 pt body, no visible text smaller than 11.5 pt); the bilingual edition preserves the same 18-page structure.
- [x] Add a second accessible static-download action on the website, clearly distinguished as the English workbook with Traditional Chinese keyword translations, alongside the unchanged English download. The bilingual PDF is bundled for offline use and requires no live class data, API, or database request.

## Managed project and delivery

- [x] The Manus-managed server and database were enabled during the initial restoration; its original checked-in MySQL migrations were applied to the empty MySQL database. The supplied snapshot contains zero user rows and zero class-submission rows. The managed MySQL resource remains provisioned and is not used by the converted PostgreSQL application.
- [x] The root route manifest at `/manus-routes.json` contains the actual page route `/` titled `Variation Lab Live`, and `/api/health` returns an unauthenticated HTTP success response.
- [x] The restored project installs from the checked-in pnpm lockfile, passes its existing type and application checks, builds, and is available in Manus Preview.

## PostgreSQL database conversion

- [x] Convert the database layer and Drizzle schema from MySQL to PostgreSQL and update the project. This project does not contain a Prisma schema. Use a PostgreSQL Drizzle driver and PostgreSQL column/enumeration types, preserving the current `users` and `class_submissions` model, anonymous-submission fields, query behavior, and user upsert behavior. Use checked-in PostgreSQL migrations and preserve the prior MySQL migration history as inactive archive material.
- [x] Apply the PostgreSQL migration only after Aiven service `pg-12682151` was confirmed running PostgreSQL 18 and its URI was configured securely. The migration created the app enum types, `users`, `class_submissions`, and Drizzle migration history in the initially empty public schema. Do not connect a PostgreSQL driver to the still-enabled Manus managed MySQL DSN. Do not copy or delete MySQL data as part of this schema conversion; the new application tables remain empty.
- [x] Verify the user-provided Aiven project CA with certificate validation enabled, confirm TLS to `pg-12682151` on PostgreSQL 18, and confirm the public schema contained zero tables before migration. The live Manus Preview health, route manifest, and class-data snapshot return HTTP 200 with sample size zero.
