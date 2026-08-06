# Logwise

A personal all-in-one productivity web app — task manager, habit tracker, journal, syllabus tracker, study log, and insights dashboard — all in a single `index.html` file.

Built with vanilla JavaScript and Firebase. No frameworks, no build step, no dependencies to install.

---

## Features

**Task Management**
- Inbox, Today, Upcoming, and Completed views
- Projects, Labels, and Areas of responsibility
- Priority levels (P1–P4) with colour coding
- Due dates, reminders, and recurring tasks
- Subtasks and task notes
- Quick-add form with keyboard shortcut support
- Command palette (search across all tasks instantly)
- Focus mode with Pomodoro timer
- Task templates for repeated workflows
- Drag-to-reorder and filter/sort controls

**Habit Tracker**
- Build and Avoid habit types
- Daily check-in with streak tracking
- 12-week heatmap visualisation
- Habit frequency picker (daily, specific weekdays)
- SRS (spaced repetition) review integration

**Journal**
- Daily journal with date navigation
- Word count and writing streak
- Activity summary panel

**Syllabus Tracker**
- Subject → Module → Topic tree structure
- Per-topic completion checkbox
- Module start/end date fields
- Auto-calculated completion percentages at every level
- Overall syllabus progress bar

**Study Log**
- Mock exam and practice test score logging
- Per-topic average score with visual bar
- Full attempts history table

**Insights Dashboard**
- Weekly tasks completed bar chart
- Daily goal progress
- Habit completion summary
- Study score trends

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Vanilla JavaScript (no frameworks) |
| Styling | Plain CSS with CSS custom properties |
| Font | Inter via Google Fonts |
| Backend | Firebase Firestore (real-time sync) |
| Auth | Firebase Authentication (email/password) |
| Hosting | GitHub Pages (via GitHub Actions) |
| Version control | GitHub |

---

## Security Architecture

Firebase API keys are **never stored in source code**. Instead:

- `config.js` (which holds the real keys) is listed in `.gitignore` and never committed
- In production, the `deploy.yml` GitHub Actions workflow generates `config.js` at build time by injecting encrypted **GitHub Secrets**
- `config.example.js` is the safe, committed template with placeholder values — copy it to get started locally

```
Your Firebase keys → GitHub Secrets (encrypted)
                          ↓
                   deploy.yml (GitHub Actions)
                          ↓
                    config.js (generated at build time, never committed)
                          ↓
                   index.html reads window.LOGWISE_CONFIG
```

---

## Architecture

Everything lives in one file — `index.html` — which contains:

- All CSS (inside a `<style>` block)
- All HTML structure
- All JavaScript (inside `<script>` blocks)
- Firebase SDK loaded via CDN

This is intentional. The single-file architecture keeps deployment trivially simple (replace one file), works perfectly with GitHub Pages, and requires zero build tooling.

---

## Design System

The UI uses a red-accent design system built on CSS custom properties:

```css
--red: #db4c3f;         /* primary accent */
--red-dark: #c9382c;    /* hover state */
--red-rgb: 219,76,63;   /* for rgba() focus rings */
```

Dark mode is fully supported via `[data-theme="dark"]` on the root element.

### UI highlights
- **Inter** font throughout for crisp, modern rendering
- SVG icons in the sidebar navigation (no emoji)
- Active nav items have a 3px red left-border accent
- All inputs have a red `box-shadow` focus ring
- Modals enter with a spring `cubic-bezier(0.34,1.56,0.64,1)` animation
- Snackbar is a pill-shaped glassmorphism toast
- Dashboard cards lift on hover
- Checkboxes animate on completion (`checkPop` keyframe)
- Custom thin scrollbar (5px, pill-shaped thumb)

---

## Project Structure

```
logwise/
├── .github/
│   └── workflows/
│       └── deploy.yml       ← GitHub Actions: injects secrets → deploys to Pages
├── .gitignore               ← blocks config.js from ever being committed
├── config.example.js        ← safe template (committed); copy → config.js locally
├── config.js                ← GITIGNORED — real keys go here (local only)
├── favicon-32.png
├── firestore.rules
├── icon-192.png
├── icon-512.png
├── index.html               ← entire app (HTML + CSS + JS)
├── manifest.json
├── service-worker.js
└── README.md
```

---

## Getting Started (First-Time Setup)

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**
2. Give it a name (e.g. `logwise`) → Continue through the prompts

### 2. Enable Firestore

Firebase Console → **Build → Firestore Database → Create database** → Start in **production mode** → choose a region → Done

### 3. Enable Authentication

Firebase Console → **Build → Authentication → Get started → Email/Password → Enable → Save**

### 4. Get your Firebase config keys

Firebase Console → **Project Settings** (gear icon) → **Your apps** → if no app exists click **Add app → Web** → register it → copy the `firebaseConfig` object values

### 5. Add GitHub Secrets

In your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret** — add one secret for each key:

| Secret name | Value from Firebase config |
|---|---|
| `FIREBASE_API_KEY` | `apiKey` value |
| `FIREBASE_AUTH_DOMAIN` | `authDomain` value |
| `FIREBASE_PROJECT_ID` | `projectId` value |
| `FIREBASE_STORAGE_BUCKET` | `storageBucket` value |
| `FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` value |
| `FIREBASE_APP_ID` | `appId` value |

### 6. Enable GitHub Pages

GitHub repo → **Settings → Pages → Source: GitHub Actions** → Save

### 7. Upload all project files

Upload all files to the `main` branch. The GitHub Actions workflow will run automatically, generate `config.js` from your secrets, and deploy the site.

---

## Local Development

1. Copy `config.example.js` → rename the copy to `config.js`
2. Fill in your real Firebase values inside `config.js`
3. Open `index.html` directly in your browser — it works without a dev server

`config.js` is gitignored so your keys will never accidentally be pushed.

---

## Updating the App (No CLI)

1. Go to your GitHub repo → click `index.html` → click the **pencil icon** (Edit)
2. Select all (`Ctrl+A`), delete, paste the new file contents
3. Write a commit message → click **Commit changes**

GitHub Actions will automatically redeploy within 1–2 minutes.

**Hard-refresh after deploy:**
- Mac: `Cmd + Shift + R`
- Windows/Linux: `Ctrl + Shift + R`

---

## Firestore Security Rules

Paste these into **Firebase Console → Firestore → Rules → Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Firestore Data Structure

```
users/
  {uid}/
    tasks/         — all task documents
    projects/      — project list
    labels/        — label list
    areas/         — area of responsibility list
    habits/        — habit definitions
    habitLogs/     — daily habit check-in records
    journal/       — journal entries (keyed by date)
    syllabus/      — syllabus subject/module/topic tree
    studyLog/      — study log entries
    settings/      — user preferences (theme, goals, etc.)
```

All data is scoped under the authenticated user's UID. No data is shared between users.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Q` | Quick-add task |
| `Cmd/Ctrl + K` | Open command palette |
| `Escape` | Close modal / panel |

---

## Offline Support

Logwise works offline. Firestore's built-in offline persistence caches all data locally. Changes made offline are queued and automatically synced when the connection is restored.

---

## License

Personal project — not licensed for redistribution.
