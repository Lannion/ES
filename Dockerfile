FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libmariadb-dev \
    libmariadb-dev-compat \
    build-essential \
    && apt-get clean

# Set working directory
WORKDIR /app

# Copy requirements.txt
COPY requirements.txt .

# Upgrade pip and install dependencies
RUN python -m pip install --upgrade pip \
    && python -m pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port
EXPOSE 8000


# Run the application
CMD ["python", "Backend/Enrollment/manage.py", "runserver", "0.0.0.0:8000"]
