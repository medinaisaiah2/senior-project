import numpy as np
import sys
import pandas as pd

"""
quick info on RSI
https://blog.quantinsti.com/rsi-indicator/
"""

#https://stackoverflow.com/questions/57006437/calculate-rsi-indicator-from-pandas-dataframe/57037866
def rma(x, n, y0):
    a = (n - 1) / n
    ak = a ** np.arange(len(x) - 1, -1, -1)
    return np.r_[np.full(n, np.nan), y0, np.cumsum(ak * x) / ak / n + y0 * a ** np.arange(1, len(x) + 1)]

def calculatersi(stock, pricecolumn):
    """a function that will apend RSI to a given dataframe
    pass dataframe as first paremeter and the name of the close or adj close price as second parameter
    :type pricecolumn: str
    """
    if not isinstance(stock, pd.DataFrame):
        print("first parameter is not a dataframe. please try again\n")
        return -1
    #df = stock['Adj Close']
    df = stock[[pricecolumn]].copy()
    #print(type(stock))

    n=14

    df['change'] = stock[pricecolumn].diff()
    df['gain'] = df.change.mask(df.change < 0, 0.0)
    df['loss'] = -df.change.mask(df.change > 0, 0.0)
    df['avg_gain'] = rma(df.gain[n+1:].to_numpy(), n, np.nansum(df.gain.to_numpy()[:n+1])/n)
    df['avg_loss'] = rma(df.loss[n+1:].to_numpy(), n, np.nansum(df.loss.to_numpy()[:n+1])/n)
    df['rs'] = df.avg_gain / df.avg_loss
    df['rsi'] = 100 - (100/(1+df.rs))

    stock['rsi'] = df['rsi']

    return 0
