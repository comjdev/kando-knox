# AWS S3 & CloudFront Deployment Setup

## Overview

This document outlines the GitHub Actions workflow for deploying to AWS S3 and invalidating CloudFront, with best practices for caching and image optimization.

## ✅ Image Optimization Strategy

**Best Practice:** Let Astro handle image optimization during build (not in GitHub Actions)

### Why Astro's Image Optimization is Better:

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

### Current Setup:

- **Images in `src/assets/`**: ✅ Fully optimized by Astro (WebP/AVIF)
- **Images in `public/`**: ⚠️ Not optimized (served as-is)
  - **Solution**: Move images to `src/assets/` and import them
  - **Alternative**: Use CloudFront image transformation (see below)

### Image Optimization Configuration:

```javascript
// astro.config.mjs
export default defineConfig({
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: false,
      },
    },
  },
});
```

**Sharp Service:**

- Faster than Squoosh (default)
- Better quality
- Requires `sharp` package (installed automatically by Astro)

---

## 🚀 GitHub Actions Workflow

### Required GitHub Secrets

Add these secrets in your GitHub repository settings:

1. **`AWS_ACCESS_KEY_ID`**
   - AWS IAM user access key
   - Needs S3 upload and CloudFront invalidation permissions

2. **`AWS_SECRET_ACCESS_KEY`**
   - AWS IAM user secret key

3. **`S3_BUCKET_NAME`**
   - Your S3 bucket name (e.g., `knoxmartialarts.com.au`)

4. **`CLOUDFRONT_DISTRIBUTION_ID`**
   - Your CloudFront distribution ID (e.g., `E1234567890ABC`)

### IAM Policy Required

Your AWS IAM user needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME/*",
        "arn:aws:s3:::YOUR_BUCKET_NAME"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "*"
    }
  ]
}
```

---

## 📦 Cache Headers Strategy

### HTML Files

- **Cache:** `public, max-age=86400, s-maxage=86400` (1 day)
- **Reason:** Site updates monthly on average, short cache improves performance
- **Note:** CloudFront invalidation ensures fresh content after deployments

### CSS & JavaScript

- **Cache:** `public, max-age=31536000, immutable` (1 year)
- **Reason:** Filenames include hash, safe to cache forever
- **Impact:** Faster repeat visits, better performance

### Images (WebP, AVIF, JPG, PNG)

- **Cache:** `public, max-age=31536000, immutable` (1 year)
- **Reason:** Images don't change often, hash-based filenames
- **Impact:** Faster page loads, reduced bandwidth

### Fonts

- **Cache:** `public, max-age=31536000, immutable` (1 year)
- **Reason:** Fonts rarely change, hash-based filenames

### Other Assets

- **Cache:** `public, max-age=604800` (1 week)
- **Reason:** Default for unknown file types

---

## 🔧 Workflow Features

### Automatic Deployment

- Triggers on push to `main` branch
- Can also be triggered manually via `workflow_dispatch`

### Build Process

1. Checks out code
2. Sets up Node.js (v20)
3. Installs dependencies (with npm cache)
4. Builds project (Astro optimizes images here)
5. Uploads to S3 with proper cache headers
6. Invalidates CloudFront cache

### File Type Handling

- Different cache headers for different file types
- Proper content-type headers
- Efficient S3 sync (only uploads changed files)

---

## 🖼️ Image Optimization Best Practices

### ✅ Recommended: Move Images to Assets

**Current State:**

- Some images in `src/assets/img/` (optimized ✅)
- Many images in `public/img/` (not optimized ⚠️)

**Best Practice:**

1. Move all images from `public/img/` to `src/assets/img/`
2. Update JSON/MD files to reference asset imports
3. Use Astro's Image component everywhere
4. Astro will automatically:
   - Convert to WebP/AVIF
   - Generate responsive srcsets
   - Optimize file sizes
   - Add proper attributes

**Example:**

```astro
<!-- Before (public folder - not optimized) -->
<img src="/img/hero.jpg" alt="..." />

<!-- After (assets folder - fully optimized) -->
--- import heroImage from "../assets/img/hero.jpg"; ---
<Image src={heroImage} alt="..." format="webp" />
```

### Alternative: CloudFront Image Transformation

If you must keep images in `public/`:

- Use CloudFront's image transformation features
- Configure Lambda@Edge for on-the-fly conversion
- More complex, less efficient than build-time optimization

---

## 📋 Setup Checklist

### GitHub Repository

- [ ] Add `AWS_ACCESS_KEY_ID` secret
- [ ] Add `AWS_SECRET_ACCESS_KEY` secret
- [ ] Add `S3_BUCKET_NAME` secret
- [ ] Add `CLOUDFRONT_DISTRIBUTION_ID` secret

### AWS Setup

- [ ] Create S3 bucket
- [ ] Configure S3 bucket for static website hosting (or use CloudFront)
- [ ] Create CloudFront distribution pointing to S3
- [ ] Create IAM user with required permissions
- [ ] Get IAM user access keys

### Image Optimization

- [ ] Move images from `public/` to `src/assets/` (recommended)
- [ ] Update all image references to use imports
- [ ] Verify Sharp is installed (Astro installs automatically)
- [ ] Test build to ensure images are optimized

---

## 🚨 Important Notes

### Image Optimization

- **Astro optimizes images during build** - no need for GitHub Actions conversion
- **Images in `public/` are NOT optimized** - move to `src/assets/` for optimization
- **Sharp service is recommended** - faster and better quality than Squoosh

### Cache Strategy

- HTML files: 1 day cache (site updates monthly, CloudFront invalidation ensures freshness)
- Assets with hashes: 1 year cache (immutable)
- Other files: 1 week cache (default)

### CloudFront Invalidation

- Invalidates all paths (`/*`) after deployment
- Ensures users get latest content immediately
- Takes 1-5 minutes to complete

---

## 🔍 Verification

After deployment, verify:

1. **Images are WebP:**

   ```bash
   curl -I https://knoxmartialarts.com.au/assets/image.webp
   # Should return Content-Type: image/webp
   ```

2. **Cache Headers:**

   ```bash
   curl -I https://knoxmartialarts.com.au/assets/style.css
   # Should return Cache-Control: public, max-age=31536000, immutable
   ```

3. **CloudFront Invalidation:**
   - Check CloudFront console for invalidation status
   - Should complete within 1-5 minutes

---

## 📝 Next Steps

1. **Move remaining images to assets** (if not done)
2. **Set up GitHub secrets** (required for deployment)
3. **Configure AWS IAM user** (required for deployment)
4. **Test deployment** (push to main branch)
5. **Monitor CloudFront invalidation** (check AWS console)

---

## 🆘 Troubleshooting

### Build Fails

- Check Node.js version (should be 20)
- Verify all dependencies installed
- Check for TypeScript errors

### S3 Upload Fails

- Verify AWS credentials are correct
- Check IAM permissions
- Ensure bucket name is correct

### CloudFront Invalidation Fails

- Verify distribution ID is correct
- Check IAM permissions include CloudFront
- Ensure distribution exists

### Images Not Optimized

- Verify images are in `src/assets/` (not `public/`)
- Check that images are imported (not string paths)
- Verify Sharp is installed: `npm list sharp`
- Check build output for "Generating optimized images"
