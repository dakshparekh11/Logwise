# Memora

A personal spaced-repetition (SRS) web app for CFA exam study.
Single-file PWA with Firebase sync, IndexedDB offline storage,
SM-2 algorithm, and a backup system identical to Logwise.

Hosted for free on **GitHub Pages** — no server needed.

---

## Feature List

| Feature | Detail |
|---|---|
| **SM-2 Spaced Repetition** | Again / Hard / Good / Easy ratings with optimal scheduling |
| **3 Card Types** | Q&A · Cloze (fill-in-blank) · Formula (KaTeX rendered) |
| **KaTeX Math** | `$inline$` and `$$display$$` LaTeX in any card |
| **Chapter Field** | Tag each card with a chapter name for fine-grained organisation |
| **Cram Mode** | Review any topic or level outside the SRS schedule |
| **Weak Cards Mode** | Surfaces cards with 2+ lapses for targeted drilling |
| **Undo Last Rating** | One-tap undo after an accidental rating |
| **Hint + Notes** | Hint shown before flip · Notes/Mnemonic shown after flip |
| **Star / Bookmark** | Flag cards for manual review |
| **Keyboard Shortcuts** | `Space` flip · `1234` rate · `Z` undo · `Esc` close |
| **Daily Limits** | Configurable new-cards/day and review-cards/day caps |
| **CFA Topic Tree** | Full L1 / L2 / L3 pre-loaded with official exam weights |
| **Image Support** | Attach yield curves, payoff diagrams, option graphs |
| **Dashboard** | Due count · New cards · Streak 🔥 · 18-week heatmap · Topic bars |
| **Progress View** | Retention by topic · Avg retention · Study time · Session history |
| **Delete Session** | Remove any mistakenly logged session from Recent Sessions |
| **Push Notifications** | Daily study reminder at your chosen time |
| **CSV Bulk Import** | Add hundreds of cards from a spreadsheet in one shot |
| **Firebase Sync** | Real-time cross-device sync via Firestore |
| **PWA** | Installable on iOS / Android / Desktop · Works fully offline |
| **Backup System** | Export JSON · Import JSON · Connect file (auto-saves) |
| **6 Colour Themes** | Deep Focus · Botanical Zen · Sunrise · Vintage · Dreamscape · Night Owl |
| **Dark Mode** | Full dark mode across all themes |
| **API Key Security** | Firebase keys in gitignored `config.js` · Never in GitHub |

---

## Project Files

```
memora/
├── index.html              ← Entire app (HTML + CSS + JS)
├── config.js               ← YOUR Firebase keys (gitignored — never committed)
├── config.example.js       ← Safe placeholder template committed to git
├── manifest.json           ← PWA manifest
├── service-worker.js       ← Offline caching + push notification handler
├── firestore.rules         ← Firestore security rules (applied via Firebase Console)
├── .gitignore              ← Ensures config.js is never committed
├── .github/
│   └── workflows/
│       └── deploy.yml      ← Auto-deploys to GitHub Pages on every push to main
├── icon-192.png            ← PWA icon you create (192×192 px)
├── icon-512.png            ← PWA icon you create (512×512 px)
└── favicon-32.png          ← Browser tab icon you create (32×32 px)
```

Your live app URL will be:
```
https://YOUR-GITHUB-USERNAME.github.io/memora/
```

---

## Complete Setup Guide

Everything below is done by clicking in a web browser.
No terminal, no command line, no installation required.

---

### PART A — Firebase Setup
### (Database + Authentication for your cards to sync across devices)

---

#### Step 1 — Create a Firebase Project

