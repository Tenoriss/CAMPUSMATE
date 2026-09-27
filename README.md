# CAMPUSMATE

**Semua urusan kuliah, satu tempat.** A personal academic companion for students at Indonesian universities, built with Next.js, TypeScript, Tailwind CSS and Framer Motion. The interface is drawn in a soft **claymorphism** style — pastel clay surfaces, chunky rounded geometry, an inner top highlight under a soft drop shadow, and controls that squish instead of lifting — and it follows **light, dark or system** theming across the public site, the auth screens, onboarding and the signed-in workspace.

## Design and theming

- `app/clay.css` is loaded last and owns the final look: clay tokens (`--clay-*`), semantic tints (`--tint-*`) and the surface/control rules for both themes. `app/globals.css` holds structure and `app/writemate.css` the earlier direction; clay wins the cascade by source order.
- Theme preference is `light | dark | system`. It lives in the account settings **and** in `localStorage` (`campusmate.theme`, `lib/theme.ts`) so the landing, login, signup and onboarding pages honour it before an account exists. An inline boot script in `app/layout.tsx` applies it before the first paint, so there is no light-to-dark flash.
- Toggle it from the topbar (cycles Terang → Gelap → Ikuti sistem), from the public pages via the header/auth/onboarding switch, or in **Pengaturan → Tampilan**. Choosing a theme in Settings also stores it for signed-out visits; signing in re-applies the account preference.
- Every tint has a dark counterpart, so nothing stays a light chip on a dark canvas. `color-scheme` is set per theme for native controls and scrollbars.

## List layout

Lists (tasks, deadlines, today's classes, schedule, agenda, notifications, project tasks, KRS/KHS previews) use clay rows: no hairline separators, rounded hover blocks and consistent gaps. Text containers are constrained (`min-width: 0` plus `overflow-wrap`/ellipsis) so a long title, attachment name or member chip can never push a row's actions out of the panel, and row actions never shrink.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Run `npm test`, `npm run lint`, or `npm run build` to validate the project.

## First-use experience

Accounts start with **no academic or productivity records**. Registration creates an ID, the name/nickname/email entered by the student, and empty collections. Onboarding asks for the student's actual campus details and chosen companion; the pet begins at 0 XP. Nothing is seeded. All records remain scoped to the signed-in account. Logging out does not erase saved records; Settings offers separate academic, productivity, pet-progress and all-data resets, each with confirmation.

## Document handling

- Text-based PDFs are parsed locally using PDF.js. JPG/PNG images are processed locally with a bundled Indonesian Tesseract.js model and WASM runtime (no remote OCR API or CDN). Image OCR accuracy can vary; scanned PDFs without a text layer require manual transcription from the document.
- Heuristic extraction **never saves automatically**. Review the detected rows, edit or remove mistakes, add missing rows and confirm. KRS confirmation previews the generated recurring schedule and flags overlapping times. KHS confirmation previews the SKS-weighted IPS calculation and updates cumulative IPK from the confirmed records. A semester is only marked complete when the student explicitly checks that all its grades have been entered; otherwise IPK is labeled provisional.
- Uploaded KRS/KHS source files are not stored or transmitted. Only reviewed, confirmed fields are saved in the browser.

## Local-first limitation

This initial version stores student data and salted PBKDF2 password verifiers in the browser's localStorage. It is a **single-browser prototype**, not a server-backed security boundary: data is not synced, devices cannot share accounts, clearing browser data loses the account, and password recovery is not available. Avoid using shared devices for sensitive academic information. Repository adapters in `lib/store.ts` separate persistence from UI so server authentication, authorization, encrypted storage and OCR services can replace the local implementation in a future deployment.

## Structure

- `components/Welcome.tsx` — landing, account forms and onboarding.
- `components/Work.tsx` — dashboard, courses, weekly schedule and tasks.
- `components/Plan.tsx` — team projects and calendar.
- `components/Academic.tsx` — KRS/KHS review, IPS/IPK and academic history.
- `components/Personal.tsx` — profile, notifications, pet, achievements and settings.
- `app/globals.css`, `app/writemate.css`, `app/clay.css` — structure, the earlier visual direction, and the claymorphism layer (loaded last).
- `lib/store.ts`, `lib/documents.ts`, `lib/logic.ts`, `lib/types.ts`, `lib/theme.ts` — persistence/auth, local document extraction, calculations, models and theme preference helpers.
- `public/ocr/` — bundled, on-demand OCR assets; these only load when an image is uploaded.
- `public/pets/` — nine original, locally hosted animated GIF companions (12 frames each) plus matching static PNG posters for reduced-motion users. Above-the-fold placements request the GIF eagerly; everything else stays lazy. Regenerate them with `scripts/create-pet-gifs.py` (requires Pillow).
- `tests/core.test.ts`, `tests/ui.test.tsx` — data/auth/academic logic, theme resolution and persistence, clay token coverage, GIF frame checks, and server-rendered component markup. Run with `npm test`.
