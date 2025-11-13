# 📋 Changelog

## [1.1.0] - 2025-11-13

### 🐛 Ispravljeno

#### Dark Mode Flicker (Glavni bug)
**Problem:** Bijeli flicker pri prelasku između stranica u dark mode-u

**Uzrok:**
- Dark mode se primjenjivao prekasno
- Nekonzistentnost localStorage ključa (`'darkMode'` vs `'dark-mode'`)
- Nekonzistentnost CSS klase (`'dark-mode'` vs `'ui-dark-mode'`)

**Rješenje:**
- Dodani Barba hooks koji primjenjuju dark mode **prije** prikaza stranice
- Unificiran localStorage: `'dark-mode'`
- Unificirana CSS klasa: `'ui-dark-mode'`
- Primjena na `<html>` i `<body>` elemente

**Izmijenjeni file-ovi:**
- `src/global/barba-config.js`
- `src/global/dark-mode.js`

---

### ✨ Novo

#### 1. Pojednostavljen Workflow
- Build stvara `index.js` (bilo `main.js`)
- Isti naziv lokalno i u produkciji
- Bez potrebe mijenjanja script tag-a

**Izmijenjeno:**
- `vite.config.js` - Output file: `index.js`, server port: 5500

#### 2. Vercel Auto-Deployment
- Automatski build pri svakom git push-u
- CORS headeri automatski postavljeni

**Izmijenjeno/Dodano:**
- `vercel.json` - buildCommand, outputDirectory
- `.gitignore` - Kreiran

#### 3. Development Server s CORS-om
- Node.js server (`server.js`) za lokalni development
- CORS support za Webflow integraciju
- Jednostavno: `npm run dev`

**Dodano:**
- `server.js` - Custom Node.js server

#### 4. Dokumentacija
- `README.md` - Glavni vodič
- `WEBFLOW-INSTRUCTIONS.md` - Webflow setup
- `DEPLOYMENT.md` - Vercel deployment
- `CHANGELOG.md` - Povijest izmjena

---

### 🔧 Tehnički Detalji

**barba-config.js:**
- Globalni hook: `barba.hooks.beforeEnter()` primjenjuje dark mode
- Dark mode u `leave`, `beforeEnter` transition hookovima
- Uklonjen dupliciran kod

**dark-mode.js:**
- localStorage ključ: `'dark-mode'` (konzisntetno)
- CSS klasa: `'ui-dark-mode'` (konzistentno)
- Primjena na `document.documentElement` i `document.body`

**vite.config.js:**
- Output: `index.js` (bilo `main.js`)
- Server port: 5500
- CORS: enabled

**vercel.json:**
- buildCommand, outputDirectory dodani
- CORS headeri konfigurirani

**package.json:**
- `npm run dev` → `node server.js`
- `npm run build` → `vite build`

---

### 📦 Novi File-ovi

```
server.js       - Development server s CORS-om
.gitignore      - Git ignore rules
README.md       - Dokumentacija
WEBFLOW-INSTRUCTIONS.md
DEPLOYMENT.md
CHANGELOG.md
test-server.html - Test page
```

---

### 🗑️ Uklonjeno

- `dist/main.js` → sad je `dist/index.js`
- Komentirani/zastarjeli kod u `barba-config.js`

---

## [1.0.0] - Prije izmjena

- Barba.js tranzicije funkcionalne
- Dark mode ALI s flickerom
- Build: `main.js`
- Nekonzistentnost u ključevima i klasama

---

## 📊 Metrike

- **Build time:** ~80ms
- **Output size:** 22.81 kB (6.93 kB gzipped)
- **Modules:** 14

---

Ažurirano: 2025-11-13
