from pathlib import Path
import hashlib

ROOT = Path('/home/ubuntu/variationlab')
OUT = ROOT / 'variationlab-workspace-migration.md'
SKIP = {'.git', 'node_modules', 'dist', '.manus-logs'}
ASSET_ROOT = ROOT / 'client/public/assets'

LANG = {'.ts':'typescript', '.tsx':'tsx', '.js':'javascript', '.jsx':'jsx', '.css':'css', '.json':'json', '.md':'markdown', '.sql':'sql', '.yaml':'yaml', '.yml':'yaml', '.html':'html', '.patch':'diff'}

def included(p):
    r = p.relative_to(ROOT)
    if any(x in SKIP for x in r.parts): return False
    if p.name in {'build-migration-bundle.py', 'variationlab-workspace-migration.md'}: return False
    if r.parts[:3] == ('client', 'public', 'assets'): return False
    return True

def is_text(p):
    try:
        b = p.read_bytes()
        b.decode('utf-8')
        return b'\x00' not in b
    except Exception:
        return False

def fence(text):
    longest = 0
    run = ''
    for ch in text:
        if ch == '`': run += ch
        else:
            longest = max(longest, len(run)); run = ''
    longest = max(longest, len(run))
    return '`' * max(3, longest + 1)

def language(p):
    return 'dockerfile' if p.name == 'Dockerfile' else LANG.get(p.suffix.lower(), '')

files = [p for p in sorted(ROOT.rglob('*')) if p.is_file() and included(p) and is_text(p)]
assets = []
for p in sorted(ASSET_ROOT.rglob('*')) if ASSET_ROOT.exists() else []:
    if p.is_file():
        b = p.read_bytes()
        assets.append((p.relative_to(ROOT).as_posix(), len(b), hashlib.sha256(b).hexdigest()))

parts = []
def add(s=''):
    parts.append(s + '\n')

