from typing import Final, Dict, List
from telegram import Update, Chat
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from constants import Token, BOT_USERNAME
import time, schedule
from datetime import datetime, timezone

user_recipients = {}
user_alerts = {}
user_state = {}
freq = {}
curr_alert = {}

STATE_START = "start"

STATE_MANAGING_ALERTS = "managing_alerts"
STATE_ADD_A = "add"
STATE_REMOVE_A = "remove_A"
STATE_A_FREQ = "alert_frequency"
STATE_A_DATE = "alert_date"
STATE_A_DAY = "alert_day"
STATE_A_NAME = "alert_name"

STATE_MANAGING_USERS = "managing_users"
STATE_ADD_R = "add"
STATE_REMOVE_R = "remove_R"

#Start
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text('Welcome to the smartbox bot! \nUse /help or the menu to view all the commands')  # first thing the bot says when you say start

#help
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    help_text = (
        "Hi! How can I help you today? Here are the commands you can use:\n\n"
        "/start - Start interacting with the bot\n"
        "/help - Show this help message\n"
        "/manage_users - Manage your recipient list (view, add, or remove recipients)\n"
        "/manage_alerts - Set a time for medication alerts\n"
    )
    await update.message.reply_text(help_text)

def is_valid_datetime(input_string, format_string):
    try:
        datetime.strptime(input_string, format_string)
        return True
    except ValueError:
        return False

# manage alerts
async def manage_users_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.message.chat.id

    # Set the user's state to managing users
    user_state[user_id] = STATE_MANAGING_USERS

    # Ask the user to choose an action
    await update.message.reply_text(
        "Sure! Would you like to:\n"
        "View recipients\n"
        "Add recipients\n"
        "Remove recipients\n"
        "Please reply with 'view', 'add', 'remove' or 'exit'."
    )

