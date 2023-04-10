from redis_om import (
    HashModel,
    Field,
    get_redis_connection
)
import random
import datetime as dt
from dotenv import load_dotenv
import os
from twilio.rest import Client

load_dotenv()


def generate_random_number():
    return random.randint(100000, 999999)


url = os.getenv("REDIS_OM_URL")
account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
client = Client(account_sid, auth_token)

# Tuple for appointment status
APPOINTMENT_STATUS = (
    ("pending", "Pending"),
    ("confirmed", "Confirmed"),
    ("cancelled", "Cancelled")
)


class User(HashModel):
    name: str
    phone: str = Field(index=True)
    id: str

    class Meta:
        database = get_redis_connection(url=url)


class Appointment(HashModel):
    id: str = Field(index=True)
    phone: str = Field(index=True)
    name: str
    service: str
    date: str
    time: str
    appointmentId: int = Field(index=True)
    status: str = Field(default="pending")

    class Meta:
        database = get_redis_connection(url=url)


class UserFeedback(HashModel):
    id: str = Field(index=True)
    phone: str = Field(index=True)
    feedback: str
    date: str
    time: str
    feedbackId: int = Field(index=True)

    class Meta:
        database = get_redis_connection(url=url)


class Implementor:
    # generate a formated appointment record
    def generate_appointment_record(self, appointment):
        return f"Hello {appointment.name}, your appointment is coming up on {appointment.date} at {appointment.time} and its status is {appointment.status}"

    def get_time_of_day(self):
        now = dt.datetime.now()
        if now.hour < 12:
            return "morning"
        elif now.hour < 17:
            return "afternoon"
        else:
            return "evening"

    def create_user(self, name, phone, id):
        user = User(
            name=name,
            phone=phone,
            id=id
        )

        user.save()

        return user

    def check_user(self, phone):
        try:
            user = User.find(User.phone == phone).first()
            return user
        except:
            return None

    def book_appointment(self, name, id, service, date, time, phone):
        appointment = Appointment(
            id=id,
            name=name,
            service=service,
            date=date,
            time=time,
            phone=phone,
            appointmentId=generate_random_number()
        )
        appointment.save()

        return appointment

    def check_appointment(self, id):
        try:
            appointment = Appointment.find(Appointment.id == id).first()
            return appointment
        except:
            return None

    def cancel_appointment(self, id, appointmentId):
        try:
            appointment = Appointment.find(
                Appointment.appointmentId == appointmentId, Appointment.id == id).first()
            appointment.status = "cancelled"
            appointment.save()
            return True
        except:
            return False

    def confirm_appointment(self, id, appointmentId):
        try:
            appointment = Appointment.find(
                Appointment.appointmentId == appointmentId, Appointment.id == id).first()
            appointment.status = "confirmed"
            appointment.save()
            return True
        except:
            return False

    def get_appointments(self, phone):
        try:
            appointments = Appointment.find(Appointment.phone == phone).all()
            return appointments
        except:
            return None

    def get_appointment(self, appointmentId):
        try:
            print(type(appointmentId))
            appointment = Appointment.find(
                Appointment.appointmentId == appointmentId).first()
            return appointment
        except ValueError as e:
            print(e)
            return None

    def save_feedback(
        self,
        nationalId,
        phone,
        feedback
    ):
        feedback = UserFeedback(
            id=nationalId,
            phone=phone,
            feedback=feedback,
            date=dt.datetime.now().strftime("%d/%m/%Y"),
            time=dt.datetime.now().strftime("%H:%M:%S"),
            feedbackId=generate_random_number()
        )
        feedback.save()

        return feedback

    def get_all_feedbacks(self):
        try:
            feedbacks = UserFeedback.find().all()
            return feedbacks
        except:
            return None

    def send_text_confirmation(self, phone, status):
        try:
            message = client.messages \
                .create(
                    body=f"Hello, your appointment has been {status}!",
                    from_='whatsapp:+14155238886',
                    to=f"whatsapp:+{phone}"
                )
            return message
        except:
            return None

    def approve_appointment_status(self, appointmentID):
        try:
            appointment = Appointment.find(
                Appointment.appointmentId == appointmentID).first()
            appointment.status = "confirmed"
            appointment.save()
            # send text to user

            self.send_text_confirmation(
                appointment.phone, appointment.status  # type: ignore
            )

            return True
        except:
            return False

    def reject_appointment_status(self, appointmentID):
        try:
            appointment = Appointment.find(
                Appointment.appointmentId == appointmentID).first()
            appointment.status = "cancelled"
            appointment.save()
            # send text to user

            self.send_text_confirmation(
                appointment.phone, appointment.status  # type: ignore
            )
            return True
        except:
            return False

    def get_all_appointments(self):
        try:

            appointments = Appointment.find().all()

            res_apps = []

            for appointment in appointments:
                res_apps.append({
                    "id": appointment.id,  # type: ignore
                    "name": appointment.name,  # type: ignore
                    "service": appointment.service,  # type: ignore
                    "date": appointment.date,  # type: ignore
                    "time": appointment.time,  # type: ignore
                    "phone": appointment.phone,  # type: ignore
                    "appointmentId": appointment.appointmentId,  # type: ignore
                    "status": appointment.status  # type: ignore
                })

            return res_apps

        except:
            return []


# if __name__ == "__main__":
#     Migrator().run()

#     implementor = Implementor()

#     user = implementor.check_user("254708421366")

#     print(user)
