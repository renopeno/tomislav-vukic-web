# 🌐 Webflow Setup - Kratke Upute

## 🔗 Staging Link
**Staging stranica za testiranje:**
https://tomislav-vukic.webflow.io

---

## ⚡ QUICK REFERENCE

### Za Localhost Development:
```bash
npm run local
```
**Script tag za Webflow Footer:**
```html
<script type="module" src="http://localhost:5500/src/index.js"></script>
```

### Za Production Deploy (Vercel):
```bash
npm run build
git add .
git commit -m "Update: opis izmjena"
git push origin main
```
**Vercel automatski deploya!**

**Script tag za Webflow Footer (Production):**
```html
<script type="module" src="https://VAŠ-VERCEL-URL.vercel.app/index.js"></script>
```

---

## 📍 Project Settings → Custom Code

### HEAD CODE

```html
<style>
/* Uklanja highlight na iOS-u */
a, button {
    -webkit-tap-highlight-color: transparent;
}

/* Lenis smooth scroll */
html.lenis,
html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

.lenis.lenis-smooth iframe {
  pointer-events: none;
}

.section.hero {
  position: relative;
  overflow: hidden;
}

/* Font smoothing */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Barba container - sprječava flicker */
[data-barba="container"] {
  opacity: 0;
}

/* Work galerija - spriječi flicker prije nego JS preuzme kontrolu */
.photo-container {
  opacity: 0;
}

/* Uklanja Webflow badge */
.w-webflow-badge {
  display: none !important;
  visibility: hidden !important;
} 
</style>

<script>
// Dark mode instant apply (protiv flickera)
(function() {
  if (localStorage.getItem('dark-mode') === 'enabled') {
    var html = document.documentElement;
    var body = document.body;
    if (html) html.classList.add('ui-dark-mode');
    if (body) body.classList.add('ui-dark-mode');
  }
})();

// Barba container opacity fix
window.addEventListener('DOMContentLoaded', function() {
  var container = document.querySelector('[data-barba="container"]');
  if (container) {
    container.style.opacity = "1";
  }
});

// Webflow CMS Active Link Fix
var Webflow = Webflow || [];
Webflow.push(function() {
  var curUrl = location.pathname;
  if (typeof $ !== 'undefined') {
    $('nav a').each(function() {
      var link = $(this).attr('href');
      if (link === curUrl) {
        $(this).addClass('w--current');
      } else if (curUrl.startsWith('/work/') && link === '/work') {
        $(this).addClass('w--current');
      } else if (curUrl.startsWith('/about') && link === '/about') {
        $(this).addClass('w--current');
      } 
    });
  }
});
</script>
```

---

### FOOTER CODE

```html
<!-- CDN Libraries -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/Flip.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/split-type"></script>
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@barba/core"></script>

<!-- Three.js r159 (zadnja globalna verzija bez deprecation warninga) -->
<script src="https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.min.js"></script>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- Custom JavaScript Bundle -->
<!-- ═══════════════════════════════════════════════════════════ -->

<!-- PRODUCTION (Vercel) -->
<script type="module" src="https://VAŠ-VERCEL-URL.vercel.app/index.js"></script>

<!-- LOCAL DEVELOPMENT (zakomentiraj production, odkomentiraj ovo) -->
<!-- <script type="module" src="http://localhost:5500/src/index.js"></script> -->
```

---

## 🧪 LOCAL DEVELOPMENT Workflow

### Prije pusha na production - UVIJEK testiraj lokalno!

1. **Pokreni lokalni dev server:**
   ```bash
   npm run local
   ```
   Server će se pokrenuti na: `http://localhost:5500`

2. **U Webflow Footer Code - zakomentiraj production, odkomentiraj localhost:**
   ```html
   <!-- PRODUCTION (Vercel) -->
   <!-- <script type="module" src="https://VAŠ-VERCEL-URL.vercel.app/index.js"></script> -->
   
   <!-- LOCAL DEVELOPMENT -->
   <script type="module" src="http://localhost:5500/src/index.js"></script>
   ```

