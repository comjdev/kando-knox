# Deployment Summary

## Quick Start

1. **Read the full guide**: [AWS Setup Guide](./aws-setup-guide.md)
2. **Use the checklist**: [AWS Setup Checklist](./aws-setup-checklist.md)
3. **Configure GitHub Secrets** (see below)
4. **Push to main branch** to trigger deployment

## GitHub Secrets Required

Add these in: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Description | Example |
|--------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | IAM user access key | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `S3_BUCKET_NAME` | Your S3 bucket name | `knoxmartialarts.com.au` |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID | `E1234567890ABC` |

## Deployment Flow

```
GitHub Push (main branch)
    ↓
GitHub Actions Workflow Triggered
    ↓
Build Astro Site (npm run build)
    ↓
Upload Files to S3 (with cache headers)
    ↓
Invalidate CloudFront Cache
    ↓
Site Updated (5-15 minutes)
```

## File Upload Strategy

The workflow uploads files with different cache strategies:

- **HTML/XML/TXT**: 1 day cache (frequent updates)
- **CSS/JS**: 1 year cache (immutable, hashed filenames)
- **Images**: 1 year cache (immutable)
- **Fonts**: 1 year cache (immutable)
- **Other assets**: 1 week cache

CloudFront invalidation ensures fresh content after each deployment.

## AWS Services Used

1. **S3**: Static file storage
2. **CloudFront**: CDN and HTTPS termination
3. **ACM**: SSL certificate management
4. **IAM**: Access control for GitHub Actions
5. **Route 53** (optional): DNS management

## Estimated Monthly Costs

- **S3 Storage**: ~$0.10/month (small site)
- **CloudFront**: ~$5-15/month (depending on traffic)
- **Data Transfer**: ~$0-5/month
- **Total**: ~$5-20/month for small-medium sites

## Troubleshooting

### Deployment Fails
- Check GitHub Actions logs
- Verify all secrets are set
- Verify IAM permissions

### Site Not Updating
- Check CloudFront invalidation status
- Wait 5-15 minutes for propagation
- Clear browser cache

### SSL Certificate Issues
- Ensure certificate is in **US East (N. Virginia)** region
- Verify DNS validation records
- Check certificate expiration date

## Next Steps

1. Complete AWS setup using [AWS Setup Guide](./aws-setup-guide.md)
2. Add GitHub secrets
3. Test deployment with a small change
4. Monitor CloudFront and S3 metrics
5. Set up alerts (optional)

## Support

- **AWS Support**: https://console.aws.amazon.com/support/
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Astro Deployment**: https://docs.astro.build/en/guides/deploy/

---

**Last Updated**: 2025-01-XX

