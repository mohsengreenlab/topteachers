#!/bin/bash

# Quick fix script for port issue
echo "=== Checking current app status ==="
pm2 logs topteachers --lines 10

echo "=== Testing different ports ==="
echo "Testing port 5000 (default):"
curl -I http://127.0.0.1:5000 2>/dev/null && echo "App running on 5000!" || echo "Not on 5000"

echo "Testing port 3005 (target):"
curl -I http://127.0.0.1:3005 2>/dev/null && echo "App running on 3005!" || echo "Not on 3005"

echo "=== Checking environment file ==="
if [ -f .env ]; then
    echo "Environment file exists:"
    grep PORT .env || echo "PORT not set in .env"
else
    echo "No .env file found"
fi

echo "=== Fix: Adding PORT=3005 to environment ==="
echo "PORT=3005" >> .env

echo "=== Restarting app ==="
pm2 restart topteachers

echo "=== Testing port 3005 again ==="
sleep 3
curl -I http://127.0.0.1:3005 && echo "SUCCESS: App now on port 3005!" || echo "Still not working"