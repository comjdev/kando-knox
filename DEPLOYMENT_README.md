# AWS S3 & CloudFront Deployment - Setup Guide

## ✅ Setup Complete

GitHub Actions workflow is configured to:

- Build the project (Astro optimizes images automatically)
- Upload to S3 with proper cache headers
- Invalidate CloudFront CDN

---

## 🔐 Required GitHub Secrets

Add these in your GitHub repository: **Settings → Secrets and variables → Actions**

1. **`AWS_ACCESS_KEY_ID`**
   - Your AWS IAM user access key

2. **`AWS_SECRET_ACCESS_KEY`**
   - Your AWS IAM user secret key

3. **`S3_BUCKET_NAME`**
   - Your S3 bucket name (e.g., `knoxmartialarts.com.au`)

4. **`CLOUDFRONT_DISTRIBUTION_ID`**
   - Your CloudFront distribution ID (e.g., `E1234567890ABC`)

---

## 🛠️ AWS IAM User Setup

Create an IAM user with this policy:

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

## 📦 Cache Headers (Best Practices)

### HTML, XML, TXT

- **Cache:** `public, max-age=86400, s-maxage=86400` (1 day)
- **Reason:** Site updates monthly on average, short cache improves performance
- **Note:** CloudFront invalidation ensures fresh content after deployments

### CSS & JavaScript

- **Cache:** `public, max-age=31536000, immutable` (1 year)
- **Reason:** Filenames include hash, safe to cache forever

### Images (WebP, AVIF, JPG, PNG)

- **Cache:** `public, max-age=31536000, immutable` (1 year)
- **Reason:** Images don't change often, hash-based filenames

### Fonts

- **Cache:** `public, max-age=31536000, immutable` (1 year)
- **Reason:** Fonts rarely change

---

## 🖼️ Image Optimization

### ✅ How It Works

**Astro optimizes images during build:**

- Images in `src/assets/` → ✅ Converted to WebP/AVIF
- Images in `public/` → ⚠️ Served as-is (not optimized)

**Current Status:**

- ✅ Astro configured to use Sharp (fast, high quality)
- ✅ `OptimizedImage` component defaults to WebP
- ✅ Images in `src/assets/` are optimized
- ⚠️ Images in `public/` need to be moved to `src/assets/` for optimization

### 📋 To Fix Lighthouse Image Warnings

**Option 1: Move Images to Assets (Recommended)**

1. Move images from `public/img/` to `src/assets/img/`
2. Update JSON/MD files to use asset imports
3. Astro will automatically optimize them to WebP

**Option 2: Use CloudFront Image Transformation**

- Configure CloudFront to convert images on-the-fly
- More complex, less efficient than build-time optimization

See `IMAGE_OPTIMIZATION_GUIDE.md` for detailed instructions.

---

## 🚀 Deployment Process

### Automatic (on push to main)

1. Code pushed to `main` branch
2. GitHub Actions triggers
3. Builds project (Astro optimizes images)
4. Uploads to S3 with cache headers
5. Invalidates CloudFront

### Manual (workflow_dispatch)

1. Go to **Actions** tab in GitHub
2. Select **Deploy to S3 and Invalidate CloudFront**
3. Click **Run workflow**

---

## ✅ Verification

After deployment:

1. **Check S3 bucket:**
   - Files should be uploaded
   - Cache headers should be set correctly

2. **Check CloudFront:**
   - Invalidation should be in progress
   - Takes 1-5 minutes to complete

3. **Check website:**
   - Visit https://knoxmartialarts.com.au
   - Verify images are loading
   - Check browser DevTools → Network → Response Headers
   - Verify cache headers are correct

---

## 📝 Files Created

- ✅ `.github/workflows/deploy.yml` - GitHub Actions workflow
- ✅ `DEPLOYMENT_SETUP.md` - Detailed deployment documentation
- ✅ `IMAGE_OPTIMIZATION_GUIDE.md` - Image optimization guide

---

## 🆘 Troubleshooting

### Build fails

- Check Node.js version (should be 20)
- Verify dependencies: `npm ci`
- Check for TypeScript errors

### S3 upload fails

- Verify AWS credentials
- Check IAM permissions
- Ensure bucket name is correct

### CloudFront invalidation fails

- Verify distribution ID
- Check IAM permissions include CloudFront

### Images not optimized

- Verify images are in `src/assets/` (not `public/`)
- Check that images are imported (not string paths)
- See `IMAGE_OPTIMIZATION_GUIDE.md`

---

## 📚 Next Steps

1. **Add GitHub secrets** (required)
2. **Set up AWS IAM user** (required)
3. **Test deployment** (push to main or manual trigger)
4. **Move images to assets** (to fix Lighthouse warnings)
5. **Monitor deployment** (check Actions tab)

---

## ✨ Summary

✅ **GitHub Actions workflow:** Ready to deploy
✅ **Cache headers:** Best practices configured
✅ **Image optimization:** Astro handles it during build
⚠️ **Remaining work:** Move images from `public/` to `src/assets/` for full optimization

**Best Practice Confirmed:** ✅ Let Astro optimize images during build (not in GitHub Actions)
