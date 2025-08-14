# Quick reCAPTCHA Setup for Your VPS

Your website is now showing a yellow warning box because it needs Google reCAPTCHA keys. Here's how to fix it:

## Step 1: Get Your reCAPTCHA Keys

Follow the detailed guide in `RECAPTCHA_SETUP_GUIDE.md` to get your keys from Google.

## Step 2: Add Keys to Your VPS

Once you have your Google reCAPTCHA keys, run these commands on your VPS:

```bash
# Switch to your app user
sudo su - topteachers

# Go to your app directory
cd /home/topteachers/projects/topteachers-app

# Add your actual keys (replace with your real keys from Google)
echo "VITE_CAPTCHA_SITE_KEY=your_actual_site_key_here" >> .env
echo "CAPTCHA_SITE_KEY=your_actual_site_key_here" >> .env
echo "CAPTCHA_SECRET=your_actual_secret_key_here" >> .env

# Rebuild the app with the new environment variables
npm run build

# Restart the app
pm2 restart topteachers
```

## Step 3: Test Your Website

1. Visit https://topteachers.online
2. The yellow warning should be gone
3. You should see the real Google reCAPTCHA checkbox
4. Fill out the contact form and submit it
5. You should see a success message

## What Each Key Does

- **VITE_CAPTCHA_SITE_KEY**: Shows the reCAPTCHA widget to visitors (frontend)
- **CAPTCHA_SITE_KEY**: Used by your server for backup reference
- **CAPTCHA_SECRET**: Verifies submissions with Google (backend only)

## If You Don't Have Keys Yet

The website will show "Use Demo Mode" button - this works for testing but won't protect against spam. Get your real keys from Google reCAPTCHA console at: https://www.google.com/recaptcha/

## After Adding Keys

Your contact form will be fully protected from spam and bots, and visitors will see the professional Google reCAPTCHA verification!