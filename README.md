# Logwise

A personal, single-file study planner and productivity app — tasks, projects,
habits, journal, syllabus tracking, mock exam logging, and progress insights —
with free automatic sync between desktop and mobile.

Built as one self-contained `index.html` (HTML + CSS + JavaScript, no build
step, no framework). Data is stored locally in the browser (IndexedDB) and
optionally synced across devices via Firebase.

---

## Features

### Task management
- Inbox, Today, Upcoming (7-day), and per-project/label/area/area views
- Quick-add with natural shortcuts, subtasks, priorities, due dates
- Recurring tasks (daily / weekly / monthly / specific weekdays)
- **Spaced-repetition mode** for tasks — after completion, a task reschedules
  itself further out each time (1 → 3 → 7 → 16 → 35 days), useful for study
  review cycles
- Built-in **Pomodoro timer** on the task detail panel
- Drag-and-drop reordering of tasks and projects
- Nested (sub-)projects, color-coded labels, and areas of life
- "Plan tomorrow" modal and reusable task templates
- Undo toast (not a confirm popup) when deleting tasks, habits, projects,
  labels, or areas — deletions are instantly reversible for a few seconds
- Command palette (Cmd/Ctrl+K), keyboard shortcuts (`q` quick add, `/` search,
  `j`/`k` navigation, and more)

### Habits
- "Build" habits (e.g. study daily) and "avoid" habits (e.g. no phone after
  10pm), each with streak tracking and a color-coded log

### Journal
- Freeform daily journal entries, one per date

### Syllabus tracker
- Subjects broken into modules with completion checkboxes and an overall
  completion percentage

### Study Log (mock exams)
- Log practice test / mock exam scores by topic and date, filterable, with
  a running history

### Insights (dashboard)
- All-time tasks completed and total study time
- Current study streak
- Overall syllabus completion %
- 30-day study-time bar chart
- All habit streaks in one place
- Recent mock exam score history

### Home dashboard
- This-week stats, weekly study-time bar chart, top priorities

### Sync & accounts
- Email/password sign-in (Firebase Authentication)
- Real-time sync across devices (Firebase Firestore) — last-write-wins,
  suited to using one device at a time
- Data is private: Firestore security rules restrict each account's document
  to that account only
- Local-first: every change saves to IndexedDB immediately and instantly
  re-renders; cloud sync happens in the background and never blocks the UI
- "Signed in as…" and "Synced at [time]" status shown in the sidebar
- Password reset flow ("Forgot password?")
- Offline banner when the connection drops, with automatic re-sync on
  reconnect

### Backup
- Manual JSON export/import
- Optional "connect a backup file" using the File System Access API, which
  keeps a local file updated automatically

### Installable app (PWA)
- `manifest.json` + app icons so it can be "Added to Home Screen" on mobile
  or installed as a desktop app, with its own icon and no browser chrome
- `service-worker.js` caches the app shell so it can still open with no
  internet connection at all (network-first for the page so you always get
  the latest version when online, cached fallback when offline)

### Mobile-responsive design
- Sidebar becomes a slide-in drawer with a tap-to-close backdrop below
  760px width; automatically closes after any navigation action
- Larger touch targets and font sizes on phone-width screens
- All form inputs sized at 16px on mobile to prevent iOS Safari's
  auto-zoom-on-focus behavior

### Appearance
- Light/dark mode
- Selectable accent color theme

---

## Code structure

Everything lives in `index.html`. It's organized as one big IIFE
(`(function(){ ... })()`) with clearly commented sections, roughly in this
order:

