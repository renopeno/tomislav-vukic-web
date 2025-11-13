# 🚀 Deployment na Vercel

## Prvi Put (Setup)

### 1. Instaliraj Vercel CLI

```bash
npm install -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Deploy

```bash
vercel --prod
```

Dobivate production URL, npr:
```
https://tomislav-vukic-web-team-renopeno.vercel.app
```

⚠️ **Zapamtite ovaj URL za Webflow!**

---

## Svaki Sljedeći Put

### Automatski (Preporučeno) ✅

```bash
git add .
git commit -m "Update"
git push origin main
```

Vercel **automatski deploya** svaki push! 🎉

### Manualni

```bash
vercel --prod
```

---

## Workflow Pregled

### 1. Lokalni Development

```bash
# Napravi izmjene u src/
npm run dev

# Testiraj na: http://127.0.0.1:5500/test-server.html
```

### 2. Build (Opciono - da provjeriš radi li)

```bash
npm run build
```

### 3. Commit & Deploy

```bash
git add .
git commit -m "Opis izmjena"
git push origin main

# Vercel automatski deploya (1-2 min)
```

### 4. Update Webflow

U Webflow Footer Code **zamijenite comment**:

```html
<!-- Production -->
<script type="module" src="https://VAŠ-URL.vercel.app/index.js"></script>

<!-- Local -->
<!-- <script type="module" src="http://127.0.0.1:5500/src/index.js"></script> -->
```

---

## Provjera Statusa

### Terminal:

```bash
vercel ls
```

### Browser:

https://vercel.com/dashboard

---

## Troubleshooting

### Build fails?

```bash
# Testiraj lokalno
npm run build

# Provjeri greške
```

### Deployment radi, promjene nisu vidljive?

1. Hard refresh: `CTRL/CMD + SHIFT + R`
2. Provjeri Vercel dashboard (build finished?)
3. Clear browser cache

### CORS error?

Provjeri `vercel.json` - već je postavljen ✅

---

## Build Info

- **Build Command:** `npm run build`
- **Output Directory:** `dist/`
- **Output File:** `dist/index.js`
- **Build Time:** ~10-30 sekundi

---

## 💡 Pro Tip

Svaki git branch dobiva svoj preview URL za testiranje!

```bash
git checkout -b feature/nova-funkcija
git push origin feature/nova-funkcija

# Vercel kreira preview URL!
```

---

Ažurirano: 2025-11-13
