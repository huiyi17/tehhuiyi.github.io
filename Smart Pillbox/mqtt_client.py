import json
import time
from time import sleep
import RPi.GPIO as GPIO
from hx711 import HX711
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
from threading import Thread

# AWS IoT Core Endpoint and Certificate Paths
ENDPOINT = "a5zc4taa5thmm-ats.iot.ap-southeast-1.amazonaws.com"
CLIENT_ID = "ubuntu"
CERT_PATH = "certs/device.pem.crt"
PRIVATE_KEY_PATH = "certs/private.pem.key"
CA_PATH = "certs/Amazon-root-CA-1.pem"

# Initialize AWS IoT MQTT Client
mqtt_client = AWSIoTMQTTClient(CLIENT_ID)
mqtt_client.configureEndpoint(ENDPOINT, 8883)
mqtt_client.configureCredentials(CA_PATH, PRIVATE_KEY_PATH, CERT_PATH)
mqtt_client.configureAutoReconnectBackoffTime(1, 32, 20)
mqtt_client.configureOfflinePublishQueueing(-1)  # Infinite offline publish queueing
mqtt_client.configureDrainingFrequency(2)  # Draining: 2 Hz
mqtt_client.configureConnectDisconnectTimeout(10)  # 10 sec
mqtt_client.configureMQTTOperationTimeout(5)  # 5 sec

# Define MQTT topics
WEIGHT_TOPIC = "pillbox/weight"
STATUS_TOPIC = "box/1/data"
REMINDER_TOPIC = "pillbox/reminder"

# GPIO Setup
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# Setup HX711
def setup_sensor():
    hx = HX711(5, 6)  # Replace with your GPIO pins
    hx.reset()
    return hx

# Tare the Load Cell (Offset Correction)
def tare(hx):
    print("Taring... Ensure the load cell is empty.")
    time.sleep(2)
    raw_data = [hx.get_raw_data()[0] for _ in range(20)]
    offset = sum(raw_data) / len(raw_data)
    print(f"Tare Offset: {offset}")
    return offset

# Calibration for Scaling Factor (based on mg)
def calibrate(hx, offset, known_weight_mg):
    print(f"Place a known weight ({known_weight_mg}mg) on the load cell.")
    time.sleep(15)  # Wait for the known weight to be placed
    raw_data = [hx.get_raw_data()[0] for _ in range(10)]
    raw_average = sum(raw_data) / len(raw_data)
    scaling_factor = (raw_average - offset) / known_weight_mg
    print(f"Calibration complete. Scaling Factor: {scaling_factor}")
    if scaling_factor <= 0:
        raise ValueError("Invalid scaling factor. Please recalibrate.")
    return scaling_factor

# Get Calibrated Weight (in mg)
def get_weight(hx, offset, scaling_factor):
    raw_data = [hx.get_raw_data()[0] for _ in range(5)]
    raw_average = sum(raw_data) / len(raw_data)
    weight_mg = (raw_average - offset) / scaling_factor
    weight_mg = max(weight_mg, 0)  # Ensure weight is non-negative
    return weight_mg

# Publish Current Weight to MQTT Topic
def publish_weight(weight_mg):
    payload = json.dumps({"weight": round(weight_mg, 4)})  # Round to 4 decimal places for mg
    mqtt_client.publish(WEIGHT_TOPIC, payload, 1)
    print(f"Published to {WEIGHT_TOPIC}: {payload}")

# Publish Alert to MQTT Topic
def publish_status():
    payload = json.dumps({
        "log": "Medication has been taken",
        "medication_taken_status": True,
        "user_id": 1,
        "alert_recipients": [1, 2, 3]
    })
    mqtt_client.publish(STATUS_TOPIC, payload, 1)
    print(f"Published to {STATUS_TOPIC}: {payload}")

# Publish Reminder Messages
def send_reminder(message):
    payload = json.dumps({"message": message})
    mqtt_client.publish(REMINDER_TOPIC, payload, 1)
    print(f"Published to {REMINDER_TOPIC}: {payload}")

# Monitor Weight Changes and Publish Updates
def read_and_publish(hx, offset, scaling_factor):
    previous_weight_mg = get_weight(hx, offset, scaling_factor)

    while True:
        current_weight_mg = get_weight(hx, offset, scaling_factor)
        print(f"Calibrated Weight: {current_weight_mg:.2f} mg")

        # Check for a significant weight change (medication taken)
        if previous_weight_mg - current_weight_mg > 19:  # Adjust threshold as needed (100mg)
            print("Significant weight reduction detected. Updating status...")
            publish_status()
            send_reminder("Time to refill you medication!")
        
        previous_weight_mg = current_weight_mg  # Update previous weight
        publish_weight(current_weight_mg)
        time.sleep(10)

# Schedule Regular Reminder Notifications
def reminder_loop():
    while True:
        send_reminder("Time to take your medication!")
        time.sleep(21600)  # Send reminders every 6 hours

# Main Function
if __name__ == "__main__":
    print("Connecting to AWS IoT Core...")
    mqtt_client.connect()
    print("Connected! Ready to monitor weights and send reminders.")

    # Sensor setup
    hx = setup_sensor()
    offset = tare(hx)

    # Prompt for known weight during calibration (in mg)
    known_weight_mg = float(input("Enter the known calibration weight in mg (e.g., 1000 for 1kg): "))
    scaling_factor = calibrate(hx, offset, known_weight_mg)

    # Send a test reminder immediately
    #print("Sending test reminder...")
    send_reminder("Time to take your medication!")  # This will publish to the 'pillbox/reminder' MQTT topic

    # Start weight monitoring and reminder threads
    print("Starting weight monitoring and reminders...")
    Thread(target=read_and_publish, args=(hx, offset, scaling_factor)).start()
    Thread(target=reminder_loop).start()
