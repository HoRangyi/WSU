from twilio.rest import Client

account_sid = ''
auth_token = ''
client = Client(account_sid, auth_token)

def Message():
    message = client.messages.create(
    from_='+',
    body='1',
    to='+'
    )

    print(message.sid)

#Message()

