# TopTeachers.online Deployment Guide

## The Big Picture

Here's what we'll do to get your site live:

• **Create a safe space**: Make a new user account just for this app, so it doesn't interfere with your other projects
• **Set up the database**: Create a private PostgreSQL database or use your existing Neon database
• **Configure the app**: Set up environment variables with your database connection, port, and API keys
• **Build and run**: Install everything, build the app, and use PM2 to keep it running automatically
• **Add the web gateway**: Set up Nginx as the public front door that forwards visitors to your app
• **Secure with HTTPS**: Get SSL certificates from Let's Encrypt so your site is secure

---

## Step 1: Create a Separate Home for the App

First, we'll create a dedicated user account for your TopTeachers app. Think of this as giving your app its own apartment, separate from your other applications.

### Create the user and directories

```bash
sudo adduser topteachers
```
This creates a new user named "topteachers" with its own home folder.

```bash
sudo mkdir -p /home/topteachers/projects
sudo mkdir -p /home/topteachers/logs
sudo chown -R topteachers:topteachers /home/topteachers/
```
These commands create folders for your app files and log files, then make sure the topteachers user owns them.

### Where your files will live

- **App code**: `/home/topteachers/projects/topteachers-app`
- **Log files**: `/home/topteachers/logs/`
- **Environment settings**: `/home/topteachers/projects/topteachers-app/.env`

The "topteachers" user can only access its own files, keeping everything isolated from your other apps.

---

## Step 2: Pick a Safe Internal Port and Database

Your app will run on port 3005 inside your server (ports 3001-3004 and 8000 are already taken by your other apps). Only Nginx will talk to this port - visitors won't access it directly.

### Option A: Use Local PostgreSQL (Recommended)

Create a dedicated database on your VPS:

```bash
sudo -u postgres psql
```
This opens the PostgreSQL command line.

```sql
CREATE DATABASE topteachers_db;
CREATE USER topteachers_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE topteachers_db TO topteachers_user;
\q
```
This creates a database and user just for your app, then exits PostgreSQL.

Your database URL will be:
```
DATABASE_URL=postgresql://topteachers_user:your_secure_password_here@localhost:5432/topteachers_db
```

### Option B: Keep Using Neon (Alternative)

If you prefer to stick with your existing Neon database, just use your current Neon connection string:
```
DATABASE_URL=your_neon_connection_string_here
```

---

## Step 3: Environment Values (Keep It Private)

Create a file to store your app's settings. These are like the app's personal configuration that tells it how to behave.

Switch to your app user:
```bash
sudo su - topteachers
```

Create the environment file:
```bash
nano /home/topteachers/projects/topteachers-app/.env
```

Fill in these important settings:
```env
# Where your app runs (internal port)
PORT=3005

# Your website address
SITE_URL=https://topteachers.online

# Database connection (use Option A or B from Step 2)
DATABASE_URL=postgresql://topteachers_user:your_secure_password_here@localhost:5432/topteachers_db

# Session security (generate a long random string)
SESSION_SECRET=your_very_long_random_string_here_at_least_32_characters

# reCAPTCHA keys (get these from Google reCAPTCHA console)
CAPTCHA_SITE_KEY=your_recaptcha_site_key
CAPTCHA_SECRET=your_recaptcha_secret_key

# Node environment
NODE_ENV=production
```

**Important**: This file contains secrets, so it stays private to the topteachers user.

---

## Step 4: Build and Run the App

Now we'll get your app ready to run. This involves downloading dependencies, building the website files, and setting up a "supervisor" to keep it running.

### Install Node.js and PM2

```bash
# Install Node.js (as root)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally (this keeps your app running)
sudo npm install -g pm2
```
PM2 is like a babysitter for your app - it restarts it if it crashes and starts it when the server boots up.

### Get your code and build it

```bash
# Switch to your app user
sudo su - topteachers

# Go to your projects folder
cd /home/topteachers/projects/

# Copy your code here (replace with your method - git clone, scp, etc.)
# For example, if using git:
git clone https://github.com/yourusername/topteachers-app.git
cd topteachers-app

# Install all the pieces your app needs
npm install

# Build the website files
npm run build
```

