import math
import sys
import numpy as np
import pandas as pd
import mongohelper
import alpacarequests
import time
import datetime
from datetime import timedelta
from pytz import timezone

tzone = timezone('EST')

# command line args
# stock ticker, name of collection, money to trade, live|sim
cmdlineargs = sys.argv
stock = cmdlineargs[1]
stock = stock.upper()
stockt = stock


class MyClass:
    pass


stock = pd.read_csv("data/" + stockt.upper() + "_data.csv", index_col="Date")
myvals = MyClass()
myvals.havepos = False
myvals.mystocks = 0
myvals.paperdough = float(cmdlineargs[3])

databasebuffer = []  # we are going to append({key:value})
# coll = "traderaNdbKRWEcFU8" #collection to put into: traderaNdbKRWEcFU8
# coll = "traderaNanLXYCcGB89"
coll = cmdlineargs[2]


def trader(x):
    ravg14 = stock.iloc[-31:-1].rolling(14).mean()['Close']
    ravg4 = stock.iloc[-31:-1].rolling(4).mean()['Close']
    ravg14 = ravg14.iloc[-1]
    ravg4 = ravg4.iloc[-1]
    v_avg = stock.iloc[-31:-1].rolling(4).mean()['Volume']
    quote = alpacarequests.getQuote(stockt)

    if (ravg4 > ravg14 and stock.iloc[-1]['rsi'] > 33 and not x.havepos):
        print("YES current day is below std\nBUY")
        # print(intc.iloc[day])
        # print(ravg30 - std30)
        current = quote['price']
        # print(x.paperdough)
        if (current < x.paperdough):
            x.mystocks = math.floor(x.paperdough / current)
            x.paperdough = x.paperdough - (x.mystocks * current)
            x.havepos = True
            databasebuffer.append(
                {"stock": stockt,
                 "date": datetime.datetime.now().replace(microsecond=0).isoformat(),
                 "transaction": "buy",
                 "price": current,
                 "amount": x.mystocks,
                 "total_price": -1 * x.mystocks * current})
    elif (ravg4 < ravg14 and stock.iloc[-1]['rsi'] < 80 and x.havepos):
        print("YES current day is above std\nSELL")
        current = quote['price']
        databasebuffer.append(
            {"stock": stockt,
             "date": datetime.datetime.now().replace(microsecond=0).isoformat(),
             "transaction": "sold",
             "price": current,
             "amount": x.mystocks,
             "total_price": x.mystocks * current})
        x.paperdough = x.paperdough + (x.mystocks * current)
        x.mystocks = 0
        x.havepos = False
        # databasebuffer.append({"transaction":"sold","price":current,"amount":x.mystocks,"total_price":x.mystocks*current})
    else:
        pass


def check_trade_hours():
    value2return = True
    current_time = datetime.datetime.now(tzone)
    if datetime.datetime.now(tzone).weekday() >= 5:
        value2return = False
    else:
        if current_time.time() > datetime.time(15, 30):
            daydelta = (current_time + timedelta(days=1)).date()
            daydelta = datetime.datetime.combine(daydelta, datetime.time(9, 30, tzinfo=tzone))
            time2sleep = (daydelta - current_time).total_seconds()
        elif current_time.time() < datetime.time(9, 30):
            daydelta = datetime.datetime(current_time.year, current_time.month, current_time.day, 9, 30, tzinfo=tzone)
            time2sleep = (daydelta - current_time).total_seconds()
        time.sleep(time2sleep)

    return value2return


def performtrade(x, day):
    if (day < 30):
        return
    ravg14 = stock.iloc[day-30:day].rolling(14).mean()['Close']
    ravg4 = stock.iloc[day-30:day].rolling(4).mean()['Close']
    ravg14 = ravg14.iloc[-1]
    ravg4 = ravg4.iloc[-1]
    v_avg = stock.iloc[day-30:day].rolling(4).mean()['Volume']
    quote = alpacarequests.getQuote(stockt)
    # to get the date I could use intc.iloc[i].name and it will give the date
    if (ravg4 > ravg14 and stock.iloc[day]['rsi'] > 33 and not x.havepos):
        print("YES rsi looks good\nBUY")
        # print(intc.iloc[day])
        # print(ravg30 - std30)
        current = stock.iloc[day]['Open']
        # print(x.paperdough)
        if (current < x.paperdough):
            x.mystocks = math.floor(x.paperdough / current)
            x.paperdough = x.paperdough - (x.mystocks * current)
            x.havepos = True
            databasebuffer.append(
                {"stock": stockt,
                 "date": datetime.datetime.now().replace(microsecond=0).isoformat(),
                 "transaction": "buy",
                 "price": current,
                 "amount": x.mystocks,
                 "total_price": -1 * x.mystocks * current})
    elif (ravg4 < ravg14 and stock.iloc[-1]['rsi'] < 80 and x.havepos):
        print("YES time to sell \nSELL")
        current = stock.iloc[day]['Open']
        databasebuffer.append(
            {"stock": stockt,
             "date": datetime.datetime.now().replace(microsecond=0).isoformat(),
             "transaction": "sold",
             "price": current,
             "amount": x.mystocks,
             "total_price": x.mystocks * current})
        x.paperdough = x.paperdough + (x.mystocks * current)
        x.mystocks = 0
        x.havepos = False
        # databasebuffer.append({"transaction":"sold","price":current,"amount":x.mystocks,"total_price":x.mystocks*current})
    else:
        pass
    #if (day > 200):
        #print(stock)
        # print("my paper is: " + str (x.paperdough))


def dailycheck():
    for day in range(1, len(stock)):  # len(intc)):
        # print(amd.iloc[day])
        performtrade(myvals, day)


def dailytrade():
    # somechecks and some sleeps
    trading = True
    while trading:
        databasebuffer = []
        trading = check_trade_hours()
        trader(myvals)
        for each in databasebuffer:
            mongohelper.inserthisone(coll, each)


# print(intc.iloc[200])
# print(intc.tail())

if (len(sys.argv) > 3):
    backtest = cmdlineargs[4]
    backtest = backtest.lower()
    if (backtest == "false"):
        backtest = False
    else:
        backtest = True
else:
    backtest = False

if backtest:
    dailycheck()
    for each in databasebuffer:
        mongohelper.inserthisone(coll, each)
else:
    dailytrade()
