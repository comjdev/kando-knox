# CloudFront Redirect Setup for Academy Page

## Option 1: CloudFront Function (Recommended)

### Steps:

1. **Create CloudFront Function:**
   - Go to AWS CloudFront Console → Functions
   - Click "Create function"
   - Name: `academy-redirect`
   - Copy the code from `cloudfront-functions/academy-redirect.js`
   - Click "Publish"

2. **Associate Function with Distribution:**
   - Go to your CloudFront Distribution
   - Click on "Behaviors" tab
   - Edit the behavior for `/academy` path (or create a new one)
   - Scroll to "Function associations"
   - Under "Viewer request", select the `academy-redirect` function
   - Save changes

3. **Invalidate Cache:**
   - Go to "Invalidations" tab
   - Create invalidation for `/academy*`
   - Wait for completion

## Option 2: Lambda@Edge (More Complex)

If you need more complex logic, you can use Lambda@Edge, but CloudFront Functions are simpler and cheaper for basic redirects.

## Option 3: Keep JavaScript Redirect

The current JavaScript redirect works fine and requires no CloudFront configuration. It's the simplest option if SEO isn't critical for this redirect.

