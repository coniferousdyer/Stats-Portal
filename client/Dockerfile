# Pull the base image for Node 18.1.0.
FROM node:18.1.0-alpine

# Setting environment variables (they should be available at build time).
ARG BASE_API_URL
ARG ISR_REVALIDATE_TIME
ARG CACHE_FRESH_TIME
ARG CACHE_REVALIDATE_TIME
ARG SENTRY_DSN
ARG NEXT_PUBLIC_SENTRY_DSN
ARG SENTRY_IGNORE_API_RESOLUTION_ERROR
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT

ENV BASE_API_URL http://nginx:80/server
ENV ISR_REVALIDATE_TIME 3600
ENV CACHE_FRESH_TIME 300
ENV CACHE_REVALIDATE_TIME 3600
ENV SENTRY_DSN $SENTRY_DSN
ENV NEXT_PUBLIC_SENTRY_DSN $NEXT_PUBLIC_SENTRY_DSN
ENV SENTRY_IGNORE_API_RESOLUTION_ERROR 1
ENV SENTRY_AUTH_TOKEN $SENTRY_AUTH_TOKEN
ENV SENTRY_ORG $SENTRY_ORG
ENV SENTRY_PROJECT $SENTRY_PROJECT

# Set the working directory within the image.
WORKDIR /app

# Copy the package.json and package-lock.json files to the image.
COPY package*.json ./

# Install the dependencies.
RUN npm install

# Copy the application source code to the image.
COPY . .

# Expose the application port.
EXPOSE 3000

# Run the application in development mode.
CMD ["npm", "run", "dev"]