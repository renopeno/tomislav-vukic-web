# 🌐 Webflow Setup - Kratke Upute

## ⚡ QUICK REFERENCE

### Za Localhost Testiranje:
```bash
npm run local
```
**Script tag za Webflow Footer:**
```html
<script type="module" src="http://localhost:5500/src/index.js"></script>
```

### Za Production Deploy:
```bash
npm run build
git add .
git commit -m "Update"
git push origin main
```
**Script tag za Webflow Footer:**
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/renopeno/tomislav-vukic-web@main/dist/index.js"></script>
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

<!-- PRODUCTION (jsDelivr CDN sa GitHuba) -->
<script type="module" src="https://cdn.jsdelivr.net/gh/renopeno/tomislav-vukic-web@main/dist/index.js"></script>

<!-- LOCAL TESTING (zakomentiraj production, odkomentiraj ovo) -->
<!-- <script type="module" src="http://localhost:5500/src/index.js"></script> -->
```

---

## 🧪 LOCAL TESTING Workflow

### Prije pusha na production - UVIJEK testiraj lokalno!

1. **Pokreni lokalni dev server:**
   ```bash
   npm run local
   ```
   Server će se pokrenuti na: `http://localhost:5500`

2. **U Webflow Footer Code - zakomentiraj production, odkomentiraj localhost:**
   ```html
   <!-- PRODUCTION (jsDelivr CDN sa GitHuba) -->
   <!-- <script type="module" src="https://cdn.jsdelivr.net/gh/renopeno/tomislav-vukic-web@main/dist/index.js"></script> -->
   
   <!-- LOCAL TESTING -->
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
   <!-- PRODUCTION (jsDelivr CDN sa GitHuba) -->
   <script type="module" src="https://cdn.jsdelivr.net/gh/renopeno/tomislav-vukic-web@main/dist/index.js"></script>
   
   <!-- LOCAL TESTING (zakomentiraj ovo) -->
   <!-- <script type="module" src="http://localhost:5500/src/index.js"></script> -->
   ```

---

## 🚀 Deploy Process (jsDelivr CDN)

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

3. **jsDelivr automatski povlači sa GitHuba** (može trebati 1-2 min cache refresh)

4. **Force refresh u browseru** ako ne vidiš izmjene odmah:
   - Mac: `Cmd + Shift + R`
   - Windows/Linux: `Ctrl + Shift + R`

**Nema potrebe za Vercelom!** jsDelivr je besplatan i bez limita.

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
