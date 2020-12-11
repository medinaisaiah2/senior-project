import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

import pandas_datareader
import datetime
import pandas_datareader.data as web

startd = datetime.datetime(2019,1,1)
endd = datetime.datetime(2020,12,1)

amd = web.DataReader('AMD','yahoo',startd,endd)
intc = web.DataReader('INTC','yahoo',startd,endd)
spy = web.DataReader('SPY','yahoo',startd,endd)

print(amd.head())
print(amd.info())
#mpl_finance depricated warning -- we might need to upgrade
#how to draw sticks source: https://openwritings.net/pg/python/python-draw-candlestick-chart-using-mplfinance-fetching-data-csv-file
from mpl_finance import candlestick_ohlc
from matplotlib.dates import DateFormatter,date2num
#print(intc.head())
#change columns
amd = amd.loc['2020-11'].reset_index()
intc = intc.loc['2020-11'].reset_index()
spy = spy.loc['2020-11'].reset_index()
print(amd.tail())
amd['date_ax'] = amd['Date'].apply(lambda date: date2num(date))
intc['date_ax'] = intc['Date'].apply(lambda date: date2num(date))
spy['date_ax'] = spy['Date'].apply(lambda date: date2num(date))
list_of_cols = ['date_ax','Open','High','Low','Close']
intc_vals = [tuple(vals) for vals in intc[list_of_cols].values]
fig, ax = plt.subplots()
candlestick_ohlc(ax,intc_vals, width=0.5, colorup='g', colordown='r')
ax.xaxis_date()
#ax.xaxis_set_major_formatter(mdates.DateFormatter("%Y-%m-%d"))
plt.gcf().autofmt_xdate()
plt.autoscale(tight=True)
plt.savefig('mpl_sticks_intc.png')