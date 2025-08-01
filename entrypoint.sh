#!/bin/sh
# Generate config with environment variables
echo "window.API_KEY = '${API_KEY}';" > /usr/share/nginx/html/config.js

# Update nginx port
sed -i "s/listen 8080/listen ${PORT}/g" /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'