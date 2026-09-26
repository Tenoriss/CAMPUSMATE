# CAMPUSMATE

**Semua urusan kuliah, satu tempat.** A personal academic companion for students at Indonesian universities, built with Next.js, TypeScript, Tailwind CSS and Framer Motion. The interface uses a minimal dark canvas, soft blue-violet glow and subtle outlined surfaces across the public site and the signed-in workspace, with light/dark/system preferences available in Settings.

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
- `lib/store.ts`, `lib/documents.ts`, `lib/logic.ts`, `lib/types.ts` — persistence/auth, local document extraction, calculations and models.
- `public/ocr/` — bundled, on-demand OCR assets; these only load when an image is uploaded.
- `public/pets/` — nine original, locally hosted animated GIF companions plus matching static PNG posters for reduced-motion users. Regenerate them with `scripts/create-pet-gifs.py` (requires Pillow).
