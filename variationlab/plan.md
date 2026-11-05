# Variation Lab Live — implementation plan

## Product approach

Variation Lab Live is a single-page classroom dashboard. The left rail is the anonymous entry portal; the main stage is the shared display for live class evidence. Students may submit only the measurements or categories they choose to record—no names, codes, login, client identifiers, or arbitrary metadata. Each accepted request must include explicit consent; the server validates that consent and discards it rather than storing it. One anonymous database row is persisted per submission, including JSON arrays for Investigation 7 leaf lengths and Investigation 8 seed masses.

The server validates field bounds and categories, rejects malformed nonblank numeric input, and enforces a maximum of 40 measurements in each dynamic grid. It computes touching-bar histogram bins using the existing Freedman–Diaconis/Sturges hybrid and category tallies. The public snapshot and SSE payload contain only grouped chart summaries: no submission rows, raw observations, per-row arrays, or exact min/max values. Full rows remain available only through teacher-key-protected CSV export. Dashboard sample size N continues to count submission rows. Server-Sent Events deliver refreshed aggregates, with a five-second polling fallback.

Teacher-only operations are progressively disclosed and protected by `TEACHER_KEY`. The documented `variationlab` classroom key is a development-only fallback; production fails closed when `TEACHER_KEY` is absent. CSV export and destructive clear remain separate operations, and the client confirms before a clear request.

The supplied database export has zero user records and zero class submissions. Restore the checked-in MySQL schema/migrations only; do not import placeholder records or run a destructive reset.

## Project structure

- `client/src/pages/Home.tsx` — responsive entry/dashboard composition, consent state, bounded add-row controls, SSE/polling subscription, teacher utilities, and Recharts visualizations.
- `client/src/index.css` — the midnight-observatory × field-notebook visual system: navy display stage, warm paper panels, cobalt/coral data cues, projection-size controls, and responsive layout.
- `client/public/assets/pdf/` — supplied PDF-derived collage and matching investigation pictures extracted from the PDF; the header uses the supplied cover panels edge-to-edge, and investigation pictures retain their aspect ratios without cropping inside the existing fixed-size panels.
- `server/_core/index.ts` — Express endpoints for anonymous submission, aggregate-only snapshot/SSE, health, protected CSV export, and protected clear.
- `server/variation.ts` — input validation, aggregate histogram binning, category tallies, and response shaping; raw submission rows remain separate from public summaries.
- `server/db.ts` — database access, submission persistence, and dashboard queries.
- `drizzle/schema.ts` and `drizzle/` — MySQL schema and checked-in additive migrations.
- `manus-routes.json` — page-route declaration for the dashboard.
- `app.config.ts` — project logo metadata.

## Design

### Chosen direction: midnight observatory × field notebook

- **Design movement:** contemporary scientific editorial with the focus of a classroom observation wall.
- **Core principles:** evidence first; calm enough for projection; tactile enough for data entry; anonymity is visible, not buried.
- **Color philosophy:** deep navy makes the display legible in a classroom, warm paper panels keep forms approachable, cobalt marks continuous measurements, coral marks categories, and mint indicates the live signal.
- **Layout paradigm:** a persistent left field-notebook rail feeds a larger right evidence stage. The dashboard is asymmetrical and scrolls vertically; it avoids a centered marketing hero and keeps charts close to their labels.
- **Signature elements:** a small pulsing live beacon; “continuous / discontinuous” evidence tags; thin measurement rules and interval ticks beneath charts.
- **Interaction philosophy:** one clear primary submit action, progressive disclosure for teacher controls, and every validation message framed as a helpful lab note.
- **Animation:** subtle 180–240ms panel lift on hover, a soft pulse around the live beacon, and chart bars animating only when the data snapshot changes.
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
- The website uses only imagery from the supplied PDF: the cover collage is the large header, worksheet Name/Date lines are removed, the two header panels touch edge-to-edge, and each matching investigation picture is shown whole without cropping. Existing investigation image-panel dimensions remain unchanged (150px desktop, 190px tablet, and 210px mobile); images retain their source aspect ratios and fit inside these panels. The left entry panel is text-only; the full PDF is not presented as a gallery.
- Before submit, a student explicitly consents to anonymous sharing; consent resets after each successful submission and is not recorded.
- Dashboard cards appear in chronological Investigation 1–8 order. Student-facing grouping labels remain neutral and do not classify the investigations for them.
