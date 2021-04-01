#This script offers recommendation data provided by Yahoo Finance
#The collected data will be printed in a CSV file with two columns: Ticker and Recommendation
#This is on a scale of 1-5. 1 being hard buy, 5 being hard sell.



#Library dependencies
import requests
import pandas as pd 
from yahoo_fin import stock_info as si 
from pandas_datareader import DataReader
import numpy as np

tickers = si.tickers_sp500() #storing ticker data from yahoo_fin into a var
recommendations = []

#Gather API data
for ticker in tickers:
    lhs_url = 'https://query2.finance.yahoo.com/v10/finance/quoteSummary/'
    rhs_url = '?formatted=true&crumb=swg7qs5y9UP&lang=en-US&region=US&' \
              'modules=upgradeDowngradeHistory,recommendationTrend,' \
              'financialData,earningsHistory,earningsTrend,industryTrend&' \
              'corsDomain=finance.yahoo.com'
   
    url =  lhs_url + ticker + rhs_url
    r = requests.get(url) #calling requests library to 'get' info from yahoo financeurl
    if not r.ok:
        recommendation = 6 #default value, indicating no score was provided
    try: 
        result = r.json()['quoteSummary']['result'][0]
        recommendation = result['financialData']['recommendationMean']['fmt']
    except:
        recommendation = 6
    
    recommendations.append(recommendation)
    
    print("--------------------------------------------")
    print ("{} has an average recommendation of: ".format(ticker), recommendation)
    #time.sleep(0.5)
    
dataframe = pd.DataFrame(list(zip(tickers, recommendations)), columns =['Company', 'Recommendations']) 
dataframe = dataframe.set_index('Company')
dataframe.to_csv('recommendations.csv')

print (dataframe)
