import sys
import datetime
import pandas_datareader.data as web

list2get = []
howmany = len(sys.argv)
if(howmany > 1):
    cmdlineargs = sys.argv
    for i in range(1,howmany):
        list2get.append(cmdlineargs[i])
else:
    ticker = input("enter a ticker symbol")

if(howmany>1):
    ticker = cmdlineargs[1]

today = datetime.datetime.now()
start_date = datetime.datetime(today.year, today.month-3, today.day)
today = today.isoformat()
outputname = ticker + "_data.csv"
#download
try:
    print("getting data for symbol " + ticker)
    data = web.DataReader(ticker, 'yahoo', start_date, today)
    outputname = ticker + '_data.csv'
    data.to_csv(outputname)
except:
    print("not a valid stock or unable to download data")
    print("stock: " + ticker)

try:
    sdata = web.DataReader(ticker, 'yahoo', start_date, today)
    data.to_csv(outputname)
except:
    print("Not a valid stock or unable to download data")