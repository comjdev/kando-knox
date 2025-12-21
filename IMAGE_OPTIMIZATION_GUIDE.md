# Image Optimization Guide - Best Practices

## ✅ Current Setup: Astro Handles Image Optimization

**Best Practice:** Let Astro optimize images during build (not in GitHub Actions)

### Why This is Better:

1. **Integrated Build Process**
   - Images optimized during `npm run build`
   - No separate conversion step needed
   - Works seamlessly with Astro's Image component

2. **Automatic Format Conversion**
   - Converts to WebP/AVIF automatically
   - Generates responsive `srcset` images
   - Optimizes based on usage context

3. **Better Performance**
   - Images optimized once during build
   - No runtime conversion overhead
   - Smaller bundle sizes

---

## 🖼️ Image Optimization Status

### ✅ Optimized Images (WebP/AVIF)

**Location:** `src/assets/img/`
**Status:** ✅ Fully optimized by Astro

**Examples:**
- `src/assets/img/kando-knox-karate-man.jpg` → Optimized to WebP
- `src/assets/img/kando-knox-karate-girl.jpg` → Optimized to WebP
- `src/assets/img/bear-cave-logo.avif` → Already optimized

**How it works:**
```astro
---
import heroImage from "../assets/img/hero.jpg";
---
<Image src={heroImage} alt="..." format="webp" />
```

**Result:**
- ✅ Converted to WebP format
- ✅ Responsive srcset generated
- ✅ Optimized file size
- ✅ Proper loading attributes

---

### ✅ All Images Optimized

**Location:** `src/assets/img/`
**Status:** ✅ Fully optimized by Astro

**Cleanup:** ✅ Duplicate images in `public/img/` have been removed. All image references go through `imageMap.ts` which points to optimized assets in `src/assets/img/`.

---

## 🚀 Solution: Move Images to Assets

### Step 1: Move Images

Move all images from `public/img/` to `src/assets/img/`:
```bash
# Move hero images
mv public/img/hero/* src/assets/img/hero/

# Move other images
mv public/img/*.jpg src/assets/img/
mv public/img/*.JPG src/assets/img/
mv public/img/*.png src/assets/img/

# Move blog images
mv public/blog/* src/assets/img/blog/
```

### Step 2: Update References

**In JSON files (content/program/*.json, content/locations/*.json):**
```json
// Before
"image": "/img/program.jpg"

// After - Use relative path that will be imported
"image": "../../assets/img/program.jpg"
```

**In Markdown files (content/blog/*.md, content/pages/*.md):**
```markdown
<!-- Before -->
image: "/blog/post.jpg"

<!-- After - Use relative path -->
image: "../../assets/img/blog/post.jpg"
```

**In Components:**
```astro
---
// Before (string path)
const image = "/img/hero.jpg";

// After (asset import)
import heroImage from "../assets/img/hero.jpg";
---
<Image src={heroImage} alt="..." format="webp" />
```

### Step 3: Update Components to Use Imports

**For dynamic images from JSON/MD:**
- Create an image mapping utility
- Or use a build script to generate imports
- Or update OptimizedImage to handle asset paths

---

## 🔧 Current Configuration

### Astro Config (`astro.config.mjs`)

```javascript
image: {
  service: {
    entrypoint: "astro/assets/services/sharp",
    config: {
      limitInputPixels: false, // Allow large images
    },
  },
}
```

**Sharp Service:**
- ✅ Faster than Squoosh (default)
- ✅ Better quality
- ✅ Already installed (via Astro)

### OptimizedImage Component

**Default Format:** WebP
**Quality:** 80% (good balance of size/quality)

```astro
<OptimizedImage 
  src={image}  // Asset import or string path
  alt="..."
  format="webp"  // Default, can override
/>
```

---

## 📊 Build Output

When you run `npm run build`, Astro:

1. **Optimizes imported assets:**
   ```
   ✓ Generating optimized images
   ▶ /assets/bear-cave-logo-yXXi825t_ZhtHMx.webp
   ▶ /assets/kando-knox-karate-man-DPy7JbYX_ZgPCFw.webp
   ▶ /assets/kando-knox-karate-girl-C9s7ZH_g_Z1TwQmT.webp
   ```

2. **Copies public files as-is:**
   - Files in `public/` are copied to `dist/` unchanged
   - No optimization applied

---

## ✅ Completed

1. ✅ **All images moved to assets**
   - All images in `src/assets/img/` are optimized
   - Image mapping system created (`src/utils/imageMap.ts`)
   - `OptimizedImage` component automatically resolves paths to assets

2. ✅ **Components updated**
   - `HomeHero.astro` uses optimized images
   - `PageTemplate.astro` uses optimized images
   - All components using `OptimizedImage` benefit from optimization

3. ✅ **Build-time optimization**
   - 37 images optimized to WebP during build
   - All images automatically converted via `imageMap.ts`

---

## 📝 Example Migration

### Before (Not Optimized)

```astro
<!-- heroSlider.json -->
{
  "image": "/img/hero/karate-kando-knox.jpg"
}

<!-- HomeHero.astro -->
<div style={`background-image: url(${slide.image})`}>
```

**Result:** JPG served as-is, no optimization

### After (Fully Optimized)

```astro
<!-- heroSlider.json -->
{
  "image": "karate-kando-knox.jpg"  // Just filename
}

<!-- HomeHero.astro -->
---
import heroImages from "../assets/img/hero/*.{jpg,jpeg,png}";
const getHeroImage = (filename) => {
  return Object.values(heroImages).find(img => 
    img.src.includes(filename)
  );
};
---
<div style={`background-image: url(${getHeroImage(slide.image).src})`}>
```

**Result:** WebP generated, optimized, responsive

---

## ⚡ Quick Win: Update OptimizedImage Default

Already done! ✅
- `OptimizedImage` now defaults to `format="webp"`
- All imported assets will use WebP
- String paths still work but won't be optimized

---

## 🔍 Verification

After moving images to assets:

1. **Check build output:**
   ```bash
   npm run build | grep "optimized images"
   # Should show many WebP files
   ```

2. **Check dist folder:**
   ```bash
   ls -lh dist/assets/*.webp
   # Should see optimized WebP files
   ```

3. **Check Lighthouse:**
   - Image size warnings should decrease
   - Performance score should improve
   - LCP should improve

---

## 📚 Resources

- [Astro Image Optimization Docs](https://docs.astro.build/en/guides/images/)
- [Sharp Image Service](https://docs.astro.build/en/guides/images/#sharp)
- [Image Component API](https://docs.astro.build/en/reference/image/)

---

## ✅ Summary

**Current State:**
- ✅ Astro configured to use Sharp
- ✅ Images in `src/assets/` are optimized (WebP)
- ⚠️ Images in `public/` are NOT optimized (JPG/PNG)

**Best Practice:**
- ✅ Let Astro optimize during build
- ✅ Move all images to `src/assets/`
- ✅ Use asset imports everywhere
- ✅ Default to WebP format

**Next Steps:**
1. Move images from `public/` to `src/assets/`
2. Update all references to use imports
3. Verify build output shows WebP files
4. Test Lighthouse scores improve
