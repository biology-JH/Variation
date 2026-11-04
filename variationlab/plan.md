# Variation Lab Live — implementation plan

## Product approach

Variation Lab Live is a single-page classroom dashboard. The left rail is the anonymous entry portal; the main stage is the shared display for live class evidence. Students submit only the measurements or categories they choose to record—no names, codes, login, or client identifiers. The server persists each submission in the managed MySQL database and broadcasts refreshed aggregates through Server-Sent Events, with a polling fallback for reconnects.

The data model stores one anonymous submission row per student plus a JSON-encoded leaf-length array for Investigation 7. The server validates ranges and categories, computes touching-bar histogram bins using a Freedman–Diaconis/Sturges hybrid, and returns both raw observations and chart-ready summaries. Teacher-only operations are protected by a server-side key (`TEACHER_KEY`, defaulting to a documented classroom key for out-of-the-box use): CSV export and destructive clear are not visible until the teacher utility is opened.

## Project structure

- `client/src/pages/Home.tsx` — responsive entry/dashboard composition, form state, SSE subscription, export/reset controls, and Recharts visualizations.
- `client/src/index.css` — visual system: deep ink background, paper cards, cobalt/coral chart language, responsive layout, and presentation mode details.
- `server/_core/index.ts` — Express endpoints for data submission, dashboard snapshots, SSE, CSV export, and protected clear.
- `server/db.ts` — database access and dashboard aggregation helpers.
- `drizzle/schema.ts` — `classSubmissions` table alongside the starter users table.
- `manus-routes.json` — route declaration for the dashboard.
- `app.config.ts` — project logo metadata.

## Design

### Candidate directions

1. **Field-notebook editorial** (0.08): quiet paper cards, specimen annotations, and measured data cues.
2. **Midnight observatory** (0.06): an inky display surface with luminous chart bands and a live classroom signal.
3. **Lab poster modernism** (0.05): oversized numerals, strong blocks, and brightly coded evidence tags.

### Chosen direction: midnight observatory × field notebook

- **Design movement:** contemporary scientific editorial with the focus of a classroom observation wall.
- **Core principles:** evidence first; calm enough for projection; tactile enough for data entry; anonymity is visible, not buried.
- **Color philosophy:** deep navy makes the display legible in a classroom, warm paper panels keep forms approachable, cobalt marks continuous measurements, coral marks categories, and mint indicates the live signal.
- **Layout paradigm:** a persistent left field notebook rail feeds a larger right evidence stage. The dashboard is asymmetrical and scrolls vertically; it avoids a centered marketing hero and keeps charts close to their labels.
- **Signature elements:** a small pulsing live beacon; “continuous / discontinuous” evidence tags; thin measurement rules and interval ticks beneath charts.
- **Interaction philosophy:** one clear primary submit action, progressive disclosure for teacher controls, and every validation message framed as a helpful lab note.
- **Animation:** subtle 180–240ms panel lift on hover, a soft pulse around the live beacon, and chart bars animating only when the data snapshot changes.
- **Typography system:** `DM Sans` for controls and data; `Space Grotesk` for display headings and large N counters. Font imports fall back to system sans if offline.
- **Brand essence:** a shared class lab bench for seeing variation together — precise, welcoming, alive.
- **Brand voice:** headings are concise and observational; CTAs sound like lab actions. Example: “Add your evidence.” “Watch the class pattern settle.”
- **Wordmark / logo:** a stacked “VL” monogram formed from one vertical measurement rule and one split category bar.
- **Signature brand color:** electric cobalt `#5b7cff`.

## Backend and frontend behavior

- Public POST submissions never require authentication and never accept a name, email, student ID, or arbitrary metadata.
- Continuous traits use sensible school-lab validation bounds: mass 20–300 kg, height 80–230 cm, hand span 5–35 cm, leaf lengths 0.5–60 cm, seed mass 0.001–10 g.
- The live snapshot includes `totalSampleSize` (number of student submissions), per-investigation observations, auto-binned histograms, and category tallies.
- Export returns a CSV containing one row per submission and leaf values in a quoted JSON column. Clear requires the teacher key and a second confirmation on the client.
- The website uses only imagery cropped from the newly attached PDF: the cover collage is the large header, worksheet Name/Date lines are removed, and the title is restyled with a distinctive display treatment. The remaining PDF pictures are cropped into large image panels beside their matching investigations on the right; the left entry panel is text-only.
- Before the submit action, the student must explicitly tick a consent checkbox confirming that the selected result may be shared anonymously; consent resets after each successful submission and no consent record or identity is stored.
- The interface uses large-print classroom typography with essential labels, inputs, buttons, and chart titles at 26px or larger. Student-facing grouping labels remain neutral and do not reveal which investigation is continuous or discontinuous.
- Investigation 8 includes the same add-row interaction as Investigation 7, persists multiple seed masses, and contributes every entered row to the live histogram.
- Dashboard cards are displayed in chronological Investigation 1–8 order. The two PDF-derived header pictures are composited edge-to-edge with no white gap between them.
