import math
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

import pandas_datareader
import datetime
import pandas_datareader.data as web

#download for now later it will be from csv
#today = datetime.datetime.now()
#endd = datetime.datetime(today.year, today.month, today.day-1)#yesterday
#startd = datetime.datetime(today.year-1, today.month, today.day-1)
#amd = web.DataReader('AMD','yahoo',startd,endd)
#intc = web.DataReader('INTC','yahoo',startd,endd)
#spy = web.DataReader('SPY','yahoo',startd,endd)

#get data from csv
amd = pd.read_csv('AMD_data.csv',index_col='Date')
intc = pd.read_csv('INTC_data.csv',index_col='Date')
spy = pd.read_csv('SPY_data.csv',index_col='Date')

#print(amd.head())#//check head
##type(tesla)
#plotting

#amd['Open'].plot(label='AMD',figsize=(16,8),title='Opening Prices')
#intc['Open'].plot(label='INTC')
#spy['Open'].plot(label='SPY')

#plt.legend()

#plt.savefig("somegraph.png")
#print((amd[0][2]))
#print(type(amd[0][2]))


#rolling - https://www.datacamp.com/community/tutorials/moving-averages-in-pandas
#std - 

cmdlineargs = sys.argv
stock = cmdlineargs[1]
if (stock == "amd"):
    stock = amd
elif (stock == "intc"):
    stock = intc    
elif (stock == "spy"):
    stock = spy
elif (stock == "amd"):
    stock = amd
elif (stock ==  "amd"):
    stock = amd
else:
    stock = amd
class MyClass:
    pass
myvals = MyClass()
myvals.havepos = False
myvals.mystocks = 0
myvals.paperdough = 1000
#change to  write to file
f = open("results.txt","a")
sys.stdout = f
print("money started w/ before trading")
print(myvals.paperdough)
def checktrade(x,day):
    if(day < 30):
        return
    ravg30 = stock.iloc[day-30:day].rolling(30).mean()['Close']
    std30 = np.std(stock.iloc[day-30:day]['Close'])
    ravg30 = ravg30.iloc[-1]
    #print(x.paperdough)
    #std30 = std30.iloc[-1]
    #print("AVG")
    #print(ravg30)
    #print("STD")
    #print(std30)
    # to get the date I could use intc.iloc[i].name and it will give the date
    if(intc.iloc[day]['Open'] < ravg30-std30 and not x.havepos):
        print("YES current day is below std\nBUY")
        #print(intc.iloc[day])
        #print(ravg30 - std30)
        current = stock.iloc[day]['Open']
        #print(x.paperdough)
        if(current < x.paperdough):
            x.mystocks = math.floor(x.paperdough / current)
            x.paperdough = x.paperdough - (x.mystocks * current)
            x.havepos = True
    elif (intc.iloc[day]['Open'] < ravg30+std30 and x.havepos):
        print("YES current day is above std\nSELL")
        current = stock.iloc[day]['Open']
        x.paperdough = x.paperdough + (x.mystocks * current)
        x.mystocks = 0
        x.havepos = False
    else:
        pass
    if(day > 200):
        print(stock)
        #print("my paper is: " + str (x.paperdough))

def dailycheck():
    for day in range(1,100):#len(intc)):
        #print(amd.iloc[day])
        checktrade(myvals,day)

#print(intc.iloc[200])
#print(intc.tail())

dailycheck()
print("my money now")
print(myvals.paperdough)
f.close()