
from flask import Flask, jsonify, request, json
from twilio.twiml.messaging_response import MessagingResponse
import re
from db import (Implementor, Appointment)
from redis_om import Migrator
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Initialize the database with indexes
Migrator().run()

# Initialize the implementor

implementor = Implementor()

# Initial msg sent to user
init_msg = """
Hello, welcome to the Eazzy Afya Online Service
Please reply with your name and ID number to continue.
E.g. John Doe, 12345678
"""

# Display Menu
menu = """
1. Book an appointment
2. Cancel an appointment
3. View appointments
4. View our services
5. View our locations
6. Contacts
7. Check Appointment
8. Send a Feedback

Reply with the number of the option you want to select

To Exit, type bye
"""

# book appointment text with service, date and time
book_appointment_menu = """
Please reply with your name and ID number, service, date and time to book an appointment.
E.g. John Doe, 12345678, General Checkup, 2021-01-01, 12:00
"""

# Our services List
services = """
1. General Checkup
2. Dental
3. Eye
4. Pharmacy
5. Physiotherapy
6. Radiology
7. Sexual Health
"""

# Our locations List
locations = """
1. Nairobi
2. Mombasa
3. Kisumu
4. Eldoret
5. Nakuru
6. Nyeri
7. Thika
"""

# Contacts List
contacts = """
1. 0708421366
2. 0769553831
3. 0704260663
4. 0769686091
"""

# write a regex for checking reply for name and ID as example above

name_id_regex = re.compile(r'^([a-zA-Z]+)(?:\s([a-zA-Z]+))?,?\s?(\d{7,8})$')

# regex for booking appointment

book_appointment_regex = re.compile(
    r'^([a-zA-Z]+)(?:\s([a-zA-Z]+))?,?\s?(\d{7,8}),?\s?([a-zA-Z]+),?\s?(\d{4}-\d{2}-\d{2}),?\s?(\d{2}:\d{2})$')


# regex for cancelling appointment /cancel-ID-appointmentID and ID should 7 or 8 digits and appointment ID to be 6 digits

cancel_appointment_regex = re.compile(r'^/cancel-(\d{7,8})-(\d{6})$')

# regex for checking appointment /check-appointmentID and appointment ID to be 6 digits

check_appointment_regex = re.compile(r'^/check-(\d{6})$')

# regex for sending feedback /feedback feedbacktext

