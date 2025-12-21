# Performance Optimization Recommendations

## Current Build Analysis

**Key Metrics:**

- Main client bundle: 186.62 kB (58.47 kB gzipped) - **LARGE**
- Header component: 27.31 kB (9.63 kB gzipped)
- 28 pages built successfully

## Critical Performance Issues

### 1. **Client Hydration Strategy** ⚠️ HIGH PRIORITY

**Issue:** Many components use `client:load` which loads JavaScript immediately, blocking initial render.

**Current Usage:**

- `Header` - `client:load` (27KB)
- `PrimaryButton` - `client:load` (multiple instances)
- `DualFilter` - `client:load`
- `CategoryFilter` - `client:load`
- `ProgramGrid` - `client:load`

**Recommendations:**

- ✅ **Header**: Keep `client:load` (needed for navigation)
- ✅ **PrimaryButton**: Change to `client:idle` (loads after page is interactive)
- ✅ **Filters**: Change to `client:visible` (loads when scrolled into view)
- ✅ **ProgramGrid**: Change to `client:visible` (below the fold)

**Impact:** Reduces initial JavaScript by ~30-40KB, improves First Contentful Paint (FCP)

---

### 2. **Build Configuration Optimizations** ⚠️ HIGH PRIORITY

**Current:** No build optimizations configured

**Recommendations:**

```javascript
// astro.config.mjs
export default defineConfig({
  site: "https://knoxmartialarts.com.au",
  compressHTML: true, // Minify HTML
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true, // Split CSS per page
      rollupOptions: {
        output: {
          manualChunks: {
            // Split React into separate chunk
            "react-vendor": ["react", "react-dom", "react/jsx-runtime"],
            // Split Flowbite into separate chunk
            flowbite: ["flowbite", "flowbite-react"],
          },
        },
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
  // ... rest of config
});
```

**Impact:** Better code splitting, smaller initial bundles, improved caching

---

### 3. **Resource Hints & Preloading** ⚠️ MEDIUM PRIORITY

**Missing:** No preload/prefetch hints for critical resources

**Recommendations:**
Add to `Layout.astro` `<head>`:

```astro
<!-- Preload critical fonts -->
<link
  rel="preload"
  href="/fonts/space-grotesk.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link
  rel="preload"
  href="/fonts/teachers.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="dns-prefetch" href="https://www.googletagmanager.com" />

<!-- Preload critical CSS -->
<link rel="preload" href="/styles/global.css" as="style" />
```

**Impact:** Faster font loading, reduced layout shift, better Core Web Vitals

---

### 4. **Image Optimization** ⚠️ MEDIUM PRIORITY

**Current:** All images in `/public/img/` - no optimization

**Recommendations:**

1. **Use WebP/AVIF formats** where possible
2. **Add responsive images** with `srcset`:

```astro
<img
  src="/img/hero.jpg"
  srcset="/img/hero-400.jpg 400w, /img/hero-800.jpg 800w, /img/hero-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Description"
  loading="lazy"
  decoding="async"
/>
```

3. **Consider moving critical images** (above fold) to `src/assets/` and using Astro's Image component

**Impact:** 30-50% smaller image sizes, faster page loads

---

### 5. **Defer Non-Critical Scripts** ⚠️ MEDIUM PRIORITY

**Current:** Google Analytics loads immediately

**Recommendations:**

```astro
<!-- Defer Google Analytics -->
<script
  defer
  src={`https://www.googletagmanager.com/gtag/js?id=${SITE_CONFIG.googleAnalyticsId}`}
></script>
```

**Impact:** Faster initial page load, better Time to Interactive (TTI)

---

### 6. **CSS Optimization** ⚠️ LOW PRIORITY

**Current:** CSS warnings about view transitions

**Recommendations:**
Fix CSS selector warnings (they're cosmetic but should be cleaned up):

```css
/* Use attribute selectors instead of wildcards */
::view-transition-old([data-transition-name^="program-image-"]),
::view-transition-new([data-transition-name^="program-image-"]) {
  /* ... */
}
```

**Impact:** Cleaner build output, potential minor performance gain

---

### 7. **Font Loading Strategy** ⚠️ MEDIUM PRIORITY

**Current:** Fonts likely loaded via CSS without optimization

**Recommendations:**

```astro
<!-- In Layout.astro head -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Teachers:wght@400;500;600;700&display=swap"
  rel="stylesheet"
  media="print"
  onload="this.media='all'"
/>
<noscript>
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Teachers:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</noscript>
```

**Impact:** Prevents render-blocking font loading, improves FCP

---

### 8. **Code Splitting for React Components** ⚠️ HIGH PRIORITY

**Current:** All React components bundled together

**Recommendations:**
Use dynamic imports for large components:

```tsx
// Instead of direct import
const Header = lazy(() => import("./components/Header"));

// Use client:visible for below-fold components
<DualFilter client:visible schedule={schedule} />;
```

**Impact:** Smaller initial bundle, faster initial load

---

## Implementation Priority

### Phase 1 (Quick Wins - 30 min)

1. ✅ Change `client:load` to `client:visible`/`client:idle` for non-critical components
2. ✅ Add `compressHTML: true` to Astro config
3. ✅ Defer Google Analytics script
4. ✅ Add preconnect/dns-prefetch for external domains

### Phase 2 (Medium Effort - 2 hours)

1. ✅ Configure build optimizations (code splitting)
2. ✅ Add font preloading
3. ✅ Optimize critical images (convert to WebP, add srcset)
4. ✅ Fix CSS warnings

### Phase 3 (Long Term - Ongoing)

1. ✅ Move images to `src/assets/` and use Astro Image component
2. ✅ Implement responsive images across all pages
3. ✅ Set up image CDN/optimization service
4. ✅ Monitor Core Web Vitals and Lighthouse scores

---

## Expected Performance Gains

| Optimization             | FCP Improvement | TTI Improvement | Bundle Size Reduction |
| ------------------------ | --------------- | --------------- | --------------------- |
| Client hydration changes | -200ms          | -300ms          | -30KB                 |
| Build optimizations      | -100ms          | -200ms          | -20KB (initial)       |
| Image optimization       | -500ms          | -100ms          | -50% image size       |
| Resource hints           | -150ms          | -50ms           | N/A                   |
| **Total Expected**       | **-950ms**      | **-650ms**      | **-50KB + images**    |

---

## Monitoring

After implementing:

1. Run Lighthouse audit (target: 90+ scores)
2. Check Core Web Vitals in Google Search Console
3. Monitor bundle sizes in build output
4. Test on slow 3G connection
