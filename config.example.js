// ================================================================
// LOGWISE — Firebase Configuration Template
// ================================================================
// SETUP INSTRUCTIONS:
//   1. Copy this file and rename the copy to:  config.js
//   2. Open config.js and replace every placeholder value below
//      with your real Firebase project credentials
//   3. config.js is listed in .gitignore — it will NEVER be
//      committed to GitHub, keeping your keys private
//
// WHERE TO FIND YOUR KEYS:
//   Firebase Console → Project Settings → Your apps → Web app
//   → SDK setup and configuration → Config
//
// IN PRODUCTION (GitHub Pages):
//   The deploy.yml GitHub Actions workflow generates config.js
//   automatically from encrypted GitHub Secrets at build time.
//   You never need to commit config.js — it only exists locally
//   and inside the GitHub Actions runner.
//
// ================================================================

window.LOGWISE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
