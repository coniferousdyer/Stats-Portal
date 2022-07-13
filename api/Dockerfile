# Pull the base image for Python 3.10.4.
FROM python:3.10.4-slim

# Set the working directory within the image.
WORKDIR /app

# Copy the requirements.txt file to the image.
COPY requirements.txt .

# Install the requirements.
RUN pip install -r requirements.txt

# Copy the application source code to the image.
COPY . .

# Expose the application port.
EXPOSE 5000

# Run the application.
CMD ["gunicorn", "-c", "gunicorn.conf.py", "wsgi:app"]