1. Open **[console.firebase.google.com](https://console.firebase.google.com)**
   and sign in with your Google account.

2. Click the **"Add project"** card.

3. Type a project name — for example **`memora-study`** — then click
   **Continue**.

4. On the Google Analytics screen, click the toggle to turn it **Off**
   (not needed), then click **Create project**.

5. Wait about 20–30 seconds. When the spinner stops, click **Continue**.

---

#### Step 2 — Enable Email / Password Sign-In

1. In the left sidebar, click **Build → Authentication**.

2. Click the **Get started** button in the middle of the page.

3. Under the **Sign-in method** tab, find **Email/Password** and click it.

4. Click the first toggle to turn it **Enabled** (turns blue).

5. Leave "Email link (passwordless)" disabled.

6. Click **Save**.

   ✓ You should now see Email/Password listed as an enabled provider.

---

#### Step 3 — Create the Firestore Database

1. In the left sidebar, click **Build → Firestore Database**.

2. Click **Create database**.

3. On the rules screen, select **Start in production mode** and click **Next**.

4. Choose the region closest to you:
   - India → **asia-south1 (Mumbai)**
   - Europe → **europe-west3** or **europe-west2**
   - US → **us-central1**

5. Click **Enable** and wait about 30 seconds for it to provision.

**Now paste the security rules:**

6. Click the **Rules** tab at the top of the Firestore Database page.

7. Select all the existing text in the rules editor and delete it.

8. Open the `firestore.rules` file from your Memora folder using any text
   editor (Notepad on Windows, TextEdit on Mac, etc.).

9. Select all the text in that file, copy it (Ctrl+C or Cmd+C), and
   paste it into the Firebase rules editor.

10. Click **Publish**.

    ✓ You should see a green confirmation banner appear.

---

#### Step 4 — Register a Web App and Copy Your Config Keys

1. Click the **gear icon ⚙️** next to "Project Overview" in the top-left.

2. Click **Project settings**.

3. Scroll down to the **"Your apps"** section at the bottom of the page.

4. Click the **Web icon `</>`** (looks like angle brackets).

5. In the **"App nickname"** field, type **`Memora`**.

6. Leave "Also set up Firebase Hosting" **unticked** — we are using
   GitHub Pages instead.

7. Click **Register app**.

8. Firebase will show you a config block like this:

   ```js
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "memora-study.firebaseapp.com",
     projectId: "memora-study",
     storageBucket: "memora-study.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdefabcdef"
   };
   ```

9. **Leave this tab open** — you need these six values in the next two steps.

10. Click **Continue to console**.

---

#### Step 5 — Fill In Your config.js

1. Open your **Memora project folder** on your computer.

2. Find **`config.example.js`** and make a copy of it in the same folder.

3. Rename the copy to **`config.js`** (remove `example.` from the name).

4. Open `config.js` with any text editor.

5. Replace each placeholder with your real Firebase values from Step 4:

   ```js
   window.MEMORA_CONFIG = {
     apiKey:            "AIzaSyXXXXXXXXXXXXXXXXX",    // ← your real apiKey
     authDomain:        "memora-study.firebaseapp.com", // ← your authDomain
     projectId:         "memora-study",                 // ← your projectId
     storageBucket:     "memora-study.appspot.com",     // ← your storageBucket
     messagingSenderId: "123456789012",                 // ← your messagingSenderId
     appId:             "1:123456789012:web:abcdef"     // ← your appId
   };
   ```

6. Save the file.

   > `config.js` is listed in `.gitignore`. It will **never** be uploaded
   > to GitHub. Your real Firebase keys stay on your computer only.

---

### PART B — Create Your PWA Icons

---

#### Step 6 — Generate the App Icons

Memora needs three image files in the project folder.

1. Open **[favicon.io/favicon-generator](https://favicon.io/favicon-generator/)**.

2. Click the **Text** tab.

3. Fill in the settings:
   - **Text:** M
   - **Background:** Rounded
   - **Background colour:** `#2563EB` (Memora blue)
   - **Font colour:** `#FFFFFF` (white)
   - **Font family:** Inter (or any clean sans-serif)
   - **Font size:** 50

4. Click **Download**.

5. Open (unzip) the downloaded file.

6. Inside the zip you will find several images. Rename three of them
   and copy them into your Memora project folder:

   | File in the zip | Rename it to | Size |
   |---|---|---|
   | `android-chrome-192x192.png` | `icon-192.png` | 192 × 192 px |
   | `android-chrome-512x512.png` | `icon-512.png` | 512 × 512 px |
   | `favicon-32x32.png` | `favicon-32.png` | 32 × 32 px |

   Make sure all three renamed files are in the same folder as `index.html`.

---

### PART C — GitHub Setup
### (Hosts the app for free and auto-deploys when you make changes)

---

#### Step 7 — Create a GitHub Account

*Skip this step if you already have a GitHub account.*

1. Go to **[github.com](https://github.com)** and click **Sign up**.

2. Enter your email address, create a password, and choose a username.

3. Verify your email address when GitHub sends you a confirmation email.

4. Sign in to GitHub.

---

#### Step 8 — Create a New Repository

1. Once signed in to GitHub, click the **"+"** icon in the top-right corner
   of the page.

2. Click **New repository**.

3. Fill in the details:
   - **Repository name:** `memora`
     *(this becomes part of your app URL:*
     `https://your-username.github.io/memora/`*)*
   - **Visibility:** Public
     *(GitHub Pages requires a Public repo on the free plan)*
   - Leave all three checkboxes — "Add a README", "Add .gitignore",
     "Choose a licence" — all **unticked**. We will upload existing files.

4. Click **Create repository**.

5. GitHub shows an empty repository page. Keep this tab open.

---

#### Step 9 — Upload Your Project Files

1. On your new empty repository page, look for the sentence that contains
   **"uploading an existing file"** and click those words (they are a link).

2. A drag-and-drop upload page opens.

3. Open your Memora project folder on your computer.

4. Select and drag the following files into the GitHub upload area:

   | File | Include? |
   |---|---|
   | `index.html` | ✅ Yes |
   | `config.example.js` | ✅ Yes — the example file only |
   | `manifest.json` | ✅ Yes |
   | `service-worker.js` | ✅ Yes |
   | `firestore.rules` | ✅ Yes |
   | `README.md` | ✅ Yes |
   | `icon-192.png` | ✅ Yes |
   | `icon-512.png` | ✅ Yes |
   | `favicon-32.png` | ✅ Yes |
   | `config.js` | ❌ NO — never upload this |

   > **For hidden files and nested folders** (`.gitignore` and
   > `.github/workflows/deploy.yml`): if drag-and-drop does not pick
   > them up, use the **"choose your files"** link to browse and select
   > each one individually. Alternatively, install
   > **[GitHub Desktop](https://desktop.github.com/)** (free, no terminal)
   > which handles all file types automatically.

5. Scroll to the bottom of the upload page.

6. In the **"Commit changes"** section, type a message such as:
   `Initial commit — Memora v1.1.0`

7. Make sure **"Commit directly to the main branch"** is selected.

8. Click **Commit changes**.

9. After the upload finishes, check the file list in your repository.
   Confirm `config.js` does **not** appear there. ✓

---

#### Step 10 — Enable GitHub Pages

1. In your repository, click the **Settings** tab
   (top of the repository page).

2. In the left sidebar, scroll down and click **Pages**.

3. Under **"Build and deployment"**, find the **Source** dropdown.

4. Click the dropdown and select **"GitHub Actions"**.

   > This tells GitHub to use your deploy workflow (the
   > `.github/workflows/deploy.yml` file) to build and publish the site
   > automatically, rather than serving files directly from the branch.

5. Click **Save** if a Save button appears (some versions save automatically).

   ✓ GitHub Pages is now configured to deploy via Actions.

---

#### Step 11 — Add Your Firebase Keys as GitHub Secrets

The deploy workflow builds `config.js` automatically from encrypted
GitHub Secrets — so your real Firebase keys are never written into
the repository code.

1. In your repository, click **Settings → Secrets and variables → Actions**.

2. Click **New repository secret**.

   Add the following secrets **one at a time** — for each, click
   "New repository secret", enter the name and value exactly as shown,
   then click **Add secret** before starting the next one.

   | Secret name | Value |
   |---|---|
   | `FIREBASE_API_KEY` | Your `apiKey` value from Step 4 |
   | `FIREBASE_AUTH_DOMAIN` | Your `authDomain` value from Step 4 |
   | `FIREBASE_PROJECT_ID` | Your `projectId` value from Step 4 |
   | `FIREBASE_STORAGE_BUCKET` | Your `storageBucket` value from Step 4 |
   | `FIREBASE_MESSAGING_SENDER_ID` | Your `messagingSenderId` value from Step 4 |
   | `FIREBASE_APP_ID` | Your `appId` value from Step 4 |

3. After adding all 6 secrets, the Secrets page should list them all. ✓

---

#### Step 12 — Trigger the First Deploy

1. In your repository, click the **Actions** tab.

2. In the left sidebar, click the workflow named
   **"Deploy Memora to GitHub Pages"**.

3. On the right side of the page, click the **"Run workflow"** button.

4. In the small dropdown that appears, click the green
   **"Run workflow"** button.

5. A new workflow run appears in the list. Click on it to watch the steps.

6. Wait about 60–90 seconds. When all steps show a green tick ✓,
   your app has been deployed. ✓

---

#### Step 13 — Find Your Live App URL

1. In your repository, click **Settings → Pages**.

2. At the top of the page you will see a box with the text
   **"Your site is live at"** followed by your URL.

3. The URL looks like:
   ```
   https://your-github-username.github.io/memora/
   ```

4. Click **Visit site** (or click the URL) to open your app. ✓

   You should see the Memora sign-in screen. Create your account,
   sign in, and start adding cards.

---

#### Step 14 — Install Memora on Your Phone (PWA)

**iPhone / iPad — Safari only:**

1. Open **Safari** (not Chrome) and go to your GitHub Pages URL.

2. Tap the **Share button** — the box with an arrow pointing up,
   at the bottom of the screen.

3. Scroll down in the share sheet and tap **"Add to Home Screen"**.

4. Edit the name if you wish, then tap **Add** in the top-right corner.

5. Memora now appears on your home screen and opens full-screen like
   a native app. ✓

**Android — Chrome:**

1. Open **Chrome** and go to your GitHub Pages URL.

2. Tap the **three-dot menu ⋮** in the top-right corner.

3. Tap **"Add to Home screen"**.

4. Tap **Add** to confirm.

5. Memora appears on your home screen. ✓

---

### How to Update the App Later

Any time you want to change something in Memora — every update you make
goes live automatically within about 60 seconds of saving on GitHub.

**Method 1 — Edit directly on GitHub (easiest):**

1. Go to your `memora` repository on GitHub.
2. Click the file you want to edit (e.g. `index.html`).
3. Click the **pencil icon ✏️** ("Edit this file") in the top-right
   of the file preview.
4. Make your changes in the editor.
5. Scroll to the bottom, type a short description of what you changed.
6. Click **Commit changes**.
7. GitHub Actions will automatically redeploy. ✓

**Method 2 — Upload a new version of the file:**

1. Go to your `memora` repository on GitHub.
2. Click **Add file → Upload files**.
3. Drag in your updated file (e.g. a new `index.html`).
4. Click **Commit changes**.
5. GitHub Actions redeploys automatically. ✓

---

## API Key Security — Why This Is Safe

Firebase API keys are not secret in the same way passwords are.
They identify your Firebase project, not your account. What protects
your data is:

1. **Firebase Authentication** — a user must be signed in with a
   valid email/password to do anything at all.

2. **Firestore Security Rules** — the rules in `firestore.rules`
   ensure each signed-in user can only read and write their own
   document. No one else can touch your data, even if they have your
   API key.

3. **`config.js` is gitignored** — your keys are never in git history.
   This resolves GitHub's secret scanning warning completely.
   The GitHub Actions workflow injects the keys from encrypted Secrets
   at deploy time — they are never written into the code repository.

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Flip card (reveal answer) |
| `1` | Rate: Again |
| `2` | Rate: Hard |
| `3` | Rate: Good |
| `4` | Rate: Easy |
| `Z` | Undo last rating |
| `Esc` | Exit review / close modal |

---

## CSV Import Format

Create a spreadsheet in Excel or Google Sheets and export as `.csv`.
Import via **Settings → Import CSV** inside the app.

**First row must be these exact column headers:**
```
type, question, answer, hint, notes, chapter, level, topic_id
```

| type | question | answer | chapter | level | topic_id |
|---|---|---|---|---|---|
| qa | What is the Sharpe Ratio? | Excess return per unit of total risk | Ch12 — Portfolio Performance | L1 | l1_pm |
| formula | `$$S = \frac{R_p - R_f}{\sigma_p}$$` | Sharpe Ratio formula | Ch12 — Portfolio Performance | L1 | l1_pm |
| cloze | The `{{c1::Sharpe}}` Ratio uses `{{c2::total}}` risk | | Ch12 — Portfolio Performance | L1 | l1_pm |

**`type`** — `qa` · `cloze` · `formula`

**`level`** — `L1` · `L2` · `L3`

**Topic IDs:**

| Level I | Level II | Level III |
|---|---|---|
| `l1_eth` Ethics | `l2_eth` Ethics | `l3_eth` Ethics |
| `l1_qm` Quant Methods | `l2_qm` Quant Methods | `l3_beh` Behavioral Finance |
| `l1_eco` Economics | `l2_eco` Economics | `l3_cme` Capital Mkt Expectations |
| `l1_fra` Financial Statement Analysis | `l2_fra` FSA | `l3_aa` Asset Allocation |
| `l1_corp` Corporate Issuers | `l2_corp` Corporate Issuers | `l3_der` Derivatives & Risk Mgmt |
| `l1_eq` Equity Investments | `l2_eq` Equity | `l3_fi` Fixed Income |
| `l1_fi` Fixed Income | `l2_fi` Fixed Income | `l3_eq` Equity |
| `l1_der` Derivatives | `l2_der` Derivatives | `l3_alt` Alternatives |
| `l1_alt` Alternatives | `l2_alt` Alternatives | `l3_pw` Private Wealth |
| `l1_pm` Portfolio Management | `l2_pm` Portfolio Mgmt | `l3_inst` Institutional |
| | | `l3_trd` Trading & Rebalancing |

---

## KaTeX Formula Syntax

| You type | What renders |
|---|---|
| `$r_f$` | Inline — risk-free rate |
| `$$r = r_f + \beta(r_m - r_f)$$` | Display block — CAPM |
| `$\frac{Cov(R_i,R_m)}{\sigma_m^2}$` | Beta formula |
| `$\text{Modified Duration} \approx -\frac{\Delta P/P}{\Delta y}$` | Modified duration |
| `$\sigma_p = \sqrt{w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\rho\sigma_1\sigma_2}$` | Portfolio std dev |

---

## Backup System

**Export JSON** — Downloads everything (cards, sessions, settings,
images). Save to Google Drive or iCloud as a regular backup.

**Import JSON** — Restores from any Memora export. Asks for
confirmation before replacing your current data.

**Connect backup file** — Chrome and Edge on HTTPS only. Links a
`.json` file on your disk and auto-updates it within 1.5 seconds of
every change. Shows 🟢 in the sidebar when connected.

> **About images:** Card images are stored in your browser's IndexedDB
> and included in JSON exports. They are not synced to Firestore (to
> stay under the 1 MB document limit). To move images to another
> device, Export on one device and Import on the other.

---

## Troubleshooting

**"Firebase config missing" screen instead of login**
→ `config.js` is missing or still has placeholder values. Copy
`config.example.js` → rename the copy to `config.js` → fill in your
real Firebase keys from Firebase Console → Project Settings → Your apps.

**Login error: "auth/configuration-not-found"**
→ Email/Password sign-in is not enabled. Firebase Console →
Authentication → Sign-in method → Email/Password → Enable → Save.

**Login works but data does not save**
→ Firestore rules not published. Firebase Console → Firestore
Database → Rules → paste contents of `firestore.rules` → Publish.

**GitHub Actions fails with a red ✗**
→ Click the failed run, read the error message. Usually one of the
6 secrets is missing or named incorrectly. Go to Settings → Secrets
and variables → Actions and verify all 6 are present.

**Settings → Pages shows "GitHub Actions" but no URL yet**
→ The first deploy has not run yet. Go to Actions tab → run the
workflow manually → wait 60 seconds → check Pages again.

**App works on laptop but images are missing on phone**
→ Images live in each device's local IndexedDB. Export on laptop →
Import on phone to transfer them.

**PWA install does not appear on iPhone**
→ Must use Safari. Chrome on iOS does not support PWA installation.
Open in Safari → Share → Add to Home Screen.

**Notifications do not appear**
→ Notifications require HTTPS. GitHub Pages provides HTTPS
automatically, so this should work on your live URL. It will not
work if you open `index.html` directly from your computer.
