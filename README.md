# NookScout — "Get Me a Seat Now" Prototype

A client‑side prototype of NookScout: find, hold, and verify quiet study seats and group rooms using synthetic data.

## Author
- Name: Miles Pines
- GitHub: mmfire118

## Links
- [Live demo](https://mmfire118-hw3.onrender.com/)
- [Team PRD](https://drive.google.com/file/d/1h-4HS4q5AYJX9spn3m37ZVjcWlUZm6Us/view?usp=sharing)

## Tech Stack
- Vite + React 18 + TypeScript
- TailwindCSS
- React Router
- Pure client‑side state with localStorage (no external APIs)

## Run Locally
Prerequisites: Node 18+ and npm

1) Install dependencies

```bash
npm install
```

2) Start dev server

```bash
npm run dev
```

Open the printed local URL (typically http://localhost:5173).

3) Build for production (optional)

```bash
npm run build
```

4) Preview the production build (optional)

```bash
npm run preview
```

## What’s Implemented
- End‑to‑end solo seat journey using synthetic data
- 10‑minute walk hold with one‑time +3m extension
- Arrival screen with QR simulation → 45m session timer
- Conflict resolution with alternatives + seat flagging (local)
- Session helpers (+15m once, power hint, checkout, auto‑release +3m grace)
- Group room stub (confirmation shows a toast)

## Routes
- `/` Home
- `/find` Filters + results (list/map)
- `/seat/:id` Seat details + start hold
- `/arrival/:holdId` Arrival, extend hold, QR scan, conflict resolution
- `/session/:sessionId` Active session, +15m, power hint, checkout
- `/room` Group room stub

## Notes
- All timers and ranking run in the browser.
- Data is synthetic; no network calls are made.
