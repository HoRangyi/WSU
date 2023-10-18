from twilio.rest import Client

def send_sms(to, body):
    # Twilio 계정 정보
    account_sid = 'AC927e0d07a453d64e08b7fe703452fcfa'
    auth_token = 'bba8614c57e3b88a8f6931cbd4c0784a'

    # Twilio 클라이언트 초기화
    client = Client(account_sid, auth_token)

    try:
        # SMS 메시지 보내기
        message = client.messages.create(
            from_='+18124962951',  # Twilio에서 제공하는 전화번호
            body=body,
            to=to  # 수신자 전화번호
        )
        # 메시지가 성공적으로 보내졌을 때 message.sid를 반환합니다.
        return message.sid
    except Exception as e:
        # 오류가 발생하면 오류 메시지를 반환합니다.
        return str(e)
    
to_phone_number = '+821062346995'
message_body = '오류가 너무싫다'
result = send_sms(to_phone_number, message_body)

if 'error' in result.lower():
    print('SMS 전송 실패:', result)
else:
    print('SMS 전송 성공:', result)