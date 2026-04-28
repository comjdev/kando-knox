# CloudFront Redirect Function Setup

Two function variants (both include index-document rewrite for S3):

| File | Purpose |
|------|---------|
| **www-to-apex-redirect.js** | **Permanent** – www → apex + /academy + index-document |
| **www-to-apex-redirect-with-legacy.js** | **Temporary** – same + legacy path redirects |

Combined into one function because CloudFront allows only **one** viewer-request function per behavior.

**Cost:** CloudFront Functions are very cheap – ~$0.10 per 1M invocations, with 2M free/month. For a typical site this is negligible.

**Now:** Deploy `www-to-apex-redirect-with-legacy.js` (includes legacy redirects for old site URLs).

**When Google has reindexed:** Switch to `www-to-apex-redirect.js` and remove legacy logic.

See [OLD-SITE-REDIRECT-MAPPING.md](./OLD-SITE-REDIRECT-MAPPING.md) for the full legacy mapping.

## Prerequisites

Before deploying the function, ensure:

1. **ACM Certificate** (US East N. Virginia) covers:
   - `knoxmartialarts.com.au`
   - `*.knoxmartialarts.com.au` (covers www)

2. **CloudFront Distribution** has both domains in Alternate domain names (CNAMEs):
   - `knoxmartialarts.com.au`
   - `www.knoxmartialarts.com.au`

3. **Route 53** (or your DNS) points both apex and www to the CloudFront distribution

---

## Step 1: Create the CloudFront Function

1. Go to **[AWS CloudFront Console](https://console.aws.amazon.com/cloudfront/v3/home#/functions)** → **Functions** (in the left sidebar under "Developers")
2. Click **Create function**
3. **Name**: `www-to-apex-redirect` (or `viewer-redirects`)
4. **Description** (optional): `Redirects www to apex, and /academy to external URL`
5. **Runtime**: `cloudfront-js-1.0`
6. In the **Code** editor, paste the contents of:
   - **Now (with legacy):** `cloudfront-functions/www-to-apex-redirect-with-legacy.js`
   - **After reindex:** `cloudfront-functions/www-to-apex-redirect.js`
7. Click **Save changes**
8. Click **Publish** to deploy the function (required before associating with a distribution)

---

## Step 2: Associate with CloudFront Distribution

1. Go to **CloudFront** → **Distributions**
2. Click your distribution ID: **E1JKX3VR32CAIT**
3. Open the **Behaviors** tab
4. Select the **default** behavior (path pattern `Default (*)`) → **Edit**
5. Scroll to **Function associations**
6. Under **Viewer request**:
   - **Function type**: CloudFront Functions
   - **Function**: Select `www-to-apex-redirect`
7. Click **Save changes**

**Note:** If you previously had `academy-redirect` attached, replace it with this new function—it handles both www redirect and academy redirect.

---

## Step 3: Verify CloudFront Configuration

1. In your distribution, go to the **General** tab → **Edit**
2. Under **Alternate domain names (CNAMEs)**, confirm you have:
   - `knoxmartialarts.com.au`
   - `www.knoxmartialarts.com.au`
3. Under **Custom SSL certificate**, ensure your ACM certificate is selected (must cover both domains)
4. Save if you made changes

---

## Step 4: Verify DNS (Route 53 or External)

Both apex and www must point to your CloudFront distribution:

| Record Type | Name | Target |
|-------------|------|--------|
| A (Alias)   | (blank/apex) | CloudFront distribution |
| A (Alias)   | www  | CloudFront distribution |

For Route 53: Use **Alias** and select your CloudFront distribution for both records.

---

## Step 5: Create Cache Invalidation (Optional)

To clear any cached responses:

1. CloudFront → Your distribution → **Invalidations** tab
2. **Create invalidation**
3. **Object paths**: `/*`
4. **Create invalidation**

---

## Testing

After 1–2 minutes:

- `https://www.knoxmartialarts.com.au` → 301 to `https://knoxmartialarts.com.au`
- `https://knoxmartialarts.com.au/contact-us` → 301 to `https://knoxmartialarts.com.au/contact`
- `https://knoxmartialarts.com.au/teens-martial-arts` → 301 to `https://knoxmartialarts.com.au/programs/adult-martial-arts-karate-knox`
- `https://knoxmartialarts.com.au/product/foo` → 301 to `https://shop.knoxmartialarts.com.au/product/foo`
- `https://knoxmartialarts.com.au/academy` → 301 to the academy URL

```bash
curl -I https://www.knoxmartialarts.com.au
curl -I https://knoxmartialarts.com.au/contact-us
```

## Updating the Function

1. CloudFront → Functions → select `www-to-apex-redirect`
2. Paste the new code (from `www-to-apex-redirect-with-legacy.js` or `www-to-apex-redirect.js`)
3. Click **Save changes** → **Publish**
4. (Optional) Create cache invalidation `/*`

## Removing Legacy Redirects (After Google Reindex)

1. Open the function in AWS Console
2. Replace the code with `www-to-apex-redirect.js` (permanent-only version)
3. Save and Publish
4. Delete or archive `cloudfront-functions/legacy-path-redirects.js` and `www-to-apex-redirect-with-legacy.js` from the repo

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| www still serves content (no redirect) | Function associated on Viewer request? Function published? |
| SSL certificate error on www | ACM cert in us-east-1? Covers `*.knoxmartialarts.com.au`? |
| www doesn't resolve | DNS A/ALIAS record for www pointing to CloudFront? |
| Academy redirect broken | Function code has correct academy URL (`cf.knoxmartialarts.com.au`)? |
