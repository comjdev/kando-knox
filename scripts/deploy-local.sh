#!/usr/bin/env bash
# Local deploy script - build and push to S3 + invalidate CloudFront
# Uses AWS profile: kando-knox
# Bucket: knoxmartialarts.com.au
# CloudFront: E1JKX3VR32CAIT

set -e

BUCKET="knoxmartialarts.com.au"
DISTRIBUTION_ID="E1JKX3VR32CAIT"
PROFILE="kando-knox"

# Form API endpoints - use env vars if set, otherwise Lambda Function URLs
PUBLIC_TRIAL_API_URL="${PUBLIC_TRIAL_API_URL:-https://jhapacsdeg3erqk5bokhfr42i40prbhd.lambda-url.ap-southeast-2.on.aws/}"
PUBLIC_CONTACT_API_URL="${PUBLIC_CONTACT_API_URL:-https://y2qbyhc7hsvnlprlcy4gm44noe0qmgwt.lambda-url.ap-southeast-2.on.aws/}"

echo "📦 Building site (with form API endpoints)..."
PUBLIC_TRIAL_API_URL="$PUBLIC_TRIAL_API_URL" PUBLIC_CONTACT_API_URL="$PUBLIC_CONTACT_API_URL" npm run build

echo "📤 Uploading to S3..."
aws s3 sync dist/ s3://$BUCKET/ --exclude "*" --include "*.html" --include "*.xml" --include "*.txt" --cache-control "public, max-age=86400, s-maxage=86400" --delete --profile $PROFILE
aws s3 sync dist/ s3://$BUCKET/ --exclude "*" --include "*.css" --cache-control "public, max-age=31536000, immutable" --content-type "text/css" --delete --profile $PROFILE
aws s3 sync dist/ s3://$BUCKET/ --exclude "*" --include "*.js" --include "*.mjs" --cache-control "public, max-age=31536000, immutable" --content-type "application/javascript" --delete --profile $PROFILE
aws s3 sync dist/ s3://$BUCKET/ --exclude "*" --include "*.webp" --cache-control "public, max-age=31536000, immutable" --content-type "image/webp" --delete --profile $PROFILE
aws s3 sync dist/ s3://$BUCKET/ --exclude "*" --include "*.avif" --cache-control "public, max-age=31536000, immutable" --content-type "image/avif" --delete --profile $PROFILE
aws s3 sync dist/ s3://$BUCKET/ --exclude "*" --include "*.jpg" --include "*.jpeg" --include "*.png" --include "*.gif" --include "*.svg" --include "*.ico" --cache-control "public, max-age=31536000, immutable" --delete --profile $PROFILE
aws s3 sync dist/ s3://$BUCKET/ --exclude "*" --include "*.woff" --include "*.woff2" --include "*.ttf" --include "*.otf" --cache-control "public, max-age=31536000, immutable" --delete --profile $PROFILE
aws s3 sync dist/ s3://$BUCKET/ \
  --exclude "*.html" --exclude "*.xml" --exclude "*.txt" --exclude "*.css" --exclude "*.js" --exclude "*.mjs" \
  --exclude "*.webp" --exclude "*.avif" --exclude "*.jpg" --exclude "*.jpeg" --exclude "*.png" --exclude "*.gif" --exclude "*.svg" --exclude "*.ico" \
  --exclude "*.woff" --exclude "*.woff2" --exclude "*.ttf" --exclude "*.otf" \
  --cache-control "public, max-age=604800" --delete --profile $PROFILE

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*" --profile $PROFILE

echo ""
echo "✅ Deploy complete!"
echo "🌐 Site URL: https://d3f2n3yh0hm7yx.cloudfront.net"