async def view_recipients(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.message.chat.id
    recipients = user_recipients.get(user_id, [])
    
    if recipients:
        await update.message.reply_text(f"Your recipients: {', '.join(recipients)}")
    else:
        await update.message.reply_text("You have no recipients.")
    await update.message.reply_text("Please reply with 'view', 'add', or 'remove' or 'exit' to mange users or exit manage user menu ")        


async def add_recipients(update: Update, context: ContextTypes.DEFAULT_TYPE, recipients):
    user_id = update.message.chat.id
    added = []
    existing = []
    current_recipients = user_recipients.get(user_id, [])
    invalid = []

    # check to see if input contains any existing users
    for recipient in recipients:
        if recipient in current_recipients:
            existing.append(recipient)
        elif len(recipient) >=6 and len(recipient) <= 33: # telegam usernames have 5-32 char, +1 cause @
            added.append(recipient)
        else:
            invalid.append(recipient)
                
    if added:
        user_recipients[user_id] = user_recipients.get(user_id, []) + added
        await update.message.reply_text(f"Added recipients: {', '.join(added)}.")
    if existing:
        await update.message.reply_text(f"{', '.join(existing)} are existing recipients.")
    if invalid:
        await update.message.reply_text(f"{', '.join(invalid)} are invalid recipients.")

    user_state[user_id] = STATE_MANAGING_USERS  # Reset user state
    await update.message.reply_text("Please reply with 'view', 'add', or 'remove' or 'exit' to mange users or exit manage user menu ")        


async def remove_recipients(update: Update, context: ContextTypes.DEFAULT_TYPE, recipients):
    user_id = update.message.chat.id
    removed = []
    current_recipients = user_recipients.get(user_id, [])
    for recipient in recipients:
        if recipient in current_recipients:
            current_recipients.remove(recipient)
            removed.append(recipient)
        else:
            await update.message.reply_text(f"Recipient {recipient} not in users list.")
    if removed:    
        await update.message.reply_text(f"Removed recipients: {', '.join(removed)}")
    user_state[user_id] = STATE_MANAGING_USERS  # Reset user state
    await update.message.reply_text("Please reply with 'view', 'add', or 'remove' or 'exit' to mange users or exit manage user menu ")        

#set alerts
async def set_alert_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.message.chat.id

    # Set the user's state to managing users
    user_state[user_id] = STATE_MANAGING_ALERTS

    # Ask the user to choose an action
    await update.message.reply_text(
        "Sure! Would you like to:\n"
        "View alerts\n"
        "Add alerts\n"
        "Remove alerts\n"
        "Please reply with 'view', 'add', 'remove' or 'exit'."
    )

async def view_alerts(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.message.chat.id
    alerts = user_alerts.get(user_id, [])
    
    if alerts:
        alert_text = "Your alerts:\n\n"

        for alert in alerts:
            if alert[-1] == 'weekly':
                alert_text += f"{alert[0]} will ring every {alert[1]} at {alert[2]}\n"
            elif alert[-1] == 'daily':
                alert_text += f"{alert[0]} will ring every day at {alert[1]}\n"
            elif alert[-1] == 'once':
                alert_text += f"{alert[0]} will ring at {alert[2]} on {alert[1]}\n"
            elif alert[-1] == 'monthly':
                alert_text += f"{alert[0]} will ring monthly on {alert[1]} at {alert[2]}\n"
    
        await update.message.reply_text(alert_text)
    else:
        await update.message.reply_text("You have no alerts set up.")
    await update.message.reply_text("Please reply with 'view', 'add', or 'remove' or 'exit' to mange alerts or exit manage alerts menu ")  

async def add_alert(update: Update, context: ContextTypes.DEFAULT_TYPE, alert):
    user_id = update.message.chat.id
    current_alerts = user_alerts.get(user_id, [])

    # check to see if input contains any existing users
    if alert not in current_alerts :
        user_alerts[user_id] = user_alerts.get(user_id, []) + [alert]
        await update.message.reply_text(f"Added alert: {alert[0]}")

    else: 
        await update.message.reply_text(f"{alert[0]} is an existing alert ")
 
    user_state[user_id] = STATE_MANAGING_ALERTS  # Reset user state
    await update.message.reply_text("Please reply with 'view', 'add', or 'remove' or 'exit' to mange alerts or exit manage alerts menu ")        

async def remove_alerts(update: Update, context: ContextTypes.DEFAULT_TYPE, index):
    user_id = update.message.chat.id
    current_alerts = user_alerts.get(user_id, [])
    
    alert = current_alerts[index]
    current_alerts.remove(alert)
                
    await update.message.reply_text(f"Removed alert: {alert[0]}.")
    
    user_state[user_id] = STATE_MANAGING_ALERTS  # Reset user state
    await update.message.reply_text("Please reply with 'view', 'add', or 'remove' or 'exit' to mange alerts or exit manage alerts menu ")
# Responses

def handle_response(text):
    processed = text.lower()
    if any(word in processed for word in ["hello", "hi", "hey"]):
        return 'Hey there! Welcome to the smartbox bot! \nUse /help or the menu to view all the commands'
    else:
        return 'I don\'t understand. Please try /start or /help'

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.message.chat.id
    text = update.message.text.strip().lower()  # Get the incoming text and make it lowercase

    #check if in a group [BUGGY, NEED TO FIX]
    if update.message.chat.type in [Chat.GROUP, Chat.SUPERGROUP]:
        if not text.startswith(f"@{BOT_USERNAME.lower()}"):
            # Ignore messages that don't directly mention the bot in a group
            return

        # Remove the mention from the text (e.g., "@botname hello" -> "hello")
        text = text.replace(f"@{BOT_USERNAME.lower()}", "").strip()

    if user_id not in user_state or user_state[user_id] is None:
        response = handle_response(text)  # Get a response based on keywords
        await update.message.reply_text(response)  # Send the response to the user
        return

    # Check the user's state and proceed based on it
    state = user_state.get(user_id)

    if state == STATE_MANAGING_USERS:
        if text == 'view':
            # Proceed to view recipients
            await view_recipients(update, context)
            
        elif text == 'add':
            # Proceed to add recipients
            await update.message.reply_text("Please provide the usernames to add in the format: @User1, @User2")
            user_state[user_id] = STATE_ADD_R  # Set user state to 'add'

        elif text == 'remove':
            # Proceed to remove recipients
            await update.message.reply_text("Please provide the usernames to remove in the format: @User1, @User2")
            user_state[user_id] = STATE_REMOVE_R  # Set user state to 'remove'

        elif text == 'exit':
            user_state[user_id] = None
            await update.message.reply_text("Exited managing users.")
        else:
            await update.message.reply_text("Invalid option. Please reply with 'view', 'add', 'remove' or 'exit' to mange users or exit.")
            return

    elif state == STATE_ADD_R:
        recipients = [name.strip() for name in text.split(',')]
        await add_recipients(update, context, recipients) 

    elif state == STATE_REMOVE_R:
        recipients = [name.strip() for name in text.split(',')]
        await remove_recipients(update, context, recipients)  

    elif state == STATE_MANAGING_ALERTS:
        if text == 'view':
            # Proceed to view recipients
            await view_alerts(update, context)
            
        elif text == 'add':
            # Proceed to add recipients
            await update.message.reply_text("Please provide the alert type to add. Reply 'once', 'daily', 'weekly', 'monthly'") #
            user_state[user_id] = STATE_A_FREQ  # Set user state to 'add'

        elif text == 'remove':
            # Proceed to remove recipients
            await update.message.reply_text("Please provide the name of the alert you would like to remove or 'all' to clear all alerts") #
            user_state[user_id] = STATE_REMOVE_A  # Set user state to 'remove'

        elif text == 'exit':
            user_state[user_id] = None
            freq[user_id] = None
            curr_alert[user_id] = None
            await update.message.reply_text("Exited managing alerts.")
        else:
            await update.message.reply_text("Invalid option. Please reply with 'view', 'add', 'remove' or 'exit' to mange users or exit.")
            return

    elif state == STATE_A_FREQ:
        if text == 'once':
            freq[user_id] = 'once'
            await update.message.reply_text("Please provide the date and time of the alert in 'YYYY-MMM-DD-HH-MM' format, using 24H timing") #
            user_state[user_id] = STATE_A_DATE 

        elif text=='monthly':
            freq[user_id] = 'monthly'
            await update.message.reply_text("Please provide the date and time of the alert in 'DD-HH-MM' format, using 24H timing") #
            user_state[user_id] = STATE_A_DATE 

        elif text == 'daily':
            freq[user_id] = 'daily'
            await update.message.reply_text("Please provide the time of the alert in 'HH-MM' format, using 24H timing") #
            user_state[user_id] = STATE_A_DATE 

        elif text == 'weekly':
            freq[user_id] = 'weekly'
            await update.message.reply_text("Please provide the time and day of the alert in 'HH-MM-DDD' eg. 09-00-WED format, using 24H timing") #
            user_state[user_id] = STATE_A_DATE
        else :
            await update.message.reply_text("Invalid option. Please reply with 'view', 'add', 'remove' or 'exit' to mange users or exit.")
            return
 
    elif state == STATE_A_DATE:
        formattedInput = text.strip()

        frequency = freq[user_id]
        if frequency == 'once': 
            format_string = '%Y-%b-%d-%H-%M'

            if is_valid_datetime(formattedInput, format_string):
                date = formattedInput[9:11] + ' ' + formattedInput[5:8].upper() + " " + formattedInput[:4] 
                time = formattedInput[12:14] + formattedInput[15:]
                curr_alert[user_id] = [date, time, frequency]
                await update.message.reply_text("Please provide the name of this alert") 
                user_state[user_id] = STATE_A_NAME
            else:
                await update.message.reply_text("Invalid date and time format. Please use 'YYYY-MMM-DD-HH-MM'. Example: 2024-Mar-20-14-30")
                return

        elif frequency == 'monthly':
            format_string = '%d-%H-%M'

            if is_valid_datetime(formattedInput, format_string):
                day, time = formattedInput.split('-')[0], ''.join(formattedInput.split('-')[1:])
                curr_alert[user_id] = [day, time, frequency]
                await update.message.reply_text("Please provide the name of this alert")
                user_state[user_id] = STATE_A_NAME
            else:
                await update.message.reply_text("Invalid date and time format. Please use 'DD-HH-MM'. Example: 20-14-30")
                return

        
        elif frequency == 'daily':
            format_string = '%H-%M'  # Example: 14-30
            if is_valid_datetime(formattedInput, format_string):
                time = ''.join(formattedInput.split('-'))
                curr_alert[user_id] = [time, frequency]
                await update.message.reply_text("Please provide the name of this alert")
                user_state[user_id] = STATE_A_NAME
            else:
                await update.message.reply_text("Invalid time format. Please use 'HH-MM'. Example: 14-30")
                return
        
        elif frequency == 'weekly':
            try:
                time_temp, day = formattedInput[:5], formattedInput[6:].upper()  # Example: 14-30-WED
                format_string = '%H-%M'
                if is_valid_datetime(time_temp, format_string) and day in ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']:
                    time = ''.join(time_temp.split('-'))
                    curr_alert[user_id] = [day, time, frequency]
                    await update.message.reply_text("Please provide the name of this alert")
                    user_state[user_id] = STATE_A_NAME
                else:
                    raise ValueError
            except ValueError:
                await update.message.reply_text("Invalid time and day format. Please use 'HH-MM-DDD'. Example: 14-30-WED")
                return
                

    elif state == STATE_A_NAME:
        names = []

        if user_id in user_alerts:
                   
            alerts = user_alerts[user_id]
            for alert in alerts:
                names.append(alert[0])
        else:
            user_alerts[user_id] = []
        
        formattedInput = text.strip()
        if formattedInput not in names:
            curr_alert[user_id].insert(0,formattedInput) # alert is fully formed here
            await add_alert(update, context, curr_alert[user_id])

        else:
            await update.message.reply_text("Name already used for another alert. Please reply with an unused name")
            return
       
    elif state == STATE_REMOVE_A:
        if text == 'view':
            await view_alerts(update, context)
            user_state[user_id] = STATE_MANAGING_ALERTS
        elif text == 'all':
            user_alerts[user_id] = []
            await update.message.reply_text("All alerts deleted.")
            user_state[user_id] = STATE_MANAGING_ALERTS  # Reset user state
            await update.message.reply_text("Please reply with 'view', 'add', or 'remove' or 'exit' to mange alerts or exit manage alerts menu ")
        elif user_alerts[user_id]:
            name = text    
            found = False
            for index, alert in enumerate(user_alerts[user_id]):
                if alert[0] == name:
                    await remove_alerts(update, context, index)  
                    found = True
                    user_state[user_id] = STATE_MANAGING_ALERTS
                    break

            if found == False:
                await update.message.reply_text(f"{name} not in alert list. Reply 'view' to see your alerts. Alernatively, type the name of an alert you would like to remove.")
                user_state[user_id] = STATE_MANAGING_ALERTS
        else:
        # If there are no alerts at all for this user
            await update.message.reply_text("You have no alerts to remove. Reply with 'view' to see alerts or 'add' to create one.")
            user_state[user_id] = STATE_MANAGING_ALERTS

async def error(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f'Update {update} caused error {context.error}')

if __name__ == '__main__':
    print('Starting bot...')
    app = Application.builder().token(Token).build()
    
    # Commands
    app.add_handler(CommandHandler('start', start_command))
    app.add_handler(CommandHandler('help', help_command))
    app.add_handler(CommandHandler('manage_alerts', set_alert_command))
    app.add_handler(CommandHandler('manage_users', manage_users_command))

    # Messages
    app.add_handler(MessageHandler(filters.TEXT, handle_message))

    # Errors
    app.add_error_handler(error)

    # Poll the bot
    print('Polling...')
    app.run_polling(poll_interval=1)