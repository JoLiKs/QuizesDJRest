import os
import time

import bs4 as bs4
import schedule
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session



data = []
engine = create_engine('sqlite:///db.sqlite3')
session = scoped_session(sessionmaker(bind=engine))
tableQuize = sqlalchemy.Table('quizes_quize', sqlalchemy.MetaData(), autoload_with=engine)


def getQuizes():
    i = session.query(tableQuize).distinct()
    shares = [x for x in i]
    if len(shares) == 0: return 0
    return shares



def job():
    q = getQuizes()
    for ob in q:
        if not os.path.exists(f"question-{ob.id}.html"):
            with open("template.html", encoding='utf-8') as inf:
                txt = inf.read()
                soup = bs4.BeautifulSoup(txt)
            target = soup.find_all(text='child')
            for v in target:
                v.replace_with(v.replace('child', str(ob.id)))
            target = soup.find_all(text='question')
            print(str(ob.question))
            for v in target:
                v.replace_with(v.replace('question', str(ob.question)))
            with open(f"question-{ob.id}.html", "w", encoding='utf-8') as outf:
                outf.write(str(soup))


schedule.every(2).seconds.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)