3. **Testiraj sve izmjene u Webflow Preview:**
   - Otvori Webflow Preview
   - Provjeri sve interakcije
   - Provjeri Console (F12) za greške

4. **Kad sve radi - Build za production:**
   ```bash
   npm run build
   ```

5. **U Webflow Footer Code - vrati na production:**
   ```html
   <!-- PRODUCTION (Vercel) -->
   <script type="module" src="https://VAŠ-VERCEL-URL.vercel.app/index.js"></script>
   
   <!-- LOCAL DEVELOPMENT (zakomentiraj ovo) -->
   <!-- <script type="module" src="http://localhost:5500/src/index.js"></script> -->
   ```

---

## 🚀 Deploy Process (Vercel)

### Kad napraviš izmjene u kodu:

1. **Build projekt:**
   ```bash
   npm run build
   ```

2. **Commit i push na GitHub:**
   ```bash
   git add .
   git commit -m "Update: Opis izmjena"
   git push origin main
   ```

3. **Vercel automatski deploya** (1-2 min)
   - Svaki push na `main` branch automatski triggera deployment
   - Provjeri status na: https://vercel.com/dashboard

4. **Force refresh u browseru** ako ne vidiš izmjene odmah:
   - Mac: `Cmd + Shift + R`
   - Windows/Linux: `Ctrl + Shift + R`

---

## 🎬 Home Page - Hero Sekcija

### Setup & Ponašanje

Hero sekcija koristi **3D Carousel** sa Three.js i preciziranim redoslijedom animacija.

#### **Redoslijed Učitavanja:**

1. **Carousel fotografije** - učitavaju se prve
2. **Tekst** - pojavljuje se pred kraj carousel animacije
3. **Footer elementi** - dolaze nakon teksta

**Logika:** Carousel ima prioritet jer je glavni vizualni element. Tekst i footer layeraju se preko dok se carousel još animira za smooth "layered reveal" efekt.

#### **Carousel Interakcija:**

- **Auto-rotation:** Lagana kontinuirana rotacija
- **Scroll-driven:** Carousel ubrzava rotaciju prema brzini scrolla
- **Drag:** Desktop ima mouse drag, mobile nema (ne blokira scroll)
- **Inertia:** Smooth deceleration nakon puštanja
- **Floating:** Lagano "breathing" ljuljanje za organic feel

#### **Optimizacije:**

- Intersection Observer pauzira rendering kad nije u viewportu
- GSAP Ticker sinkroniziran sa Lenis smooth scrollom
- Responsive camera positioning za mobile

**Detalji o timing-ima i vrijednostima:** `src/home/hero.js`

---

## 📸 Work Page - Grid Galerija

### Setup & Ponašanje

Work page galerija koristi **JavaScript generated grid** umjesto Webflow layouta.

#### **Webflow Setup:**

- Galerija u Webflowu može biti u bilo kojem layoutu (flex, grid, collection list)
- Svaki photo container treba imati klasu `.photo-container`
- Svaka slika treba imati klasu `.photo`
- **Bitno:** `.photo-container` mora imati `opacity: 0` (CSS u HEAD CODE ili Webflow stilovi)

```css
/* U HEAD CODE - spriječi flicker prije nego JS preuzme kontrolu */
.photo-container {
  opacity: 0;
}
```

#### **Kako Funkcionira:**

1. **Webflow prikazuje galeriju** u svom originalnom layoutu
2. **JS odmah sakrije sve fotke** (`opacity: 0`)
3. **Čeka da se slike učitaju** (da zna aspect ratio)
4. **Generira randomiziran grid** sa specifičnim pravilima za pozicioniranje
5. **Animira reveal** sa GSAP-om

#### **Grid Logika:**

- **Responsive:** Različite grid konfiguracije za desktop/tablet/mobile
- **Random positioning:** Fotke se pozicioniraju nasumično u definirane grid zone (lijevo/desno)
- **Aspect ratio aware:** Horizontalne vs vertikalne fotke dobivaju različite span-ove
- **Shuffle:** Svaki page load prikazuje fotke u različitom redoslijedu

#### **Animacije:**

