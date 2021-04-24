import yfinance as yf
import pandas as pd

preedit = pd.read_csv("recommendations.csv")
liststocks = preedit['Company']
listrecommend = preedit['Recommendations']
sectors = []
for each in liststocks:
    try:
        ticker = each
        stock = yf.Ticker(ticker)
        print(stock.info['sector'])
        sec = stock.info['sector']
        sectors.append(sec)
    except:
        sectors.append('Unknown')

dataframe = pd.DataFrame(list(zip(liststocks, listrecommend, sectors)), columns =['Company', 'Recommendations', 'Sector'])
dataframe = dataframe.set_index('Company')
dataframe.to_csv('recommendations.csv')