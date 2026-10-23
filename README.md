# Yalla Toolkit & Independent Admin Portal

A modern, fast, and feature-rich **Tools & Websites Directory Platform** built with **Next.js 14**, **Tailwind CSS**, and **Firebase**.

As requested, the project is divided into two **completely independent** applications:
1. **`toolkit-app/`** - The public-facing toolkit website (Search, categories, filters, bookmarks, instant browser utilities, submission modal).
2. **`toolkit-admin/`** - Standalone admin dashboard (Tool management CRUD, pending submissions queue, category manager, live analytics, and site settings).

---

## 🚀 Quick Start (Local Development)

### 1. Run the Public Toolkit App (Port 3000)
```bash
cd toolkit-app
npm install
npm run dev
```
Open **http://localhost:3000** in your browser.

### 2. Run the Admin Panel (Port 3001)
In a separate terminal:
```bash
cd toolkit-admin
npm install
npm run dev
```
Open **http://localhost:3001** in your browser.

---

## 🔐 Admin Panel Credentials

You can log in to the Admin Panel using either:
1. **Master Passcode** (Default):
   - Passcode: `admin123` or `yalla2026`
2. **Firebase Auth** (Once configured in Firebase Console):
   - Email: `admin@yallatoolkit.com`

---

## ☁️ Deploying to Vercel

Both projects are pre-configured with `vercel.json` and optimized for zero-config deployment to Vercel.

### Deploying `toolkit-app`:
1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your repository.
4. Set **Root Directory** to `toolkit-app`.
5. Click **Deploy**. Your toolkit will be live at `https://your-toolkit.vercel.app`!

### Deploying `toolkit-admin`:
1. In Vercel, click **"Add New Project"** again.
2. Select the same repository.
3. Set **Root Directory** to `toolkit-admin`.
4. Click **Deploy**. Your admin panel will be live at `https://admin-your-toolkit.vercel.app`!

---

## 🗄️ Firebase Database Setup

Your Firebase project (`yalla-9478b`) is pre-wired into both projects.

### Firestore Security Rules
Go to **Firebase Console > Firestore Database > Rules** and paste:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tools/{toolId} {
      allow read: if true;
      allow write: if true;
    }
    match /settings/{doc} {
      allow read: if true;
      allow write: if true;
    }
    match /submissions/{subId} {
      allow create: if true;
      allow read, update, delete: if true;
    }
    match /_connection_test/{testId} {
      allow read, write: if true;
    }
  }
}
```

### 1-Click Initial Seed:
Inside the Admin Panel Overview (`/`), click **"1-Click Push to Firebase"** to automatically populate all 12 initial curated tools and settings into your live cloud database!
