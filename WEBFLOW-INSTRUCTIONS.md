# 🌐 Webflow Setup - Kratke Upute

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

## 🎬 Home Page - Hero Animacije

### Redoslijed Animacija

Hero sekcija koristi **3D Carousel** (Three.js) sa preciznim timing-om:

#### 1. **Carousel (prvo što se učitava)**
- **Delay:** 0.2s
- **Fotke fade-in:** stagger 0.15s između svake fotke
- **Efekt:** opacity 0→1, scale 0.7→1
- **Duration:** 0.6s per fotka
- **Ease:** back.out(1.2) za scale (bounce efekt)

#### 2. **Tekst (dolazi pred kraj carousela)**
- **Timing:** Počinje ~0.8s prije kraja carousel animacije
- **Duration:** 0.6s (sporija animacija)
- **Stagger:** 0.04s između slova
- **Ease:** power2.inOut (smooth in/out)
- **Efekt:** y:200→0, opacity 0→1

#### 3. **Footer (dolazi nakon teksta)**
- **Timing:** 0.2s nakon što tekst počne
- **Duration:** 0.6s
- **Stagger:** 0.12s između elemenata
- **Ease:** power2.inOut
- **Efekt:** y:20→0, opacity 0→1

#### 4. **Carousel Behavior**

**Auto-rotation:**
- **Base speed:** 0.001 (vrlo sporo)
- **Scroll-driven:** Ubrzava se prema scroll brzini
- **Max speed:** 0.015

**Drag interakcija:**
- **Desktop:** Mouse drag enabled
- **Mobile:** Drag disabled (normalan scroll)
- **Inertia:** 3s smooth deceleration nakon puštanja
- **Sensitivity:** 0.0009 (70% sporije nego default)

**Floating efekt:**
- Lagano ljuljanje po X i Z osi
- Duration: 4-5.5s
- Ease: sine.inOut (breathing efekt)

#### 5. **Optimizacije**

- **Intersection Observer:** Pauzira rendering kad nije u viewportu
- **GSAP Ticker:** Sinkronizirano sa Lenis smooth scrollom
- **Responsive:** Camera position adjusted za mobile

---

## 📸 Work Page - Grid & Animacije

### Ponašanje Galerije

Work page galerija koristi **JavaScript generated grid** umjesto Webflow layouta:

#### 1. **Flicker Prevention**
```css
/* U HEAD CODE - sakrij fotke dok JS ne preuzme kontrolu */
.photo-container {
  opacity: 0;
}
```
- Webflow prikazuje galeriju u flexbox layoutu
- JS odmah postavlja `opacity: 0` na sve `.photo-container` elemente
- Čeka da slike budu učitane
- Generira grid i animira reveal

#### 2. **Grid Konfiguracija**

```javascript
// Desktop (> 992px)
columns: 12
left side: [2, 3]
right side: [8, 9]
horizontal span: 3
vertical span: 2

// Tablet (768px - 992px)
columns: 8
left side: [2, 3]
right side: [5, 6]

// Mobile (< 768px)
columns: 1
```

#### 3. **Animacije**

**Prve 5 fotki (instant reveal):**
- **Delay:** 0.3s (da se vidi animacija)
- **Duration:** 0.8s
- **Ease:** power3.out
- **Stagger:** 0.12s između fotki
- **Efekt:** opacity 0→1, scale 0.9→1, y:50→0

**Ostale fotke (lazy load sa Intersection Observer):**
- **rootMargin:** 0px (triggera kad fotka uđe u viewport)
- **threshold:** 0.2 (mora biti 20% vidljiva)
- **Bez delay-a** - animacija kreće odmah
- **Duration:** 0.8s
- **Ease:** power3.out
- **Efekt:** isti kao prve fotke (opacity, scale, y:50)

#### 4. **Shuffle & Limit**

- **Max fotki:** 30 (performanse)
- **Random shuffle:** Svaki page load različit redoslijed
- **Eager loading:** Prvih 6 fotki (loading="eager" + fetchpriority="high")
- **Lazy loading:** Ostale fotke (loading="lazy")

#### 5. **Webflow Setup**

**U Webflowu:**
- `.photo-container` mora imati **opacity: 0%** (ili u HEAD CODE)
- Galerija može biti u bilo kojem layoutu (flex, grid) - JS će preuzeti kontrolu
- Svaka fotka mora imati klasu `.photo`

**Cleanup na page leave:**
- Disconnect Intersection Observer
- Dispose GSAP animacija
- Dispose Three.js resources (ako ih ima)

---

## 🔧 Troubleshooting Animacija

### Hero Animacije

**Problem: Carousel se učitava prekasno**
- Povećaj delay za carousel animacije (trenutno 0.2s)
- `src/home/hero.js` → `startTime = 0.2 + index * 0.15`

**Problem: Tekst se učitava prerano**
- Smanji `textStartTime` offset (trenutno `-1.2s`)
- `src/home/hero.js` → `const textStartTime = carouselRevealEnd - 1.2`

**Problem: Animacije su prespore/prebrze**
- Adjust duration: `duration: 0.6` (trenutno)
- Adjust stagger: `stagger: 0.04` za tekst, `0.12` za footer

**Problem: Carousel se ne vrti/lagga**
- Provjeri Console za greške
- Provjeri da Three.js CDN radi
- Provjeri da `.hero-images-container` postoji u DOM-u

### Work Grid Animacije

**Problem: Fotke se vide prije nego JS preuzme kontrolu (flicker)**
```css
/* Dodaj u HEAD CODE */
.photo-container {
  opacity: 0;
}
```

**Problem: Fotke se učitavaju prekasno pri scrollu**
- Smanji `threshold` (trenutno 0.2)
- Povećaj `rootMargin` (trenutno 0px)
- `src/work/work.js` → observerOptions

**Problem: Fotke se učitavaju prerano pri scrollu**
- Povećaj `threshold` (0.2 → 0.3)
- Smanji `rootMargin` (0px → -50px)

**Problem: Prvih 5 fotki ima delay koji je prekratak**
- Povećaj delay (trenutno 0.3s)
- `src/work/work.js` → `delay: 0.3`

**Problem: Animacija y:50 nije glatka**
- Promijeni ease (trenutno `power3.out`)
- Promijeni duration (trenutno 0.8s)

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
