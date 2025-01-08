# Use a lightweight base image with Python support for ARM (Raspberry Pi)
FROM python:3.10.12

# Install dependencies for RPi.GPIO and other packages
RUN apt-get update && apt-get install -y \
    gcc \
    build-essential \
    libffi-dev \
    libssl-dev \
    && apt-get clean

# Set working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy your Python script and certificates
COPY mqtt_client.py . 
COPY certs/ ./certs/

# Set environment variables (if needed)
ENV AWS_REGION="ap-southeast-1"


# Run the Python script
CMD ["python3", "mqtt_client.py"]
