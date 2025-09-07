# GitHub Token Setup for Automatic Product Uploads

## Overview

To enable automatic product creation through your admin upload form, you need to set up a GitHub Personal Access Token. This allows the system to create product files directly in your repository, triggering automatic site rebuilds and deployments.

## Step 1: Create GitHub Personal Access Token

1. **Go to GitHub Settings:**
   - Visit: https://github.com/settings/tokens
   - Or navigate: GitHub → Profile → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)

2. **Generate New Token:**
   - Click "Generate new token (classic)"
   - Give it a descriptive name: `AR Alphaya Product Uploads`
   - Set expiration: Choose "No expiration" or a long duration like 1 year

3. **Set Permissions:**
   - Check **"repo"** (Full control of private repositories)
   - This gives access to repository contents, which is needed to create product files

4. **Generate and Copy:**
   - Click "Generate token"
   - **IMPORTANT:** Copy the token immediately - you won't be able to see it again
   - It should start with `ghp_`

## Step 2: Add Token to Netlify

1. **Go to Netlify Dashboard:**
   - Visit: https://app.netlify.com/
   - Select your "AR Alphaya Jewellery" site

2. **Navigate to Environment Variables:**
   - Go to: Site settings → Environment variables
   - Or: Build & deploy → Environment variables

3. **Add GitHub Token:**
   - Click "Add a variable"
   - Key: `GITHUB_TOKEN`
   - Value: Paste your GitHub token (starts with `ghp_`)
   - Click "Create variable"

4. **Trigger Redeploy:**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"
   - This ensures the new environment variable is loaded

## Step 3: Test the Upload Form

1. **Navigate to Admin Upload:**
   - Visit: https://aralphaya.netlify.app/admin-upload
   - Fill out a test product form
   - Upload some test images
   - Click "Create Product"

2. **Expected Results with GitHub Token:**
   - ✅ Success message: "Product created successfully and deployed to GitHub!"
   - ✅ Automatic file creation in your repository
   - ✅ Automatic site rebuild and deployment
   - ✅ Product appears on your site within 2-3 minutes

3. **Results without GitHub Token:**
   - ℹ️ Success message: "Product template created. Manual setup required."
   - ℹ️ Manual instructions provided for you to copy/paste the markdown

## Troubleshooting

### Token Not Working
- Verify the token has "repo" permissions
- Check that the token hasn't expired
- Ensure the token is correctly copied without extra spaces

### Repository Access Issues
- Confirm the token was created by the repository owner (haxllo)
- Verify the repository name is correct in the code: `haxllo/ar-alphaya-jewellery`

### Environment Variable Issues
- Check that `GITHUB_TOKEN` is spelled correctly in Netlify
- Try redeploying the site after adding the variable
- Check the deployment logs for any API errors

## Security Notes

- **Keep your token secure** - don't share it publicly
- The token gives full access to your repositories
- You can revoke the token anytime from GitHub settings
- Consider setting an expiration date and renewing periodically

## Manual Fallback

If you prefer not to use the GitHub token, the upload form will still work but require manual steps:
1. The form will generate the product markdown
2. You'll need to manually create the file in your repository
3. The site will rebuild automatically once you commit the file

This gives you flexibility to choose between automatic or manual product creation workflows.
