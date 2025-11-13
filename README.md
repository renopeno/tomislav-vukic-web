# Tomislav Vukić - Website JavaScript

Custom JavaScript za Webflow website sa Barba.js tranzicijama i dark mode funkcionalnosti.

---

## 🚀 Quick Start

### Development (Lokalno)

```bash
npm run dev
```

Server radi na: `http://127.0.0.1:5500`

### Production Build

```bash
npm run build
```

Output: `dist/index.js`

### Deploy

```bash
git add .
git commit -m "Update"
git push origin main
```

Vercel automatski deploya! 🎉

---

## 📁 Struktura

```
src/
├── index.js              # Entry point
├── global/               # Globalne funkcije (sve stranice)
│   ├── barba-config.js   # Barba.js tranzicije
│   ├── dark-mode.js      # Dark/Light mode
│   ├── lenis-config.js   # Smooth scroll
│   ├── footer-gsap.js
│   ├── links-hover.js
│   └── ios-safari-fix.js
├── home/                 # Home page
│   ├── hero.js
│   ├── about-section.js
│   ├── highlights.js
│   └── categories.js
├── work/                 # Work pages
│   ├── work.js
│   └── photo-modal.js
└── about/                # About page
    └── about-page.js
```

---

## 🌐 Webflow Setup

### Footer Code

**Development:**
```html
<script type="module" src="http://127.0.0.1:5500/src/index.js"></script>
```

**Production:**
```html
<script type="module" src="https://tomislav-vukic-web-team-renopeno.vercel.app/index.js"></script>
```

Detaljnije upute: **`WEBFLOW-INSTRUCTIONS.md`**

---

## 🐛 Što je ispravljeno

- ✅ Dark mode flicker riješen
- ✅ Unificiran localStorage ključ: `'dark-mode'`
- ✅ Unificirana CSS klasa: `'ui-dark-mode'`
- ✅ Dark mode se primjenjuje prije prikaza stranice (Barba hooks)
- ✅ Primjena na `<html>` i `<body>` elemente

---

## 📝 Dodavanje Novih Funkcija

### 1. Kreiraj file (npr. `src/global/nova-funkcija.js`)

```javascript
function initNovaFunkcija() {
  console.log('Nova funkcija!');
}

window.initNovaFunkcija = initNovaFunkcija;
initNovaFunkcija();
```

### 2. Importaj u `src/index.js`

```javascript
import './global/nova-funkcija.js';
```

### 3. Ako treba u Barba tranzicijama

U `barba-config.js` → `initGlobalFunctions()` dodaj:

```javascript
initNovaFunkcija?.();
```

---

## 🔧 Korisne Naredbe

```bash
npm run dev      # Pokreni dev server (port 5500)
npm run build    # Build za production (dist/index.js)
npm run preview  # Preview production builda
```

---

## 📚 Dokumentacija

- **`WEBFLOW-INSTRUCTIONS.md`** - Kako integrirati s Webflowom
- **`DEPLOYMENT.md`** - Deployment upute za Vercel
- **`CHANGELOG.md`** - Povijest izmjena

---

## 💡 Important Notes

- **localStorage ključ:** `'dark-mode'`
- **CSS klasa:** `'ui-dark-mode'`
- **Dev server:** Node.js (`server.js`) s CORS supportom
- **Production:** Vercel auto-deploy
- **Hot reload:** Ne - morate refreshati browser

---

Napravio: Reno | Datum: 2025-11-13
