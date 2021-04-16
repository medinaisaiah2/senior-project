import requests, json
from myconfig import *

"""
needs file myconfigs to have the API key and secret key which you can get one yourself
when you sign up for alpaca and go to account home and request a key
"""

def getQuote(ticker):
    """
    gets the last traded price and how many sold at returned price in a form of dictionary
    get price as data['price']
    """
    r = requests.get(APCA_DATA_BASE_URL + "/v1/last/stocks/" + ticker,
                     headers={'APCA-API-KEY-ID': API_KEY_ID, 'APCA-API-SECRET-KEY': API_SECRET_KEY})
    stock = json.loads(r.content)
    price = stock['last']
    return price

def getBardata(ticker,time="15Min"):
    """
    gets bar data from alpaca in a form of list containing dictionaries for each bar
    you can get the highest value from the first interval as data[0]['h']
    time inveral should be one of the following:
    1Min, 5Min, 15Min, or 1D
    time inverval defaults to 15Min
    """
    interval = "15Min"  
    if(time=="15Min"):
        interval = "15Min"
    elif(time=="1Min"):
        interval = "1Min"
    elif(time=="5Min"):
        interval = "5Min"
    elif(time=="1D"):
        interval = "1D"
    else:
        interval = "15Min"
    ticker = ticker.upper()
    r = requests.get(APCA_DATA_BASE_URL + "/v1/bars/"+interval,
        headers={'APCA-API-KEY-ID': API_KEY_ID, 'APCA-API-SECRET-KEY': API_SECRET_KEY},
        params={'symbols': ticker})
    stock = json.loads(r.content)
    bardata = stock[ticker]
    return bardata