| Section | What it does |
|---|---|
| `<head>` styles | All CSS, including responsive `@media` breakpoints for mobile/print |
| Auth overlay markup | Sign-in/sign-up screen shown before the app is visible |
| `CONSTANTS` | Spaced-repetition intervals, Pomodoro durations, etc. |
| `THEME SYSTEM` | Light/dark mode and accent color handling |
| `INDEXEDDB STORAGE LAYER` | Local persistence: `loadState()`, `save()`, migrations |
| `BASIC GETTERS` | Lookup helpers (`getProject`, `getLabel`, `getArea`, etc.) |
| `STREAKS` | Habit streak and study streak calculations |
| `TASK SET RESOLUTION PER VIEW` | Figures out which tasks belong to each view (Inbox, Today, project, etc.) |
| `QUICK ADD` | Fast task-entry parsing |
| `TASK CRUD` | Create/update/delete/complete tasks, including SRS rescheduling |
| `PROJECT / LABEL / AREA CRUD` | Create/delete projects, labels, areas — deletes now return a snapshot for undo |
| `PLAN TOMORROW MODAL` / `TASK TEMPLATES` | Planning helper modals |
| `TASK ROW RENDERING` | HTML generation for individual task rows |
| `HOME / DASHBOARD VIEW`, `HABITS VIEW`, `JOURNAL VIEW`, `STUDY LOG (MOCK EXAM) VIEW`, Syllabus view, Insights view | Per-view render functions (`renderXHtml()`) |
| `TASK DETAIL PANEL` | Side panel with Pomodoro timer, SRS status, notes, subtasks |
| `NOTIFICATIONS / REMINDERS` | Browser notification scheduling |
| `EVENT WIRING` | Two flavors: `wireStaticEvents()` (bound once on load) and `wireDynamicEvents()` (re-bound after every render, since rows are regenerated each time) |
| `CONFETTI` | Small celebration animation on completions |
| `SNACKBAR / UNDO` | `showSnackbar(message, undoLabel, undoFn)` — the shared toast used by every undoable delete |
| `KEYBOARD SHORTCUTS` | Global `keydown` handler (command palette, quick add, search, navigation) |
| `FOCUS MODE` | Distraction-free single-task view |
| `MASTER RENDER` | `renderAll()` — re-renders every part of the UI from current state; `switchViewWithFade()` adds the view-transition animation |
| `INIT` | `initApp()` — first load: wire events, load state, render |
| **Firebase Cloud Sync** (near the bottom) | `firebaseConfig`, `startCloudSync()`/`stopCloudSync()`, `scheduleCloudSync()`, sign-in/sign-up/reset handlers, `auth.onAuthStateChanged()` which drives the whole app's startup sequence |
| Service worker registration | Registers `service-worker.js` for offline app-shell caching |

### Data model (stored as one JSON object, in IndexedDB and Firestore)

```
state = {
  tasks: [...],
  projects: [...],
  labels: [...],
  areas: [...],
  habits: [...],
  journal: { "2026-07-22": "...", ... },
  syllabus: [...],
  mockExams: [...],
  studyLog: { "2026-07-22": <seconds studied>, ... },
  ui: { view: "inbox", selectedProjectId: null, ... },
  ...
}
```

### How sync works
1. Every change updates `state` in memory and re-renders immediately.
2. `save()` writes `state` to IndexedDB right away (so nothing is lost even
   offline), then debounces a write to Firestore a moment later.
3. A Firestore real-time listener (`onSnapshot`) picks up changes made on
   *other* signed-in devices and re-renders locally when they arrive.
4. Security rules (`firestore.rules`) ensure only the signed-in owner can
   read or write their own document.

### Other project files
- `manifest.json` — PWA metadata (name, icons, theme color)
- `service-worker.js` — offline app-shell caching
- `icon-192.png`, `icon-512.png`, `favicon-32.png` — app icons
- `firestore.rules` — Firestore security rules (paste into Firebase console)

---

## Tech stack

- Vanilla HTML/CSS/JavaScript — no build tools, no frameworks
- IndexedDB for local storage
- Firebase Authentication (email/password) and Firestore (free "Spark" tier)
  for cross-device sync
- Service Worker + Web App Manifest for installability and offline use
- Hosted for free on GitHub Pages
