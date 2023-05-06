import telebot
import logging

from telebot.types import Message

admin_chat_id = '-1001598482602'
bot = telebot.TeleBot('6228314454:AAGqfUnHGFcO76-7DXAgRFA6H16yTF74ECQ')

@bot.channel_post_handler()
def start_message(message: Message):
    bot.send_message(chat_id='-1001598482602', text="✌️")

bot.polling()
