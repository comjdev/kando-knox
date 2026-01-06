# AWS Setup Checklist

Use this checklist to ensure all AWS services are configured correctly.

## Pre-Deployment Checklist

### S3 Bucket
- [ ] S3 bucket created: `knoxmartialarts.com.au`
- [ ] Region set to: `ap-southeast-2` (Sydney)
- [ ] Public access enabled (for CloudFront)
- [ ] Bucket policy configured (allows CloudFront OAC)
- [ ] Versioning enabled (optional but recommended)
- [ ] Encryption enabled

### CloudFront Distribution
- [ ] Distribution created
- [ ] Origin points to S3 bucket
- [ ] Origin Access Control (OAC) configured
- [ ] S3 bucket policy updated with OAC policy
- [ ] SSL certificate attached (from ACM)
- [ ] Alternate domain names configured:
  - [ ] `knoxmartialarts.com.au`
  - [ ] `www.knoxmartialarts.com.au` (if using)
- [ ] Default root object: `index.html`
- [ ] Error pages configured (404 → index.html)
- [ ] Distribution status: **Deployed** (not "In Progress")
- [ ] Distribution ID copied: `E_____________`

### SSL Certificate (ACM)
- [ ] Certificate requested in **US East (N. Virginia)** region
- [ ] Domains added:
  - [ ] `knoxmartialarts.com.au`
  - [ ] `*.knoxmartialarts.com.au` (wildcard)
- [ ] DNS validation records added to DNS provider
- [ ] Certificate status: **Issued**
- [ ] Certificate attached to CloudFront distribution

### DNS Configuration
- [ ] A record created pointing to CloudFront
- [ ] CNAME record for www (if using)
- [ ] DNS propagation verified (use `dig` or `nslookup`)
- [ ] SSL certificate validation records added

### IAM User
- [ ] IAM user created: `github-actions-knoxmartialarts`
- [ ] Custom policy created with S3 and CloudFront permissions
- [ ] Policy attached to user
- [ ] Access keys created
- [ ] Access key ID copied
- [ ] Secret access key copied (only shown once!)

### GitHub Secrets
- [ ] `AWS_ACCESS_KEY_ID` added
- [ ] `AWS_SECRET_ACCESS_KEY` added
- [ ] `S3_BUCKET_NAME` added: `knoxmartialarts.com.au`
- [ ] `CLOUDFRONT_DISTRIBUTION_ID` added

### CloudFront Function (Optional)
- [ ] Function created: `academy-redirect`
- [ ] Code copied from `cloudfront-functions/academy-redirect.js`
- [ ] Function associated with `/academy/*` path behavior

## Post-Deployment Verification

### First Deployment
- [ ] GitHub Actions workflow runs successfully
- [ ] Files uploaded to S3 bucket
- [ ] CloudFront invalidation created
- [ ] Site loads at `https://knoxmartialarts.com.au`
- [ ] HTTPS working (no mixed content warnings)
- [ ] Navigation works
- [ ] ViewTransitions work
- [ ] No console errors

### Performance Check
- [ ] Page load time < 3 seconds
- [ ] Images loading correctly
- [ ] CSS/JS loading correctly
- [ ] CloudFront cache working (check response headers)

### Functionality Check
- [ ] All pages accessible
- [ ] Forms working (if any)
- [ ] External links working
- [ ] Academy redirect working (if configured)
- [ ] Mobile navigation working
- [ ] Dark mode toggle working

## Monthly Maintenance

- [ ] Review CloudFront costs
- [ ] Review S3 storage costs
- [ ] Check for outdated files in S3
- [ ] Verify SSL certificate expiration (renew if needed)
- [ ] Rotate IAM access keys (every 90 days)
- [ ] Review CloudFront access logs

## Emergency Contacts

- **AWS Support**: https://console.aws.amazon.com/support/
- **GitHub Support**: https://support.github.com/
- **Domain Registrar**: [Your DNS provider]

---

**Quick Links**:
- [S3 Console](https://console.aws.amazon.com/s3/)
- [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
- [IAM Console](https://console.aws.amazon.com/iam/)
- [ACM Console](https://console.aws.amazon.com/acm/)
- [Route 53 Console](https://console.aws.amazon.com/route53/)

