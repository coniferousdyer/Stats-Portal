# Pull the base image for PostgreSQL 14.3.
FROM postgres:14.3-alpine

# Copy the database initialization script to the image.
COPY create.sql /docker-entrypoint-initdb.d