feedback_regex = re.compile(r'^/feedback (.*)$')


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/whatsapp", methods=['GET', 'POST'])
def incoming_sms():
    """
    This function is called when a user sends a message to our Whatsapp number
    """
    profile_name = request.values.get("ProfileName")
    phoneno = request.values.get('WaId')
    body = request.values.get('Body', None)

    user = implementor.check_user(phoneno)

    # Start our TwiML response
    resp = MessagingResponse()

    # Determine the right reply for this message
    if body == 'hello':
        print("Yes")
        resp.message(
            f"Good {implementor.get_time_of_day()} {profile_name}, welcome to the Eazzy Afya Online Service.\n"
            "Please reply with the number of the service you would like to access.\n"
            "E.g. 1\n"
            +
            menu
        )

    elif name_id_regex.match(body):  # type: ignore
        name_match = name_id_regex.match(body)  # type: ignore
        name = name_match.group(1)
        id = name_match.group(3)

        
        if user is None:
            implementor.create_user(name, phoneno, id)

            resp.message(
                "Thank you for your details. Please wait while we process your request.\n"

                "Please reply with the number of the service you would like to access.\n"
                "E.g. 1\n"
                +
                menu
            )
        else:
            resp.message(
                "You have already registered. Please reply with the number of the service you would like to access.\n"
                "E.g. 1\n"
                +
                menu
            )

    elif body == '1':
        resp.message(
            "Please reply with the number of the service you would like to access.\n"
            "E.g. 1\n"
            +
            book_appointment_menu
        )

    elif book_appointment_regex.match(body):  # type: ignore
        print("Imagine")
        book_appointment_match = book_appointment_regex.match(
            body)  # type: ignore
        name = book_appointment_match.group(1)
        id = book_appointment_match.group(3)
        service = book_appointment_match.group(4)
        date = book_appointment_match.group(5)
        time = book_appointment_match.group(6)

        

        if user is None:
            resp.message(
                "You have not registered. Please reply with your name and ID number to continue.\n"
                "E.g. John Doe, 12345678\n"
            )
        else:
            appointment = implementor.book_appointment(
                name, id, service, date, time, phoneno)

            resp.message(
                "Thank you for booking an appointment with us.\n"
                f"Your appointment details are as follows:\n"
                f"Name: {name}\n"
                f"ID: {id}\n"
                f"Service: {service}\n"
                f"Date: {date}\n"
                f"Time: {time}\n"
                f"Phone Number: {phoneno}\n"
                f"Appointment ID: {appointment.appointmentId}\n\n"
                "Please reply with the number of the service you would like to access.\n"
                "E.g. 1\n"
                +
                menu
            )

    elif body == '2':
        # we now cancel the appointment
        resp.message(
            "Please reply with your national ID and appointment ID you would like to cancel.\n"
            "E.g. /cancel-29562636-123456\n"
        )

    elif cancel_appointment_regex.match(body):  # type: ignore
        cancel_appointment_match = cancel_appointment_regex.match(
            body)  # type: ignore
        id = cancel_appointment_match.group(1)
        appointment_id = cancel_appointment_match.group(2)

        user = implementor.check_user(phoneno)

        if user is None:
            resp.message(
                "You have not registered. Please reply with your name and ID number to continue.\n"
                "E.g. John Doe, 12345678\n"
            )

        else:
            appointment = implementor.cancel_appointment(id, appointment_id)

            if not appointment:
                resp.message(
                    "You have not booked an appointment. Please reply with the number of the service you would like to access.\n"
                    "E.g. 1\n"
                    +
                    menu
                )
            else:
                resp.message(
                    "Thank you for cancelling your appointment with us.\n"
                    "Please reply with the number of the service you would like to access.\n"
                    "E.g. 1\n\n"
                    +
                    menu
                )

    elif body == '3':
        user = implementor.check_user(phoneno)

        if user is None:
            resp.message(
                "You have not registered. Please reply with your name and ID number to continue.\n"
                "E.g. John Doe, 12345678\n"
            )

        else:
            appointments = implementor.get_appointments(phoneno)

            if appointments == None:
                resp.message(
                    "You have not booked an appointment. Please reply with the number of the service you would like to access.\n"
                    "E.g. 1\n"
                    +
                    menu
                )
            else:
                resp.message(
                    "Your appointments are as follows:\n"
                    +
                    "\n".join([implementor.generate_appointment_record(appointment)
                              for appointment in appointments])
                    +
                    "\n\nPlease reply with the number of the service you would like to access.\n"
                    "E.g. 1\n\n"
                    +
                    menu
                )

    elif body == '4':
        resp.message(
            "These Are the services we offer.\n"
            +
            services
            +
            "Please reply with the number of the service you would like to access.\n"
            "E.g. 1\n"
            +
            menu
        )

    elif body == '5':
        resp.message(
            "You can find us in these locations.\n"
            +
            locations
            +
            "\n\nPlease reply with the number of the service you would like to access.\n"
            "E.g. 1\n"
            +
            menu
        )

    elif body == '6':
        resp.message(
            "You can contact us on these numbers.\n"
            +
            contacts
            +
            "\n\nPlease reply with the number of the service you would like to access.\n"
            "E.g. 1\n"
            +
            menu
        )

    elif body == '7':
        # Now we request the user to send the appointment to check the appointment
        resp.message(
            "Please reply with your appointment ID you would like to check.\n"
            "E.g. /check-123456\n"
        )

    elif check_appointment_regex.match(body):  # type: ignore
        check_appointment_match = check_appointment_regex.match(
            body)  # type: ignore
        appointment_id = check_appointment_match.group(1)

        print(appointment_id)

        user = implementor.check_user(phoneno)

        if user is None:
            resp.message(
                "You have not registered. Please reply with your name and ID number to continue.\n"
                "E.g. John Doe, 12345678\n"
            )

        else:
            appointment = implementor.get_appointment(int(appointment_id))

            if not appointment:
                resp.message(
                    "You have not booked an appointment. Please reply with the number of the service you would like to access.\n"
                    "E.g. 1\n"
                    +
                    menu
                )
            else:
                app = Appointment.get(appointment.pk)
                resp.message(
                    "Your appointment is as follows:\n"
                    +
                    f"Your appointment details are as follows:\n"
                    f"Name: {app.name}\n"  # type: ignore
                    f"ID: {appointment.id}\n"  # type: ignore
                    f"Service: {appointment.service}\n"  # type: ignore
                    f"Date: {appointment.date}\n"  # type: ignore
                    f"Time: {appointment.time}\n"  # type: ignore
                    f"Phone Number: {appointment.phone}\n"  # type: ignore
                    # type: ignore
                    # type: ignore
                    f"Appointment ID: {appointment.appointmentId}\n" # type: ignore
                    # type: ignore
                    # type: ignore
                    f"Appointment Status: {appointment.status}\n\n" # type: ignore
                    +
                    "\nPlease reply with the number of the service you would like to access.\n"
                    "E.g. 1\n"
                    +
                    menu
                )

    elif body == '8':
        # request user to send feedback of our services
        resp.message(
            "Please reply with your feedback.\n"
            "E.g. /feedback I love your services\n"
        )

    elif feedback_regex.match(body):  # type: ignore
        feedback_match = feedback_regex.match(body)  # type: ignore
        feedback = feedback_match.group(1)

        user = implementor.check_user(phoneno)

        if user is None:
            resp.message(
                "You have not registered. Please reply with your name and ID number to continue.\n"
                "E.g. John Doe, 12345678\n"
            )

        else:
            implementor.save_feedback(
                user.id, phoneno, feedback)  # type: ignore

            resp.message(
                "Thank you for your feedback.\n"
                "Please reply with the number of the service you would like to access.\n"
                "E.g. 1\n"
                +
                menu
            )

    elif body == 'bye':
        resp.message(
            "Thank you for using our services. We hope to see you again soon.\n"
        )

    else:
        resp.message(
            "Invalid input. Please reply with the number of the service you would like to access.\n"
            "E.g. 1\n"
            +
            menu
        )

    return str(resp)

@app.route("/approve-appointments", methods=['POST'])
def approve():
    data = json.loads(request.data)

    data = dict(data)

    appointmentId = data["appointmentId"]

    approval_status = implementor.approve_appointment_status(appointmentId)

    if approval_status:
        return "Approved", 200
    else:
        return "Not Approved", 400
    
@app.route("/cancel-appointments", methods=['POST'])
def cancel():
    data = json.loads(request.data)

    data = dict(data)

    appointmentId = data["appointmentId"]

    cancel_status = implementor.reject_appointment_status(appointmentID=appointmentId)

    if cancel_status:
        return "Cancelled", 200
    else:
        return "Not Cancelled", 400
    
@app.route("/get-appointments", methods=['GET'])
def get_appointments():
    appointments = implementor.get_all_appointments()

    return jsonify(appointments) # type: ignore

@app.route("/get-feedbacks", methods=['GET'])
def get_all_feedbacks():
    feedbacks = implementor.get_all_feedbacks()

    return jsonify(feedbacks)


if __name__ == "__main__":
    app.run(debug=True)
