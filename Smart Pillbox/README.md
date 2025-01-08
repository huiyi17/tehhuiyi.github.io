# Establish a secure shell (SSH) connection to Raspberry Pi
```
ssh pi@your-raspberry-pi-ip
```
# Docker Containerization
Build docker image:
```
sudo docker build -t sm-pillbox-img:latest -f Dockerfile .
```
Run docker container:
```
sudo docker run -it --privileged --name sm-pillbox-container -v $(pwd)/certs:/app/certs sm-pillbox-img:latest
```
Start docker container:
```
sudo docker start -a sm-pillbox-container
```
Stop docker container:
```
sudo docker stop sm-pillbox-container
```
# Connect Raspberry Pi
Install the AWS IoT Device SDK for Python:
On your device, run these commands.
```
cd ~
python3 -m pip install awsiotsdk
```
# Create the AWS IoT rule to insert/update data to the DynamoDB table
First, go to AWS DynamoDB dashboard and create a table.
```
https://ap-southeast-1.console.aws.amazon.com/dynamodbv2/home?region=ap-southeast-1#dashboard
```

Then, open the Rules hub of the AWS IoT console. 
```
https://ap-southeast-1.console.aws.amazon.com/iot/home?region=ap-southeast-1#/rulehub
```
Click on 'Create Rule'.

Fill in SQL statement.
```
SELECT topic() AS topic, user_id, log, medication_taken_status, alert_recipients
FROM 'box/+/data'
```

Under Rule Actions, choose Lambda and create a Lambda function with the code below.
```
import boto3
import json
import time  # For generating the current timestamp

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):

    try:
        print("Event received:", json.dumps(event))

        topic = event['topic']  # The topic will be passed by IoT Core
        box_id = topic.split('/')[1]  # Extract the second segment (topic(2))

        log = event['log']
        medication_taken_status = event['medication_taken_status']
        user_id = event['user_id']
        alert_recipients = event.get('alert_recipients', [])
        print(log, medication_taken_status, user_id, alert_recipients)

        if log is None or medication_taken_status is None or user_id is None:
            raise KeyError("Missing one or more required keys in payload")

        try:
            response = dynamodb.update_item(
                TableName='patient_data2',
                Key={'box_id': {'N': box_id}},  
                UpdateExpression="SET #log = :log, medication_taken_status = :status, user_id = :user_id, alert_recipients = :recipients",
                ExpressionAttributeNames={
                    '#log': 'log'  # Alias the reserved keyword
                },
                ExpressionAttributeValues={
                    ':log': {'S': log},
                    ':status': {'BOOL': medication_taken_status},
                    ':user_id': {'N': str(user_id)},
                    ':recipients': {'L': [{'N': str(recipient)} for recipient in alert_recipients]}
                },
                ConditionExpression="attribute_exists(box_id)", 
                ReturnValues="UPDATED_NEW"
            )
            print("Item updated:", response)
        except dynamodb.exceptions.ConditionalCheckFailedException:
            
            response = dynamodb.put_item(
                TableName='patient_data2',
                Item={
                    'box_id': {'N': box_id},
                    'log': {'S': log},
                    'medication_taken_status': {'BOOL': medication_taken_status},
                    'user_id': {'N': str(user_id)},
                    'alert_recipients': {'L': [{'N': str(recipient)} for recipient in alert_recipients]} 
                }
            )
            print("New item created:", response)

        return {"statusCode": 200, "body": "Operation successful"}

    except KeyError as e:
        print(f"Missing key in payload: {str(e)}")
        return {"statusCode": 400, "body": f"Error: Missing key {str(e)}"}
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return {"statusCode": 500, "body": f"Error: {str(e)}"}

```
Click on 'Create' to create this AWS IoT Rule.

# Create a scheduled rule for Lambda function to periodically scan the database and send the alert message back to AWS IoT Core MQTT Client if the patient haven't taken the pill. 
First, open AWS Lambda console and click on 'Create Function'. 
```
https://ap-southeast-1.console.aws.amazon.com/lambda/home?region=ap-southeast-1#/functions
```
with the code below.
```
import boto3
import json
from datetime import datetime, timezone
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
iot_client = boto3.client('iot-data', region_name='ap-southeast-1')

TABLE_NAME = "patient_data2"

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    raise TypeError

def lambda_handler(event, context):
    table = dynamodb.Table(TABLE_NAME)

    now = datetime.now(timezone.utc)
    start_of_day = datetime(now.year, now.month, now.day, 9, 0, 0, tzinfo=timezone.utc)
    start_timestamp = int(start_of_day.timestamp())

    response = table.scan(
        FilterExpression="medication_taken_status = :status",
        ExpressionAttributeValues={
            ":status": False,
        }
    )
    
    items = response.get('Items', [])

    if items:
        for item in items:
            send_alert(item)
    
    return {
        "statusCode": 200,
        "message": f"Checked {len(items)} items.",
        "items": items
    }

def send_alert(item):
    payload = {
        "alert": "Hi patient, you have not taken your medication on time. Please take it as soon as possible!",
        "record": item
    }
    iot_client.publish(
        topic="medication/alerts",
        qos=1,
        payload=json.dumps(payload, default=decimal_default)
    )
    print(f"Alert sent for item: {item}")
```

Then, open the Amazon EventBridge console and create a scheduled rule.
```
https://ap-southeast-1.console.aws.amazon.com/events/home?region=ap-southeast-1#/rules
```

For the ```rule type```, choose ```Schedule```.

For ```schedule type```, we choose ```regular rate``` and set it to ```1 minute``` for the demonstration purposes. We can also choose a fine-grained schedule that runs at a specific time by defining the cron expression for the schedule. 

Then, for ```target type```, choose ```AWS Service``` and select the lambda function that was created. 

Lastly, click on ```Create Rule``` to create the rule.
