import sys
import datetime
import pandas_datareader.data as web

#download func
def download_n_save(stock):
    #get a whole year's worth of data
    today = datetime.datetime.now()
    endd = datetime.datetime(today.year, today.month, today.day-1)#yesterday
    startd = datetime.datetime(today.year-1, today.month, today.day-1)
    try:
        print("getting data for symbol " + stock)
        data = web.DataReader(stock,'yahoo',startd,endd)
        outputname = stock + '_data.csv'
        data.to_csv(outputname)
    except:
        print("not a valid stock or unable to download data")
        print("stock: " + stock)
#end func

list2get = []
howmany = len(sys.argv)
if(howmany > 1):
    cmdlineargs = sys.argv
    for i in range (1,howmany):
        list2get.append(cmdlineargs[i])
else:
    ticker = input("enter ticker symbol : ")


if(howmany > 1):
    for stock in list2get:
        download_n_save(stock)
else:
    download_n_save(ticker)