add('# Manus Rehydration Guide')
add('')
add('1. Open a new Manus session and paste this exact instruction: **"I am migrating a workspace from another account. Below is the complete observable project state, layout configuration, source code, database schema, and asset manifest. Read the entire file, create or attach a web project, restore the files and assets, run the migrations, and reconstruct the application exactly as described."**')
add('2. Attach or paste this Markdown file to that session, then restore it into a managed web project with server and database enabled. Upload the binary assets at the exact paths in the asset manifest.')
add('3. In the new project directory, run `pnpm install`, set the managed database environment, run `pnpm db:migrate`, then run `pnpm check && pnpm test && pnpm build`. The teacher key defaults to `variationlab`; set `TEACHER_KEY` to replace it.')
add('')
add('> This bundle documents observable project behavior and source. It does not reproduce hidden system prompts, private platform instructions, private session logs, credentials, or secret values.')
add('')
add('## 1. Package identity and status')
add('')
add('- Application: Variation Lab Live')
add('- Purpose: anonymous, real-time collaborative Biology variation dashboard for Investigations 1–8.')
add('- Latest checkpoint: `b0142073a997c74d70cfdbe87a73c03804c80a9e`')
add('- Runtime: Node/Express server, Vite/React client, Drizzle ORM, managed MySQL database, Server-Sent Events live stream.')
add('- Validation at export: typecheck, tests, production build, database migration, asset checks, and preview verification passed.')
add('')
add('## 2. Observable functional specification')
add('')
add('### Anonymous entry portal')
add('')
for line in [
    'No names, login, student IDs, codes, or arbitrary identifying metadata are accepted.',
    'Students may submit any subset of investigations in one anonymous submission.',
    'A consent checkbox is required before submission and resets after success. Participation is optional.',
    'Investigation 1: Body mass, kg, 20–300.',
    'Investigation 2: Height, cm, 80–230.',
    'Investigation 3: Hand span, cm, 5–35.',
    'Investigation 4: Tongue rolling, Can/Cannot.',
    'Investigation 5: Eye colour, Brown/Blue/Green/Hazel.',
    'Investigation 6: Simulated blood group, A/B/AB/O.',
    'Investigation 7: Leaf length, dynamic add-row grid, 0.5–60 cm, up to 40 rows.',
    'Investigation 8: Seed mass, dynamic add-row grid, 0.001–10 g, up to 40 rows.',
]: add('- ' + line)
add('')
add('### Live dashboard')
add('')
for line in [
    'The shared display receives Server-Sent Events at `/api/class-data/stream` and polls every five seconds as a fallback.',
    'Total sample size N counts anonymous submission rows.',
    'Investigations appear in strict chronological order 1–8.',
    'Measurement cards use touching-bar histograms with adaptive bins. Category cards use separated bar charts. Student-facing labels are neutral and do not teach the classification answer.',
]: add('- ' + line)
add('')
add('### Teacher utilities')
add('')
for line in ['Teacher controls are hidden behind a teacher key.', 'CSV export: `GET /api/export.csv?key=...`.', 'Database clear: `DELETE /api/class-data` with `{ "key": "..." }`, plus client confirmation.', 'Default teacher key is `variationlab`; production should set `TEACHER_KEY`.']: add('- ' + line)
add('')
add('### Visual treatment')
add('')
for line in ['The left entry rail is text-only.', 'Header uses the PDF-derived collage with the two pictures composited edge-to-edge and no worksheet Name/Date lines.', 'The title is restyled independently as “Continuous and Discontinuous Variation” with Space Grotesk plus italic Georgia accents.', 'Each chart card has a large image crop from the attached PDF beside its investigation.', 'The complete source PDF is not embedded as a lesson gallery.', 'Large-print classroom styling is enabled, with essential controls and chart titles at approximately 26px or larger.']: add('- ' + line)
add('')
add('## 3. Data model and API')
add('')
add('`class_submissions` stores one anonymous row per submission: `id`, `bodyMass`, `height`, `handSpan`, `tongueRolling`, `eyeColour`, `bloodGroup`, `leafLengths` JSON text, `seedMass` legacy decimal, `seedMasses` JSON text, and `submittedAt`.')
add('')
add('Routes: `GET /api/health`, `GET /api/class-data`, `GET /api/class-data/stream`, `POST /api/class-data`, `GET /api/export.csv?key=TEACHER_KEY`, and `DELETE /api/class-data`.')
add('')
add('### POST payload example')
add('')
add('```json')
add('{')
add('  "bodyMass": "64.2",')
add('  "height": "171",')
add('  "handSpan": "19.4",')
add('  "tongueRolling": "can",')
add('  "eyeColour": "hazel",')
add('  "bloodGroup": "O",')
add('  "leafLengths": [4.2, 5.1, 6.0],')
add('  "seedMasses": [0.842, 0.913]')
add('}')
add('```')
add('')
add('## 4. Binary asset manifest')
add('')
add('Restore each binary file at the exact path below and verify its SHA-256 hash.')
add('')
add('| Path | Bytes | SHA-256 |')
add('|---|---:|---|')
for path, size, sha in assets: add(f'| `{path}` | {size} | `{sha}` |')
add('')
add('Asset semantics: `header-collage.png` is the gapless header; investigation-1 is Adult Height; investigation-2 is ABO blood group; investigation-4 is Hand Span; investigation-5 is Tongue Rolling; investigation-6 is Body Mass; investigation-7 is Leaf Length; investigation-8 is Seed Mass; investigation-9 is Eye Colour. Investigation-3 remains part of the PDF-derived visual asset set.')
add('')
add('## 5. Complete project file contents')
add('')
add('The following sections contain the complete UTF-8 text source files needed to rebuild the observable project. Standard generated UI components are included because they are part of the project tree.')
for p in files:
    rel = p.relative_to(ROOT).as_posix()
    content = p.read_text(encoding='utf-8')
    f = fence(content)
    add('')
    add(f'### `{rel}`')
    add('')
    add(f + language(p))
    parts.append(content)
    if not content.endswith('\n'): parts.append('\n')
    add(f)
add('')
add('## 6. Rehydration commands')
add('')
add('```bash')
add('pnpm install')
add('pnpm db:migrate')
add('pnpm check')
add('pnpm test')
add('pnpm build')
add('pnpm dev')
add('```')
add('')
add('Provide the managed `DATABASE_URL`, `PORT`, and optional `TEACHER_KEY` through the receiving platform environment or secret mechanism. Do not hard-code credentials into source or this bundle.')
add('')
add('## 7. Known non-portable items')
add('')
for line in ['Hidden system/developer prompts and internal policy text are not included.', 'Private Manus session logs, browser replay logs, environment credentials, and managed project identity are not included.', '`node_modules`, `dist`, `.git`, and transient caches are intentionally excluded; regenerate them with the commands above.', 'The original uploaded PDF should be retained separately if the receiving account needs to regenerate image crops; the current cropped PNG assets are listed above.']: add('- ' + line)
OUT.write_text(''.join(parts), encoding='utf-8')
print(f'created {OUT} with {len(files)} text files and {len(assets)} assets; {OUT.stat().st_size} bytes')
