import datetime
import pandas_datareader.data as web
from cal_rsi import calculatersi
def download_n_save(stock):
    #today = datetime.datetime(2021, 2, 18)  # make it same day as the others which is 12/08/2020
    today = datetime.datetime.now()
    endd = datetime.datetime(today.year, today.month, today.day - 1)  # yesterday
    startd = datetime.datetime(today.year - 1, today.month, today.day - 1)

    try:
        data = web.DataReader(stock, 'yahoo', startd, endd)
    except:
        print("from: download_n_save")
        print("not a valid stock or unable to download")

    calculatersi(data, 'Adj Close')
    data.to_csv('data/' + stock + '_data.csv')
