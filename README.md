# LEGEND MOD TOOLKIT

> **Official Web Tools & Utilities Platform**  
> **Created by:** MA LEGEND  
> **Brand:** LEGEND MOD  
> **Official WhatsApp Channel:** [Join Here](https://whatsapp.com/channel/0029VarS46O3QxRtTZO0z60x)  
> **Official YouTube Channel:** [Subscribe Here](https://www.youtube.com/@legendmod407)

---

## ⚡ Overview

A powerful, high-performance **Tools & Websites Platform** built with **Next.js 14**, **Tailwind CSS**, and **Firebase**.

The project is structured into two **completely separate, independent** applications:

1. **`toolkit-app/`** - **The Public Platform (`LEGEND MOD TOOLKIT`)**
   - High-octane Dark Cyber Red & Gold aesthetic.
   - Fully optimized mobile responsive layout with **2 tools per row** (`grid-cols-2`) on phone screens.
   - **Zero admin links or submission forms** in the public app to keep it 100% clean and secured.
   - Live category filtering, instant search, bookmarks, and fast external links.
   - Built-in official links to MA LEGEND's WhatsApp Channel and YouTube Channel.

2. **`toolkit-admin/`** - **The Standalone Admin Control Center**
   - Completely separate web app with independent routing and authentication.
   - Add, edit, feature, and delete tools.
   - Manage categories and real-time site settings.
   - 1-click cloud sync with Firebase Firestore.

---

## ☁️ Deploying on Vercel

Both apps are pre-configured for seamless zero-config deployment on Vercel:

### 1. Deploy the Public Toolkit (`toolkit-app`)
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
2. Select your repository: **`Toolkit-`**.
3. Set **Root Directory** to `toolkit-app`.
4. Click **Deploy**. Your toolkit will be live at `https://your-domain.vercel.app`!

### 2. Deploy the Admin Panel (`toolkit-admin`)
1. In Vercel, click **"Add New Project"** again.
2. Select the same repository: **`Toolkit-`**.
3. Set **Root Directory** to `toolkit-admin`.
4. Click **Deploy**. Your admin panel will be live on its own separate private URL!

---

## 🔐 Admin Panel Access

1. Open your deployed Admin Panel.
2. Select **Master Passcode** login:
   - Passcode: `admin123` or `yalla2026`
3. Or use **Firebase Auth** with your registered admin email.

---

## 🗄️ Firebase Database Setup

Your Firebase project (`yalla-9478b`) is pre-configured.

### Firestore Security Rules
Go to **Firebase Console > Firestore Database > Rules** and set:
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

### 1-Click Initial Cloud Sync:
Inside your Admin Panel Overview (`/`), click **"1-Click Push to Firebase"** to sync all curated tools and settings to your cloud database!

---

## 👑 Credits & Official Community
- **Platform:** LEGEND MOD TOOLKIT
- **Developer & Curator:** MA LEGEND
- **WhatsApp Channel:** [0029VarS46O3QxRtTZO0z60x](https://whatsapp.com/channel/0029VarS46O3QxRtTZO0z60x)
- **YouTube Channel:** [@legendmod407](https://www.youtube.com/@legendmod407)
