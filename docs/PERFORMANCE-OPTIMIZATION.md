# Performance Optimization Guide

This document outlines all performance optimizations implemented in the Kando Martial Arts Knox website.

## ✅ Current Optimizations

### Build-Time Optimizations

#### HTML Compression
- **Status**: ✅ Enabled
- **Configuration**: `compressHTML: true` in `astro.config.mjs`
- **Impact**: Reduces HTML file size by ~30-50%

#### CSS Optimization
- **Status**: ✅ Minified
- **Configuration**: Vite build with CSS code splitting (`cssCodeSplit: true`)
- **Impact**: 
  - CSS is minified (single line, no whitespace)
  - Split per page for better caching
  - Main CSS file: ~110KB (minified)

#### JavaScript Optimization
- **Status**: ✅ Minified with esbuild
- **Configuration**: 
  - `minify: "esbuild"` (faster than terser)
  - Code splitting with vendor chunks
  - React vendor: ~138KB (44KB gzipped)
- **Impact**: Faster minification, smaller bundles

#### Image Optimization
- **Status**: ✅ Fully Optimized
- **Configuration**: 
  - Sharp image service with WebP/AVIF conversion
  - Default format: WebP (best compression)
  - Quality: 80% (good balance)
  - Lazy loading: Enabled by default
  - Async decoding: Enabled by default
- **Impact**: 
  - WebP: ~30% smaller than JPEG
  - AVIF: ~50% smaller than JPEG
  - Images load only when needed (lazy loading)

### Runtime Optimizations

#### Resource Hints
- **Status**: ✅ Implemented
- **Configuration**:
  - `preconnect` to Google Fonts
  - `preconnect` to Google Analytics
  - `dns-prefetch` for external resources
- **Impact**: Faster DNS resolution and connection establishment

#### Font Loading
- **Status**: ✅ Optimized
- **Configuration**:
  - Google Fonts loaded with `display=swap`
  - Fonts loaded asynchronously (`media="print"` with `onload`)
  - Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`
- **Impact**: 
  - Prevents render-blocking
  - Text visible immediately with fallback fonts
  - Fonts swap in when loaded

#### Link Prefetching
- **Status**: ✅ Implemented
- **Configuration**:
  - Intersection Observer for viewport-based prefetching
  - Hover-based prefetching for desktop
  - Prefetches 200px before link is visible
- **Impact**: Instant navigation for prefetched pages

#### Image Loading Strategy
- **Status**: ✅ Optimized
- **Configuration**:
  - `loading="lazy"` on all non-critical images
  - `decoding="async"` on all images
  - Hero images use background-image (CSS)
- **Impact**: 
  - Faster initial page load
  - Images decode off main thread
  - Reduced bandwidth usage

### Caching Strategy

#### Browser Caching
- **Status**: ✅ Configured
- **Configuration** (via GitHub Actions):
  - HTML/XML/TXT: 1 day cache
  - CSS/JS: 1 year cache (immutable)
  - Images: 1 year cache (immutable)
  - Fonts: 1 year cache (immutable)
  - Other assets: 1 week cache
- **Impact**: Reduced server requests, faster repeat visits

#### CloudFront CDN
- **Status**: ✅ Configured
- **Configuration**:
  - Global edge locations
  - Cache invalidation on deployment
  - HTTPS redirect
- **Impact**: 
  - Reduced latency worldwide
  - Faster content delivery

### Code Splitting
- **Status**: ✅ Implemented
- **Configuration**:
  - React vendor chunk separated
  - Flowbite vendor chunk separated
  - Other vendor dependencies grouped
  - CSS split per page
- **Impact**: 
  - Smaller initial bundle
  - Better caching
  - Parallel downloads

## 🔧 Server-Side Optimizations (CloudFront)

### Compression (Brotli/Gzip)
- **Status**: ⚠️ Needs Configuration
- **Action Required**: Enable in CloudFront distribution
- **Configuration**: See AWS Setup Guide
- **Impact**: 
  - Brotli: ~20% better compression than Gzip
  - Gzip fallback for older browsers
  - Reduced bandwidth usage

## 📊 Performance Metrics

### Build Output Sizes (Gzipped)
- React vendor: ~44KB
- Header component: ~10KB
- ClientRouter: ~7.76KB
- Main CSS: ~110KB (uncompressed)

### Image Formats
- Primary: WebP (best compatibility)
- Fallback: AVIF (best compression, newer browsers)
- Original: JPEG/PNG (fallback)

## 🚀 Recommendations

### High Priority

1. **Enable CloudFront Compression** ✅
   - Configure Brotli/Gzip compression in CloudFront distribution
   - See AWS Setup Guide for instructions
   - **Status**: Configuration added to AWS setup guide

2. **Preload Hero Images**
   - Hero images use CSS `background-image` (can't use `fetchpriority`)
   - Consider preloading first hero slide image with `<link rel="preload">`
   - Improves Largest Contentful Paint (LCP)
   - **Note**: Current implementation loads images via CSS, which is already optimized

3. **Preload Critical Resources**
   - Preload critical CSS
   - Preload hero images
   - Preload critical fonts

### Medium Priority

1. **Font Subsetting**
   - Only load used font weights
   - Reduce font file sizes

2. **Image Sizing**
   - Use `sizes` attribute for responsive images
   - Serve appropriately sized images per device

3. **Service Worker**
   - Implement offline support
   - Cache static assets
   - Improve repeat visit performance

### Low Priority

1. **Critical CSS Extraction**
   - Inline critical CSS
   - Defer non-critical CSS

2. **Resource Hints**
   - Add `preload` for critical resources
   - Add `prefetch` for likely next pages

## 📝 Monitoring

### Tools
- Google PageSpeed Insights
- Lighthouse (Chrome DevTools)
- WebPageTest
- Chrome DevTools Performance tab

### Key Metrics
- **LCP** (Largest Contentful Paint): Target < 2.5s
- **FID** (First Input Delay): Target < 100ms
- **CLS** (Cumulative Layout Shift): Target < 0.1
- **FCP** (First Contentful Paint): Target < 1.8s
- **TTI** (Time to Interactive): Target < 3.8s

## 🔗 References

- [Web.dev Performance](https://web.dev/performance/)
- [Astro Performance Guide](https://docs.astro.build/en/guides/performance/)
- [CloudFront Compression](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html)
- [Image Optimization](https://web.dev/fast/#optimize-your-images)

