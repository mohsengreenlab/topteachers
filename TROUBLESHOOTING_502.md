# Fixing 502 Bad Gateway Error for TopTeachers.online

A 502 error means Nginx (your web server) can't talk to your TopTeachers app. Let's fix this step by step.

## Step 1: Check if Your App is Running

First, let's see if your app is actually running:

```bash
# Switch to your app user
sudo su - topteachers

# Check if PM2 is running your app
pm2 status

# If no apps are shown, your app isn't running
# If you see "topteachers" with status "stopped" or "errored", that's the problem
```

### If PM2 shows no apps or errors:

```bash
# Go to your app directory
cd /home/topteachers/projects/topteachers-app

# Make sure you built the app
npm run build

# Start the app
pm2 start ecosystem.config.cjs

# Check status again
pm2 status
```

### If PM2 shows the app but it's errored:

```bash
# Look at the error logs
pm2 logs topteachers

# This will show you exactly what's wrong
```

## Step 2: Check if Your App Responds on Port 3005

Test if your app responds locally:

```bash
# Test from your VPS
curl http://127.0.0.1:3005

# You should see HTML content
# If you get "connection refused", your app isn't running on port 3005
```

## Step 3: Verify Your Environment File

Make sure your `.env` file has the right port:

```bash
# Check your environment file
cat /home/topteachers/projects/topteachers-app/.env

# You should see: PORT=3005
# If it's missing or wrong, fix it:
echo "PORT=3005" >> /home/topteachers/projects/topteachers-app/.env
```

After fixing the .env file, restart your app:
```bash
pm2 restart topteachers
```

## Step 4: Check Nginx Configuration

Verify Nginx is configured correctly:

```bash
# Check if your site config exists
sudo cat /etc/nginx/sites-available/topteachers.online

# Make sure it's enabled (linked)
ls -la /etc/nginx/sites-enabled/ | grep topteachers

# Test Nginx configuration
sudo nginx -t

# If there are errors, fix them and reload
sudo systemctl reload nginx
```

## Step 5: Check Your DNS Settings

Make sure your domain points to your VPS:

```bash
# Check where your domain points
dig topteachers.online

# The A record should point to your VPS IP address
# If it doesn't, update it in your DNS provider (Cloudflare)
```

## Step 6: Check Firewall

Make sure your firewall allows web traffic:

```bash
# Check firewall status
sudo ufw status

# You should see:
# 22/tcp (SSH) - ALLOW
# 80/tcp (HTTP) - ALLOW  
# 443/tcp (HTTPS) - ALLOW

# If web ports aren't allowed:
sudo ufw allow 'Nginx Full'
sudo ufw reload
```

## Quick Fix Commands

Try these in order:

```bash
# 1. Switch to app user and restart the app
sudo su - topteachers
cd /home/topteachers/projects/topteachers-app
pm2 restart topteachers

# 2. Check if it's working locally
curl http://127.0.0.1:3005

# 3. Restart Nginx
sudo systemctl restart nginx

# 4. Test your site
curl -I http://topteachers.online
```

## Most Common Causes

**App not running**: PM2 shows stopped or no apps
- **Fix**: `pm2 start ecosystem.config.cjs`

**Wrong port**: App running on different port than 3005
- **Fix**: Add `PORT=3005` to your `.env` file and restart

**Missing build**: App trying to run unbuild code
- **Fix**: Run `npm run build` then `pm2 restart topteachers`

**Nginx misconfiguration**: Wrong proxy target
- **Fix**: Verify Nginx points to `http://127.0.0.1:3005`

## Check Your Logs

If still stuck, check these logs:

```bash
# App logs
sudo su - topteachers
pm2 logs topteachers

# Nginx error log
sudo tail -f /var/log/nginx/error.log

# System log
sudo journalctl -u nginx -f
```

## Test Everything Step by Step

1. **App running**: `pm2 status` should show "online"
2. **Port 3005 responds**: `curl http://127.0.0.1:3005` should return HTML
3. **Nginx config good**: `sudo nginx -t` should show "syntax is ok"
4. **Domain resolves**: `dig topteachers.online` should show your VPS IP
5. **Firewall allows web**: `sudo ufw status` should show port 80/443 allowed

Once all these pass, your site should work!