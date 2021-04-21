'''
Trader.py - Main Python function for the Python robot

@author- Javier I. Medina
@version- 1.1

TODO: Add Pymongo package to store data to MongoDB


'''

# Pull in other python files
import config
import trade_strat
import grapher

'''
Dependencies
This Python Robot uses the Robinhood API Library built by Joshua M. Fernandes

Github: https://github.com/jmfernandes/robin_stocks
Documentation: https://readthedocs.org/projects/robin-stocks/downloads/pdf/latest/

In addition, we use datetime and pandas to handle market open and storing data, respectively.

'''
import robin_stocks as rh
import datetime as dt
import time
import pandas as pd


'''
Login & logout

Call config.py to get user credentials and pass in to rh authentication

This will require the user to input 2-factor authentication on first login.

Logout will logout the user.
'''
def login(days):
    time_logged_in = 60*60*24*days
    rh.authentication.login(username=config.username,
                            password=config.password,
                            expiresIn=time_logged_in,
                            scope='internal',
                            by_sms=True,
                            store_session=True)

def logout():
    rh.authentication.logout()

'''
get_stocks()

Hardcoded list of 4 stock tickers the algorithm will trade with.
'''
def get_stocks():
    # add your stocks here
    stocks = list()
    stocks.append('INPX')
    stocks.append('GNUS')
    stocks.append('SNDL')
    stocks.append('OGI')
    return(stocks)

'''
open_market

Determines whether the market is open so the program can start
gathers the current time from datetime

time_now = dt.datetime.now().time()

Uses if statements to set market to true. The current time must be within the bounds 
of the if statement
'''
def open_market():
    market = False
    time_now = dt.datetime.now().time()

    market_open = dt.time(6,30,0) # 6:30AM
    market_close = dt.time(12,59,0) # 12:59PM

    if time_now > market_open and time_now < market_close:
        market = True
    else:
        print('Market is closed. Market re-opens at 6 AM PST/9 AM EST')
        pass

    return(market)

'''
get_cash

rh.account.build_user_profile() - gathers relevant data and stores it into a single
                                  dictionary

This function gathers the cash and equity from the user profile and stores them in a variable
for indexing later. The purpose of this is to let the user know the money value in their portfolio

'''
def get_cash():
    rh_cash = rh.account.build_user_profile()

    cash = float(rh_cash['cash'])
    equity = float(rh_cash['equity'])
    return(cash, equity)

def get_holdings_and_bought_price(stocks):
    holdings = {stocks[i]: 0 for i in range(0, len(stocks))}
    bought_price = {stocks[i]: 0 for i in range(0, len(stocks))}
    rh_holdings = rh.account.build_holdings()

    for stock in stocks:
        try:
            holdings[stock] = int(float((rh_holdings[stock]['quantity'])))
            bought_price[stock] = float((rh_holdings[stock]['average_buy_price']))
        except:
            holdings[stock] = 0
            bought_price[stock] = 0

    return(holdings, bought_price)

def sell(stock, holdings, price):
    sell_price = round((price-0.10), 2)
    # Comment this section out until ready to begin live trading
    #print('sell is currently commented')
    sell_order = rh.orders.order_sell_limit(symbol=stock,
                                            quantity=holdings,
                                            limitPrice=sell_price,
                                            timeInForce='gfd')

    print('### Trying to SELL {} at ${}'.format(stock, price))

def buy(stock, allowable_holdings):
    buy_price = round((price+0.10), 2)
    # Comment this section out until ready to begin live trading
    #print('buy is currently commented')
    buy_order = rh.orders.order_buy_limit(symbol=stock,
                                          quantity=allowable_holdings,
                                          limitPrice=buy_price,
                                          timeInForce='gfd')

    print('### Trying to BUY {} at ${}'.format(stock, price))

def build_dataframes(df_trades, trade_dict, df_prices, price_dict):
    time_now = str(dt.datetime.now().time())[:8]
    df_trades.loc[time_now] = trade_dict
    df_prices.loc[time_now] = price_dict
    return(df_trades, df_prices)

if __name__ == "__main__":
    login(days=1)

    stocks = get_stocks()
    print('stocks:', stocks)
    cash, equity = get_cash()

    ts = trade_strat.trader(stocks)

    trade_dict = {stocks[i]: 0 for i in range(0, len(stocks))}
    price_dict = {stocks[i]: 0 for i in range(0, len(stocks))}
    df_trades = pd.DataFrame(columns=stocks)
    df_prices = pd.DataFrame(columns=stocks)

    while open_market():
        prices = rh.stocks.get_latest_price(stocks)
        holdings, bought_price = get_holdings_and_bought_price(stocks)
        print('holdings:', holdings)

        for i, stock in enumerate(stocks):
            price = float(prices[i])
            print('{} = ${}'.format(stock, price))

            trade = ts.trade_option(stock, price)
            print('trade:', trade)
            if trade == "BUY":
                allowable_holdings = int((cash/10)/price)
                if allowable_holdings > 5 and holdings[stock] == 0:
                    buy(stock, allowable_holdings)
            elif trade == "SELL":
                if holdings[stock] > 0:
                    sell(stock, holdings[stock], price)

            price_dict[stock] = price
            if holdings[stock] > 0 and trade != "SELL":
                trade = "HOLD"
            elif holdings[stock] == 0 and trade != "BUY":
                trade = "WAIT"
            trade_dict[stock] = trade

        df_trades, df_prices = build_dataframes(df_trades, trade_dict, df_prices, price_dict)
        grapher.active_graph(grapher.normalize(df_prices), df_trades)

        time.sleep(30)

    logout()