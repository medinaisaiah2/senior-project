import numpy as np
import sys
import pandas as pd
"""
quick info on RSI
https://blog.quantinsti.com/rsi-indicator/
https://medium.com/automated-trading/how-to-calculate-and-analyze-relative-strength-index-rsi-using-python-94420d80a364
"""

def calculatersi(stock, pricecolumn):
    """a function that will apend RSI to a given dataframe
    pass dataframe as first paremeter and the name of the close or adj close price as second parameter
    :type pricecolumn: str
    """
    gain = []
    loss = []
    avgGain = []
    avgLoss = []
    abs_loss = []
    gain.append(0)
    loss.append(0)
    abs_loss.append(0)
    #print(stock)
    for i in range(1, len(stock)):
        if(stock.iloc[i][pricecolumn] - stock.iloc[i-1][pricecolumn] > 0):#positive so it's a gain
            gain.append(stock.iloc[i][pricecolumn] - stock.iloc[i-1][pricecolumn])
            loss.append(0)
            #abs_loss.append(0)
        else:
            loss.append(stock.iloc[i][pricecolumn] - stock.iloc[i-1][pricecolumn])
            #abs_loss.append(abs(stock.iloc[i][pricecolumn] - stock.iloc[i - 1][pricecolumn]))
            gain.append(0)


    #older stuff might add some back later
    #print(stock)
    #print(gain)
    #print(loss)
    sumgain = 0
    sumloss = 0
    for i in range(0, len(stock)):
        sumgain += gain[i]
        sumloss += loss[i]
        #13 cuz 0-13 make 14 days
        if i > 13:
            sumgain -= gain[i-14]
            sumloss -= loss[i-14]
            avgGain.append(float(sumgain/14))
            avgLoss.append(float(abs(sumloss/14)))
            #check
            #print(sumgain)
            #print(sumloss)
            #print(float(gain[i-14]))
            #print(float(loss[i-14]))
        else:
            avgGain.append(0)
            avgLoss.append(0)
    rs = []
    rsi = []
    for i in range(0,len(stock)):
        if i > 13:
            temp = avgGain[i]/avgLoss[i]
            rs.append(temp)
            rsi.append(100-(100/(1+temp)))
        else:
            rs.append(0)
            rsi.append(0)

    #stock['Gain'] = pd.Series(np.array(gain), index=stock.index)
    #stock['Loss'] = pd.Series(np.array(loss), index=stock.index)
    #stock['Avg Gain'] = pd.Series(np.array(avgGain), index=stock.index)
    #stock['Avg Loss'] = pd.Series(np.array(avgLoss), index=stock.index)
    #stock['RS'] = pd.Series(np.array(rs), index=stock.index)
    stock['RSI'] = pd.Series(np.array(rsi), index=stock.index)


