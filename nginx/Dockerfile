# Pull the base image for Nginx 1.18.0.
FROM nginx:1.18.0-alpine

# Remove the default nginx configuration.
RUN rm /etc/nginx/conf.d/default.conf

# Copy the nginx configuration file to the image.
COPY nginx.conf /etc/nginx/conf.d