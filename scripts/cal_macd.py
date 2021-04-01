import pandas as pd
def macd(stockdf,_1, _2, _3):
    #df = stockdf.copy()
    stockdf[str(_1)] = stockdf['Adj Close'].ewm(span=_1, adjust=False).mean()
    stockdf[str(_2)] = stockdf['Adj Close'].ewm(span=_2, adjust=False).mean()
    stockdf['MACD'] = stockdf[str(_1)] - stockdf[str(_2)]
    stockdf['Signal Line'] = stockdf['MACD'].ewm(span=_3, adjust=False).mean()