from twilio.rest import Client

account_sid = 'AC927e0d07a453d64e08b7fe703452fcfa'
auth_token = 'bba8614c57e3b88a8f6931cbd4c0784a'
client = Client(account_sid, auth_token)

def Message():
    message = client.messages.create(
    from_='+18124962951',
    body='1',
    to='+821062346995'
    )

    print(message.sid)

#Message()

