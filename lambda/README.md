# Form Handling Lambda Functions

Lambda functions that send form submissions (trial booking + contact) via AWS SES.

## Prerequisites

- AWS account with SES configured (verify sender/domain)
- Node.js 22+
- AWS CLI configured with `kando-knox` profile (or set `AWS_PROFILE`)

## Setup

### 1. SES Configuration

You don't need Route 53 to verify in SES. Two options:

**Option A – Verify a single email** (simplest, no DNS changes):
- SES Console → Verified identities → Create identity → **Email address**
- Add `noreply@knoxmartialarts.com.au` and `kando@knoxmartialarts.com.au`
- SES sends a verification link to each address – click to verify

**Option B – Verify the whole domain** (recommended):
- SES Console → Verified identities → Create identity → **Domain**
- Add `knoxmartialarts.com.au`
- SES shows DNS records (CNAME/TXT) to add
- Add those records at your current DNS provider (GoDaddy, Cloudflare, etc. – Route 53 not required)
- Once verified, any address `@knoxmartialarts.com.au` can be used to send

**Sandbox mode**: New SES accounts start in sandbox – you can only send to verified addresses until production access is granted.

### 2. Create IAM Role for Lambda

Create a role `knoxmartialarts-lambda-role` with:

- Trust policy: `lambda.amazonaws.com`
- Attach `iam-lambda-ses-policy.json` (or inline `ses:SendEmail`, `ses:SendRawEmail`)

### 3. Create Lambda Functions

**Book Trial:**

```bash
aws lambda create-function \
  --function-name knoxmartialarts-book-trial \
  --runtime nodejs22.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/knoxmartialarts-lambda-role \
  --handler index.handler \
  --zip-file fileb://book-trial.zip \
  --region ap-southeast-2 \
  --timeout 10 \
  --environment "Variables={TO_EMAIL=kando@knoxmartialarts.com.au,FROM_EMAIL=noreply@knoxmartialarts.com.au}"
```

**Contact:**

```bash
aws lambda create-function \
  --function-name knoxmartialarts-contact \
  --runtime nodejs22.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/knoxmartialarts-lambda-role \
  --handler index.handler \
  --zip-file fileb://contact.zip \
  --region ap-southeast-2 \
  --timeout 10 \
  --environment "Variables={TO_EMAIL=kando@knoxmartialarts.com.au,FROM_EMAIL=noreply@knoxmartialarts.com.au}"
```

To create the zip files:

```bash
cd lambda/book-trial && npm install --omit=dev && zip -r ../book-trial.zip index.js node_modules && cd ..
cd lambda/contact && npm install --omit=dev && zip -r ../contact.zip index.js node_modules && cd ..
```

### 4. Add Lambda Function URLs

```bash
# Book Trial
aws lambda create-function-url-config \
  --function-name knoxmartialarts-book-trial \
  --auth-type NONE \
  --cors 'AllowOrigins=*,AllowMethods=POST,OPTIONS,AllowHeaders=Content-Type'

# Contact
aws lambda create-function-url-config \
  --function-name knoxmartialarts-contact \
  --auth-type NONE \
  --cors 'AllowOrigins=*,AllowMethods=POST,OPTIONS,AllowHeaders=Content-Type'
```

Get the URLs:

```bash
aws lambda get-function-url-config --function-name knoxmartialarts-book-trial
aws lambda get-function-url-config --function-name knoxmartialarts-contact
```

### 5. Configure the Website

**Current Lambda Function URLs** (created 2026-02):

- Trial: `https://jhapacsdeg3erqk5bokhfr42i40prbhd.lambda-url.ap-southeast-2.on.aws/`
- Contact: `https://y2qbyhc7hsvnlprlcy4gm44noe0qmgwt.lambda-url.ap-southeast-2.on.aws/`

Set environment variables when building:

```bash
PUBLIC_TRIAL_API_URL=https://jhapacsdeg3erqk5bokhfr42i40prbhd.lambda-url.ap-southeast-2.on.aws/ \
PUBLIC_CONTACT_API_URL=https://y2qbyhc7hsvnlprlcy4gm44noe0qmgwt.lambda-url.ap-southeast-2.on.aws/ \
npm run build
```

For GitHub Actions, add `PUBLIC_TRIAL_API_URL` and `PUBLIC_CONTACT_API_URL` as repository secrets (the workflow already uses them), then:

```yaml
- name: Build project
  run: npm run build
  env:
    PUBLIC_TRIAL_API_URL: ${{ secrets.PUBLIC_TRIAL_API_URL }}
    PUBLIC_CONTACT_API_URL: ${{ secrets.PUBLIC_CONTACT_API_URL }}
```

## Deployment

Update Lambda code after changes:

```bash
./deploy.sh
```

Or manually zip and update each function.

## Form Fields

**Trial form** (`data-form-type="trial"`):

- `first-name`, `last-name`, `email`, `mobile` (required)
- `program` (optional) – e.g. "Adult Martial Arts"

**Contact form** (`data-form-type="contact"`):

- `first-name`, `last-name`, `email` (required)
- `phone-number`, `message` (optional)

## Environment Variables (Lambda)

| Variable    | Default                         | Description                |
| ---------- | ------------------------------- | -------------------------- |
| `TO_EMAIL` | kando@knoxmartialarts.com.au     | Recipient for form emails  |
| `FROM_EMAIL` | noreply@knoxmartialarts.com.au | SES verified sender        |
| `AWS_REGION` | ap-southeast-2                | AWS region for SES         |

### GitHub Secrets (for Lambda deploy)

When adding Lambda deployment to GitHub Actions, add these secrets:

| Secret      | Value                           | Description                |
| ----------- | ------------------------------- | -------------------------- |
| `LAMBDA_TO_EMAIL` | kando@knoxmartialarts.com.au     | Form email recipient       |
| `LAMBDA_FROM_EMAIL` | noreply@knoxmartialarts.com.au | SES sender (must be verified) |