- **Prve fotke:** Instant reveal sa delayom (da korisnik vidi animaciju)
- **Ostale fotke:** Lazy load sa Intersection Observer (animiraju se kad uđu u viewport)
- **Efekti:** fade + scale + slide up (y:50) za smooth reveal

#### **Optimizacije:**

- **Limit broja fotki** za performanse (CMS može imati više od potrebe)
- **Eager loading** za prve fotke, lazy za ostale
- **Intersection Observer** za efikasno lazy loading
- **Cleanup:** Disconnect observers na page leave (Barba.js)

**Detalji o grid pravilima i timing-ima:** `src/work/work.js`

---

## 🔧 Troubleshooting

### Hero Sekcija

**Problem: Carousel se učitava prekasno/prerano**
- Adjust `startTime` delay za carousel fotke u `src/home/hero.js`

**Problem: Tekst se učitava prekasno/prerano**
- Adjust `textStartTime` offset u `src/home/hero.js`
- To kontrolira kada tekst počinje u odnosu na carousel reveal

**Problem: Animacije su prespore/prebrze**
- Adjust `duration` i `stagger` vrijednosti u `src/home/hero.js`

**Problem: Carousel se ne vrti ili lagga**
- Provjeri Console (F12) za greške
- Provjeri da Three.js CDN radi
- Provjeri da `.hero-images-container` postoji u DOM-u
- Provjeri da Webflow CMS ima slike u hero sekciji

### Work Page Grid

**Problem: Fotke se vide prije nego JS preuzme kontrolu (flicker)**
```css
/* Dodaj u HEAD CODE */
.photo-container {
  opacity: 0;
}
```

**Problem: Fotke se učitavaju prekasno/prerano pri scrollu**
- Adjust Intersection Observer `threshold` i `rootMargin` u `src/work/work.js`
- Veći threshold = fotka mora biti više vidljiva prije nego se animira
- Pozitivan rootMargin = triggera ranije (prije nego uđe u viewport)

**Problem: Prvih fotki ima prekratak delay**
- Adjust `delay` vrijednost za prvih X fotki u `src/work/work.js`

**Problem: Animacije nisu smooth**
- Adjust `ease` i `duration` parametara u GSAP animacijama
- Check `src/work/work.js` za sve animation properties

**Problem: Grid ne radi na mobile/tablet**
- Provjeri responsive breakpoints u `getCurrentConfig()` funkciji
- Provjeri da grid konfiguracije postoje za sve breakpointe

---

## 🏗️ HTML Struktura (na svakoj stranici)

```html
<div data-barba="wrapper">
  <div data-barba="container" data-barba-namespace="NAZIV">
    <!-- Sadržaj stranice -->
  </div>
</div>
```

### Namespace-ovi:
- Home: `data-barba-namespace="home"`
- Work: `data-barba-namespace="work"`
- About: `data-barba-namespace="about"`
- Work kategorije: `work-abstract`, `work-nature`, `work-people`, `work-products`, `work-architecture`

---

## 🎨 Dark Mode CSS

```css
/* Light mode (default) */
body {
  background-color: white;
  color: black;
}

/* Dark mode */
body.ui-dark-mode,
html.ui-dark-mode body {
  background-color: #1a1a1a;
  color: white;
}
```

---

## 🔘 Dark Mode Toggle Button

```html
<button class="nav-theme-switcher">Toggle Dark Mode</button>
```

Ili bilo koji element s klasom `.nav-theme-switcher`

---

## ✅ Checklist

- [ ] CDN libraries u Footer Code
- [ ] Inline dark mode script u Head Code
- [ ] Barba wrapper/container na svim stranicama
- [ ] Pravilni namespace-ovi
- [ ] Dark mode toggle ima klasu `.nav-theme-switcher`
- [ ] CSS ima `.ui-dark-mode` stilove
- [ ] Relativni linkovi (ne eksterni)

---

## 🧪 Testiranje

1. F12 → Console
2. Provjeri nema error-a
3. Testiraj dark mode toggle
4. Navigacija između stranica
5. Nema bijelog flickera ✅

---

Ažurirano: 2025-11-13
