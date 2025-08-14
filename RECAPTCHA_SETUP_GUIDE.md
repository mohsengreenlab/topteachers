# How to Get reCAPTCHA Keys for TopTeachers.online

## What is reCAPTCHA?

reCAPTCHA is Google's free service that protects your contact form from spam and bots. It shows visitors the "I'm not a robot" checkbox or asks them to solve simple puzzles.

You need two keys:
- **Site Key**: Goes in your website's code (visitors can see this)
- **Secret Key**: Stays private on your server (never share this)

---

## Step-by-Step Guide

### Step 1: Go to Google reCAPTCHA

1. Open your web browser
2. Go to: https://www.google.com/recaptcha/
3. Click the **"Admin Console"** button in the top right corner
4. Sign in with your Google account (create one if you don't have it)

### Step 2: Create a New Site

1. Once signed in, click the **"+"** button or **"Create"** button
2. You'll see a form to register a new site

### Step 3: Fill Out the Registration Form

**Label (Site Name)**
- Type: `TopTeachers Contact Form`
- This is just for your reference

**reCAPTCHA Type**
- Choose: **"reCAPTCHA v2"**
- Select: **"I'm not a robot" Checkbox**
- This is the most common and user-friendly option

**Domains**
- Add your website domains (one per line):
```
topteachers.online
www.topteachers.online
```
- If you want to test locally first, also add:
```
localhost
127.0.0.1
```

**Owners**
- Your Google account email should already be listed
- You can add other email addresses if needed

**Terms of Service**
- Check the box: **"Accept the reCAPTCHA Terms of Service"**

### Step 4: Get Your Keys

1. Click **"Submit"**
2. You'll see a success page with your keys:

**Site Key** (starts with `6L...`)
- This goes in your `.env` file as `CAPTCHA_SITE_KEY`
- Copy this entire string

**Secret Key** (starts with `6L...`)
- This goes in your `.env` file as `CAPTCHA_SECRET`
- Copy this entire string
- **Keep this private - never share it publicly**

### Step 5: Update Your Environment File

Add these to your `/home/topteachers/projects/topteachers-app/.env` file:

```env
# Replace with your actual keys from Google
CAPTCHA_SITE_KEY=6LexampleSiteKeyFromGoogle12345
CAPTCHA_SECRET=6LexampleSecretKeyFromGoogle67890
# Frontend needs the site key with VITE_ prefix
VITE_CAPTCHA_SITE_KEY=6LexampleSiteKeyFromGoogle12345
```

### Step 6: Test Your Setup

1. Restart your app:
```bash
sudo su - topteachers
pm2 restart topteachers
```

2. Visit your website
3. Try submitting the contact form
4. You should see the reCAPTCHA checkbox appear
5. Complete it and submit - you should see the success message

---

## Important Security Notes

### Keep Your Secret Key Safe
- Never put the secret key in your website's code
- Never commit it to public repositories
- Only store it in your `.env` file on the server

### Domain Restrictions
- reCAPTCHA only works on the domains you registered
- If you change your domain later, update it in the Google console
- For testing, you can add `localhost` to your domain list

### Testing Locally
If you want to test on your development machine:
1. Add `localhost` and `127.0.0.1` to your domains in Google console
2. Use the same keys in your local `.env` file

---

## Troubleshooting

### "Invalid site key" error
- Check that your domain is exactly right in Google console
- Make sure you're using the **site key** in your frontend code
- Verify the domain in Google console matches your actual website URL

### "Invalid secret key" error
- Check that you're using the **secret key** on your server
- Make sure there are no extra spaces in your `.env` file
- Verify the key was copied completely

### reCAPTCHA not showing up
- Check your browser's developer console for JavaScript errors
- Verify your site key is correct in the environment file
- Make sure your app restarted after adding the keys

### Still having issues?
- Check the Google reCAPTCHA admin console for error reports
- Look at your app logs: `pm2 logs topteachers`
- Make sure your firewall allows outbound connections to Google

---

## Quick Reference

Once you have your keys:

1. **Site Key** → Goes in `CAPTCHA_SITE_KEY` in your `.env` file
2. **Secret Key** → Goes in `CAPTCHA_SECRET` in your `.env` file
3. Restart your app: `pm2 restart topteachers`
4. Test the contact form on your website

Your contact form will now be protected from spam and bots!