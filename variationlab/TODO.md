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
- [x] The public GET snapshot and SSE payload contain only grouped histogram intervals/frequencies and category tallies—not raw observations, per-row arrays, submission IDs, or exact minimum/maximum values. Student-facing grouping labels remain neutral and totals protect privacy; full rows are available only through teacher-key-protected CSV export.

## Teacher utilities and production safety

- [x] Teacher controls are progressively disclosed and protected server-side by `TEACHER_KEY`. CSV export is available at `GET /api/export.csv?key=...` and contains one row per submission, with leaf values in a quoted JSON column.
- [x] Clearing class data uses `DELETE /api/class-data` with the teacher key and requires a second client-side confirmation before deletion.
- [x] The default `variationlab` key is used only as a development fallback; a production server with no configured `TEACHER_KEY` fails closed instead of accepting the default.
- [ ] A strong private `TEACHER_KEY` is configured before any public deployment. No production key is stored in the repository or browser bundle.

## Supplied artwork, design, and accessibility

- [x] Use only the supplied PDF-derived artwork: the two cover pictures form a gapless edge-to-edge header, worksheet Name/Date lines are removed, and each investigation chart uses its matching original picture from the supplied PDF. Show every complete picture without cutting or cropping it, preserve the source aspect ratio, and keep the existing image-panel dimensions unchanged at 150px desktop, 190px tablet, and 210px mobile. Do not embed the full PDF as a lesson gallery; keep the left entry panel text-only.
- [x] Preserve the approved midnight-observatory × field-notebook visual direction: deep navy display stage, warm paper panels, cobalt continuous-measurement cues, coral category cues, mint live beacon, measurement rules/interval ticks, DM Sans for controls/data, Space Grotesk for display headings, and restrained motion.
- [x] Essential classroom labels, inputs, actions, consent text, and chart titles use large-print typography at approximately 26px or larger at desktop and mobile widths.

## Managed project and delivery

- [x] The Manus-managed server and database are enabled; checked-in schema/migrations are applied to the new empty MySQL database without importing records. The supplied snapshot contains zero user rows and zero class-submission rows.
- [x] The root route manifest at `/manus-routes.json` contains the actual page route `/` titled `Variation Lab Live`, and `/api/health` returns an unauthenticated HTTP success response.
- [x] The restored project installs from the checked-in pnpm lockfile, passes its existing type and application checks, builds, and is available in Manus Preview.
