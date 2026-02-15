#!/usr/bin/env bash
# Deploy Lambda functions for form handling (trial + contact)
# Requires: AWS CLI, npm, zip
# Uses AWS profile: kando-knox (or default)

set -e
AWS_PROFILE="${AWS_PROFILE:-kando-knox}"
REGION="${AWS_REGION:-ap-southeast-2}"
FUNCTION_PREFIX="knoxmartialarts"

deploy_function() {
  local name=$1
  local dir=$2
  echo "Deploying $name..."
  cd "$dir"
  npm install --omit=dev
  zip -r "../${name}.zip" index.js node_modules
  cd ..
  aws lambda update-function-code \
    --function-name "${FUNCTION_PREFIX}-${name}" \
    --zip-file "fileb://${name}.zip" \
    --region "$REGION" \
    --profile "$AWS_PROFILE"
  rm "${name}.zip"
  echo "Done: $name"
}

# Create functions if they don't exist, then update code
ensure_and_deploy() {
  local name=$1
  local dir=$2
  if aws lambda get-function --function-name "${FUNCTION_PREFIX}-${name}" --region "$REGION" --profile "$AWS_PROFILE" 2>/dev/null; then
    deploy_function "$name" "$dir"
  else
    echo "Function ${FUNCTION_PREFIX}-${name} does not exist. Create it first - see lambda/README.md"
    exit 1
  fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ensure_and_deploy "book-trial" "book-trial"
ensure_and_deploy "contact" "contact"

echo ""
echo "Deployment complete. Get the Function URLs from AWS Console and set:"
echo "  PUBLIC_TRIAL_API_URL=<book-trial-url>"
echo "  PUBLIC_CONTACT_API_URL=<contact-url>"
echo "Then rebuild and redeploy the site."
