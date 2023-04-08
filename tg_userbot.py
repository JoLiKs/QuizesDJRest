from telethon import TelegramClient, events, sync
from telethon.tl.functions.contacts import ResolveUsernameRequest
from telethon.tl.types import PeerUser, InputPeerUser, InputUser



def sendMsg(user, msg):
    api_id = 0
    api_hash = "9"
    client = TelegramClient('telethon', api_id, api_hash)
    client.start()
    user = client(ResolveUsernameRequest(user))
    user = InputUser(user.users[0].id,user.users[0].access_hash)
    client.send_message(user, msg)
    client.disconnect()
