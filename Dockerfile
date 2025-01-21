FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libmariadb-dev-compat \
    libmariadb-dev \
    build-essential \
    && apt-get clean

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN python -m venv /opt/venv && . /opt/venv/bin/activate && pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port
EXPOSE 8000


# Run the application
CMD ["python", "Backend/Enrollment/manage.py", "runserver", "0.0.0.0:8000"]
