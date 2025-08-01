FROM nginx:alpine

# Copy all files to Nginx's web directory
COPY . /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose configurable port
ENV PORT=8080
EXPOSE $PORT

# Start script
CMD ["/entrypoint.sh"]