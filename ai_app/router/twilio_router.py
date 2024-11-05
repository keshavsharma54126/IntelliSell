from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from CONSTANTS import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, USER_CONTACT, CLIENT_CONTACT
from twilio.rest import Client

import os

router = APIRouter(
    prefix = '/user'
)

@router.post('/start-user-session', tags=['twilio'])
def start_user_session():
    """
    This router end-point starts a conversation with a manually onboarded Twilio user

    :return: Session status
    """
    try:
        account_sid = os.getenv(TWILIO_ACCOUNT_SID)
        auth_token = os.getenv(TWILIO_AUTH_TOKEN)
        client = Client(account_sid, auth_token)

        message = client.messages.create(
          from_=f'whatsapp:{os.getenv(CLIENT_CONTACT)}',
          body='Hey there!\nI am Vidhi, your personal AI assistant. Feel free to ask me about your queries.',
          to=f'whatsapp:{os.getenv(USER_CONTACT)}'
        )


        print(message.sid)

    except Exception as e:
        print(f"Failed to initiate a conversation with user.\nError Stack Trace:\n{e}")
        return JSONResponse(
            status_code=status.HTTP_417_EXPECTATION_FAILED,
            content="Failed to initiate a conversation with user"
        )