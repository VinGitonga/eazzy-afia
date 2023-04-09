from twilio.rest import Client

account_sid = 'ACf31ec4f318fd4614d4142cd37ccc79d5'
auth_token = 'a446f1121158522f56865653c97290a8'
client = Client(account_sid, auth_token)

message = client.messages.create(
  from_='whatsapp:+14155238886',
  body='Your appointment is coming up on July 21 at 3PM',
  to='whatsapp:+254704260663'
)

print(message.sid)