### Set up the database tables

```bash
# Create your database tables
npm run db:push
```
This creates all the tables your app needs in the database.

### Start the app with PM2

```bash
# Create PM2 configuration
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'topteachers',
    script: 'dist/index.js',
    cwd: '/home/topteachers/projects/topteachers-app',
    env: {
      NODE_ENV: 'production'
    },
    log_file: '/home/topteachers/logs/app.log',
    error_file: '/home/topteachers/logs/error.log',
    out_file: '/home/topteachers/logs/out.log'
  }]
}
EOF

# Start your app
pm2 start ecosystem.config.js

# Make sure it starts when the server reboots
pm2 startup
pm2 save
```

Check if it's running:
```bash
pm2 status
```
You should see "topteachers" with status "online".

---

## Step 5: Put Nginx in Front + HTTPS

Nginx acts like the reception desk for your website. When someone visits topteachers.online, Nginx answers the door and quietly passes their request to your app running on port 3005.

### Install Nginx and Certbot

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

### Create Nginx configuration

```bash
sudo nano /etc/nginx/sites-available/topteachers.online
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name topteachers.online www.topteachers.online;
    
    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/topteachers.online /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Get SSL certificates

```bash
sudo certbot --nginx -d topteachers.online -d www.topteachers.online
```
This automatically gets SSL certificates and updates your Nginx config for HTTPS.

Verify auto-renewal works:
```bash
sudo certbot renew --dry-run
```

---

## Step 6: Configure Express for Proxy

Your Express app needs to trust Nginx so reCAPTCHA can see real visitor IP addresses.

Edit your server configuration to add:
```javascript
// In your Express app setup
app.set('trust proxy', 1);
```

This tells Express that it's behind a proxy (Nginx) and should trust the IP addresses Nginx forwards.

---

## Step 7: Final Checks

### Test your website

1. **Visit your site**: Go to `https://topteachers.online` in your browser
   - Page should load completely with all styles and images
   - Should automatically redirect from HTTP to HTTPS

2. **Test the contact form**:
   - Fill out the form completely
   - Complete the reCAPTCHA
   - Submit and verify you see a success message
   - Check your database for the new contact entry

3. **Verify other apps still work**:
   - Kerit (ports 3001/3002)
   - TrustLine (port 3003)  
   - SmartCover (port 3004)
   - FreePaper (port 8000)

### Confirm Cloudflare settings

In your Cloudflare dashboard:
- DNS records for topteachers.online should point to your VPS IP
- **Important**: Keep the cloud icon gray (DNS only), not orange
- SSL/TLS should be set to "Full" since your VPS handles SSL

---

## If Something Goes Wrong

### Check your app logs
```bash
# View recent app logs
sudo su - topteachers
pm2 logs topteachers

# Or check log files directly
tail -f /home/topteachers/logs/error.log
```

### Check Nginx logs
```bash
# View Nginx error log
sudo tail -f /var/log/nginx/error.log

# View access log
sudo tail -f /var/log/nginx/access.log
```

### Check database connection
```bash
# Test database connection
sudo -u postgres psql -d topteachers_db -U topteachers_user
```

### Restart services if needed
```bash
# Restart your app
sudo su - topteachers
pm2 restart topteachers

# Restart Nginx
sudo systemctl restart nginx
```

---

## Basic Security (Firewall)

Set up a simple firewall to only allow necessary traffic:

```bash
# Enable firewall with basic web and SSH access
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

This allows SSH (so you can log in), HTTP/HTTPS (for your websites), and blocks everything else.

---

## Summary

Your TopTeachers.online site is now:
- Running safely in its own user account on port 3005
- Protected by Nginx with SSL certificates
- Connected to its own database
- Monitored by PM2 to stay online
- Secured with a basic firewall

The country dropdown search functionality you fixed will work exactly the same way it does now, and your contact form will securely submit to your database with reCAPTCHA verification.