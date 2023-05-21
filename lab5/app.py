from flask import Flask, request
from typing import Final
import requests
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import psycopg2

app = Flask(__name__)

conn = psycopg2.connect(host="localhost", dbname="newsPW", user="postgres", password="postgres123", port=5432)

cur = conn.cursor()

TOKEN: Final = '6028285964:AAHX8-oIQZJd5pHGGnyP7A-nhJiY41_6FjI'
API_KEI: Final = "8154b9ecf5754582b677f94bf87180c9"
COUNTER = -1


# Lets us use the /help command
def start_command(chat_id):
    method = "sendMessage"
    url = f"https://api.telegram.org/bot{TOKEN}/{method}"
    data = {"chat_id": chat_id, "text": 'Hello there! I\'m a bot. What\'s up?'}
    requests.post(url, data=data)

def help_command(chat_id):
    method = "sendMessage"
    url = f"https://api.telegram.org/bot{TOKEN}/{method}"
    data = {"chat_id": chat_id, "text": 'Use "/latest", "/save", "/saved" to perform basic interaction with me! \
                                         \nAlso could try "/latest_bbc" and "/saved_bbc" for specifying author (BBC News)' }
    requests.post(url, data=data)

def save_news(chat_id):
    global COUNTER
    url = ('https://newsapi.org/v2/top-headlines?'
       'sources=bbc-news&'
       'apiKey='+API_KEI)

    response = requests.get(url)
    #
    cur.execute("""select max(id) from news""")
    id = cur.fetchone()[0] + 1
    source = response.json()["articles"][COUNTER]["author"]
    updated_source = source.replace("'", "")
    title = response.json()["articles"][COUNTER]["title"]
    updated_title = title.replace("'", "")
    print(updated_title)
    content = response.json()["articles"][COUNTER]["content"]
    updated_content = content.replace("'", "")
    cur.execute(f"""INSERT INTO news (id, source, title, content) VALUES
    ('{id}', '{updated_source}', '{updated_title}', '{updated_content}')""")
    conn.commit()
    news = news_printer(response, COUNTER)
    #
    method = "sendMessage"
    url = f"https://api.telegram.org/bot{TOKEN}/{method}"
    data = {"chat_id": chat_id, "text": 'Saving...\n' + news}
    requests.post(url, data=data)

def latest_news(chat_id):
    global COUNTER
    
    if COUNTER == 9:
        COUNTER = -1
    else: 
        COUNTER += 1
    
    url = ('https://newsapi.org/v2/top-headlines?'
       'sources=bbc-news&'
       'apiKey='+API_KEI)

    response = requests.get(url)
    
    text = news_printer(response, COUNTER)

    method = "sendMessage"
    url = f"https://api.telegram.org/bot{TOKEN}/{method}"
    data = {"chat_id": chat_id, "text": text}
    requests.post(url, data=data)

def show_news(chat_id):
  cur.execute("""select * from news""")
  response = cur.fetchall()
  for row in response:
      source = "\nSource: " + row[1]
      title = "\nTitle: " + row[2]
      content = "\nContent: " + row[3]
      message = source + title + content
      send_message(chat_id, message)

def saved_bbc(chat_id):
    cur.execute("""select * from news where source = 'BBC News';""")
    response = cur.fetchall()
    for row in response:
        source = "\nSource: " + row[1]
        title = "\nTitle: " + row[2]
        content = "\nContent: " + row[3]
        message = source + title + content
        send_message(chat_id, message)

def latest_bbc(chat_id):
    global COUNTER
    
    if COUNTER == 9:
        COUNTER = -1
    else: 
        COUNTER += 1
    
    url = ('https://newsapi.org/v2/top-headlines?'
       'sources=bbc-news&'
       'apiKey='+API_KEI)

    response = requests.get(url)

    while response.json()["articles"][COUNTER]["author"] != "BBC News":
        COUNTER += 1
    
    text = news_printer(response, COUNTER)

    method = "sendMessage"
    url = f"https://api.telegram.org/bot{TOKEN}/{method}"
    data = {"chat_id": chat_id, "text": text}
    requests.post(url, data=data)

def news_printer(response, iterator):
        # header = f"\n-----------------news {iterator}--------------------"
        source = "\nSource: " + response.json()["articles"][iterator]["author"]
        title = "\nTitle: " + response.json()["articles"][iterator]["title"]
        content = "\nContent: " + response.json()["articles"][iterator]["content"]
        # message = header + source + title + content
        message = source + title + content
        return message




@app.route("/", methods=["POST"])
def process():
    # print(request.json)
    chat_id = request.json["message"]["chat"]["id"]
    text = request.json["message"]["text"]
    print(text)
    if text == "/start":
        start = start_command(chat_id)
        send_message(chat_id, start)
    elif text == "/help":
        help = help_command(chat_id)
        send_message(chat_id, help)
    elif text == "/latest":
        latestNews = latest_news(chat_id)
        send_message(chat_id, latestNews)
    elif text == "/save":
        saveNews = save_news(chat_id)
        send_message(chat_id, saveNews)
    elif text == "/saved":
        showNews = show_news(chat_id)
        send_message(chat_id, showNews)
    elif text == "/saved_bbc":
        savedBBC = saved_bbc(chat_id)
        send_message(chat_id, savedBBC)
    elif text == "/latest_bbc":
        latestBBC = latest_bbc(chat_id)
        send_message(chat_id, latestBBC)
    else:
        send_message(chat_id, text)

    return {"ok": True}

def send_message(chat_id, text):
    method = "sendMessage"
    url = f"https://api.telegram.org/bot{TOKEN}/{method}"
    data = {"chat_id": chat_id, "text": text}
    requests.post(url, data=data)


# Run the program
if __name__ == "__main__":
    app.run()