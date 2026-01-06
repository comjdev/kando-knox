# AWS Setup Guide for Kando Knox Deployment

This guide walks you through setting up AWS services required for deploying the Kando Knox website using GitHub Actions.

## Prerequisites

- AWS Account
- Domain name: `knoxmartialarts.com.au` (already configured)
- GitHub repository with Actions enabled

## Overview

The deployment uses:

- **S3 Bucket**: Stores static website files
- **CloudFront Distribution**: CDN for fast global delivery
- **IAM User**: For GitHub Actions to deploy
- **Route 53** (optional): DNS management (if using AWS DNS)

---

## Step 1: Create S3 Bucket

### 1.1 Create the Bucket

1. Go to [AWS S3 Console](https://console.aws.amazon.com/s3/)
2. Click **"Create bucket"**
3. Configure:
   - **Bucket name**: `knoxmartialarts.com.au` (or your preferred name)
   - **AWS Region**: `ap-southeast-2` (Sydney) - matches your workflow
   - **Object Ownership**: ACLs disabled (recommended)
   - **Block Public Access**: **Uncheck all** (we'll use CloudFront, but need public read)
   - **Bucket Versioning**: Enable (recommended for rollback capability)
   - **Default encryption**: Enable (SSE-S3 or SSE-KMS)

4. Click **"Create bucket"**

### 1.2 Configure Bucket Policy

1. Go to your bucket → **Permissions** tab
2. Click **"Bucket policy"**
3. Add this policy (replace `YOUR_BUCKET_NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

4. Click **"Save changes"**

### 1.3 Configure Static Website Hosting (Optional - CloudFront will handle this)

1. Go to **Properties** tab
2. Scroll to **Static website hosting**
3. Click **"Edit"**
4. Enable static website hosting
5. Set **Index document**: `index.html`
6. Set **Error document**: `404.html` (or `index.html` for SPA routing)
7. Click **"Save changes"**

**Note**: CloudFront will serve the content, so this is mainly for reference.

---

## Step 2: Create CloudFront Distribution

### 2.1 Create Distribution

1. Go to [AWS CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click **"Create distribution"**
3. Configure **Origin**:
   - **Origin domain**: Select your S3 bucket (e.g., `knoxmartialarts.com.au.s3.ap-southeast-2.amazonaws.com`)
   - **Origin access**: Choose **"Origin access control settings (recommended)"**
   - Click **"Create control setting"**:
     - **Name**: `knoxmartialarts-oac`
     - **Signing behavior**: `Sign requests (recommended)`
     - **Origin type**: `S3`
     - Click **"Create"**
   - **Origin access control**: Select the control setting you just created
   - **Origin name**: Auto-filled
   - **Origin path**: Leave empty

4. Configure **Default cache behavior**:
   - **Viewer protocol policy**: `Redirect HTTP to HTTPS`
   - **Allowed HTTP methods**: `GET, HEAD, OPTIONS`
   - **Cache policy**: `CachingOptimized` (or create custom)
   - **Origin request policy**: `None` (or `CORS-S3Origin` if needed)
   - **Response headers policy**: `SecurityHeadersPolicy` (recommended)
   - **Compress objects automatically**: ✅ **Enable** (This enables Brotli/Gzip compression)
     - CloudFront automatically compresses HTML, CSS, JS, JSON, SVG, XML, and other text-based files
     - Brotli compression is used when supported by the browser (better compression)
     - Gzip is used as fallback for older browsers
     - **Impact**: Reduces bandwidth usage by 20-70% for text-based files

5. Configure **Settings**:
   - **Price class**: `Use only North America and Europe` (or `Use all edge locations` for best performance)
   - **Alternate domain names (CNAMEs)**:
     - `knoxmartialarts.com.au`
     - `www.knoxmartialarts.com.au` (if using www)
   - **SSL certificate**:
     - If you have a certificate in ACM: Select it
     - If not: Request one in ACM first (see Step 3)
   - **Default root object**: `index.html`
   - **Custom error responses**:
     - **HTTP Error Code**: `404`
     - **Response page path**: `/index.html`
     - **HTTP Response Code**: `200`
     - (Repeat for `403` if needed)

6. Click **"Create distribution"**
7. **Wait 5-15 minutes** for distribution to deploy
8. **Copy the Distribution ID** (you'll need it for GitHub secrets)

### 2.2 Update S3 Bucket Policy for CloudFront OAC

After creating CloudFront, you need to update the S3 bucket policy:

1. Go to CloudFront → Your distribution → **Origins** tab
2. Click on your origin → **Edit**
3. Scroll to **Origin access control** → Click **"Copy policy"**
4. Go to S3 → Your bucket → **Permissions** → **Bucket policy**
5. **Replace** the existing policy with the copied policy
6. Click **"Save changes"**

### 2.3 Configure CloudFront Function (Optional - for Academy Redirect)

If you want to use the CloudFront Function for academy redirect:

1. Go to CloudFront → **Functions**
2. Click **"Create function"**
3. **Name**: `academy-redirect`
4. **Runtime**: `cloudfront-js-1.0`
5. **Function code**: Copy from `cloudfront-functions/academy-redirect.js`
6. Click **"Create function"**
7. Go to your distribution → **Behaviors** tab
8. Edit the default behavior (or create new for `/academy/*`)
9. Scroll to **Function associations**:
   - **Viewer request**: Select `academy-redirect`
10. Click **"Save changes"**

---

## Step 3: Request SSL Certificate (ACM)

### 3.1 Request Certificate

1. Go to [AWS Certificate Manager](https://console.aws.amazon.com/acm/)
2. Make sure you're in **US East (N. Virginia)** region (required for CloudFront)
3. Click **"Request certificate"**
4. Choose **"Request a public certificate"**
5. **Domain names**:
   - `knoxmartialarts.com.au`
   - `*.knoxmartialarts.com.au` (wildcard for subdomains)
6. **Validation method**: `DNS validation` (recommended)
7. Click **"Request"**

### 3.2 Validate Certificate

1. In ACM, click on your certificate
2. Expand **"Domains"**
3. For each domain, click **"Create record in Route 53"** (if using Route 53) or manually add the CNAME records to your DNS provider
4. Wait for validation (usually 5-30 minutes)
5. Status will change to **"Issued"**

### 3.3 Update CloudFront Distribution

1. Go back to CloudFront → Your distribution → **General** tab
2. Click **"Edit"**
3. Under **Alternate domain names (CNAMEs)**, add your domains
4. Under **Custom SSL certificate**, select your ACM certificate
5. Click **"Save changes"**

---

## Step 4: Configure DNS (Route 53 or External DNS)

### Option A: Using Route 53

1. Go to [Route 53](https://console.aws.amazon.com/route53/)
2. Click **"Hosted zones"**
3. Find or create hosted zone for `knoxmartialarts.com.au`
4. Create **A record**:
   - **Name**: `@` (or leave blank for root domain)
   - **Type**: `A`
   - **Alias**: Yes
   - **Route traffic to**: `CloudFront distribution`
   - **Distribution**: Select your CloudFront distribution
   - Click **"Create records"**
5. Create **CNAME record** for www (if needed):
   - **Name**: `www`
   - **Type**: `CNAME`
   - **Value**: Your CloudFront domain (e.g., `d1a2zyku2pp97h.cloudfront.net`)

### Option B: Using External DNS Provider

1. Log into your DNS provider (e.g., GoDaddy, Namecheap, etc.)
2. Create **A record**:
   - **Name**: `@` (or root domain)
   - **Type**: `A`
   - **Value**: Your CloudFront domain (e.g., `d1a2zyku2pp97h.cloudfront.net`)
   - **TTL**: `300` (5 minutes)
3. Create **CNAME record** for www (if needed):
   - **Name**: `www`
   - **Type**: `CNAME`
   - **Value**: Your CloudFront domain

**Note**: DNS propagation can take 24-48 hours, but usually happens within minutes.

---

## Step 5: Create IAM User for GitHub Actions

### 5.1 Create IAM User

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click **"Users"** → **"Create user"**
3. **User name**: `github-actions-knoxmartialarts`
4. **Provide user access**: Choose **"Attach policies directly"**
5. Click **"Next"**

### 5.2 Create Custom Policy

1. Click **"Create policy"**
2. Switch to **JSON** tab
3. Paste this policy (replace `YOUR_BUCKET_NAME` and `YOUR_DISTRIBUTION_ID`):

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
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/E2KQPRB95U6ILH"
    }
  ]
}
```

4. Click **"Next"** → **"Next"**
5. **Policy name**: `GitHubActionsKnoxMartialArtsDeploy`
6. Click **"Create policy"**

### 5.3 Attach Policy to User

1. Go back to user creation
2. Refresh policies
3. Search for `GitHubActionsKnoxMartialArtsDeploy`
4. Select it
5. Click **"Next"** → **"Create user"**

### 5.4 Create Access Keys

1. Click on the user you just created
2. Go to **"Security credentials"** tab
3. Scroll to **"Access keys"**
4. Click **"Create access key"**
5. **Use case**: `Application running outside AWS`
6. Click **"Next"** → **"Create access key"**
7. **IMPORTANT**: Copy both:
   - **Access key ID**
   - **Secret access key** (only shown once!)

---

## Step 6: Configure GitHub Secrets

### 6.1 Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **"Settings"** → **"Secrets and variables"** → **"Actions"**
3. Click **"New repository secret"**
4. Add these secrets:

| Secret Name                  | Value                           | Description                     |
| ---------------------------- | ------------------------------- | ------------------------------- |
| `AWS_ACCESS_KEY_ID`          | Your IAM user access key ID     | From Step 5.4                   |
| `AWS_SECRET_ACCESS_KEY`      | Your IAM user secret access key | From Step 5.4                   |
| `S3_BUCKET_NAME`             | `knoxmartialarts.com.au`        | Your S3 bucket name             |
| `CLOUDFRONT_DISTRIBUTION_ID` | `E1234567890ABC`                | Your CloudFront distribution ID |

### 6.2 Verify Secrets

Double-check that all secrets are set correctly. The workflow will fail if any are missing.

---

## Step 7: Test Deployment

### 7.1 Trigger Deployment

1. Make a small change to your code
2. Commit and push to `main` branch
3. Go to GitHub → **"Actions"** tab
4. Watch the workflow run

### 7.2 Verify Deployment

1. Wait for workflow to complete (usually 2-5 minutes)
2. Check CloudFront distribution → **Invalidations** tab (should see new invalidation)
3. Visit your site: `https://knoxmartialarts.com.au`
4. Check browser console for errors
5. Test navigation and ViewTransitions

---

## Step 8: Monitor and Optimize

### 8.1 CloudFront Monitoring

1. Go to CloudFront → Your distribution → **Monitoring** tab
2. Check:
   - **Requests**: Should see traffic
   - **Data transfer**: Monitor costs
   - **Error rates**: Should be low (< 1%)

### 8.2 S3 Monitoring

1. Go to S3 → Your bucket → **Metrics** tab
2. Monitor:
   - **Bucket size**: Should grow with deployments
   - **Number of objects**: Should match your site files

### 8.3 Cost Optimization

- **CloudFront**: First 1TB/month free, then $0.085/GB
- **S3**: First 5GB free, then $0.023/GB/month
- **Data Transfer**: First 1GB/month free
- **Estimated monthly cost**: $5-20 for small-medium sites

---

## Troubleshooting

### Deployment Fails

1. **Check GitHub Actions logs**: Look for error messages
2. **Verify IAM permissions**: Ensure user has correct policies
3. **Check S3 bucket name**: Must match exactly
4. **Verify CloudFront ID**: Must be correct

### Site Not Loading

1. **Check DNS**: Use `dig knoxmartialarts.com.au` or `nslookup`
2. **Check CloudFront status**: Distribution must be "Deployed"
3. **Check SSL certificate**: Must be validated
4. **Clear browser cache**: Hard refresh (Cmd+Shift+R)

### CloudFront Not Updating

1. **Check invalidation status**: CloudFront → Invalidations
2. **Wait 5-15 minutes**: Invalidations take time
3. **Check cache headers**: Ensure files have correct cache-control

### 404 Errors

1. **Check S3 bucket**: Files must exist
2. **Check CloudFront error pages**: Configure 404 → index.html
3. **Check routing**: Astro ViewTransitions should handle routing

---

## Security Best Practices

1. **Never commit AWS credentials** to Git
2. **Use IAM roles** instead of access keys when possible (not available for GitHub Actions)
3. **Rotate access keys** every 90 days
4. **Enable MFA** on AWS account
5. **Use least privilege** IAM policies
6. **Enable CloudFront logging** for security monitoring
7. **Use WAF** (Web Application Firewall) for additional protection

---

## Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [GitHub Actions AWS Documentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/)

---

## Quick Reference

### Important Values to Save

- **S3 Bucket Name**: `knoxmartialarts.com.au`
- **CloudFront Distribution ID**: `E1234567890ABC` (from CloudFront console)
- **CloudFront Domain**: `d1a2zyku2pp97h.cloudfront.net` (from CloudFront console)
- **AWS Region**: `ap-southeast-2` (Sydney)
- **IAM User**: `github-actions-knoxmartialarts`

### GitHub Secrets Required

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
S3_BUCKET_NAME
CLOUDFRONT_DISTRIBUTION_ID
```

---

**Last Updated**: 2025-01-XX
**Maintained by**: Development Team
