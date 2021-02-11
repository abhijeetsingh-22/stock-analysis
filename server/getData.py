import pandas_datareader.data as web
import statsmodels.api as sm
import pandas as pd
import datetime
import os
import dateutil


def getSymbolData(symbol, startDate, endDate):
    directory = 'data/temp'
    if not os.path.exists(directory):
        os.makedirs(directory)

    fileName = f'{directory}/{symbol}-{str(startDate)} to {str(endDate)}.csv'

    if os.path.exists(fileName):
        yahooData = pd.read_csv(fileName)
    else:
        yahooSymbol = symbol+'.NS'
        yahooData = web.DataReader(yahooSymbol, 'yahoo', startDate, endDate)
        yahooData = yahooData.rename(
            columns={'Adj Close': 'Close', 'Close': 'Close yh'})
        yahooData = (yahooData.loc[:, ['Close']])
        # print(yahooData.head(10))
    # print(f'filename is {fileName}')
    # yahooSymbol2= symbol2+'.NS'
    # print(yahooData.shape)

    # print(f'data shape is {yahooDf.shape}')
    # yahooDf.to_csv(fileName)
    # pd.DataFrame().
    # stockData = nsepy.get_history(symbol, start=startDate, end=endDate)
    # stockData = stockData.loc[:, ['Symbol', 'Close']]
    # stockData
    # print(stockData['Close'].to_numpy().size)
    # stockData = stockData.join(yahooData)
    # stockData.to_csv(fileName)
    # return stockData
    if not os.path.exists(fileName):
        yahooData.to_csv(fileName)
    return yahooData

# startDate = datetime.date(2019, 1, 1)
# endDate = datetime.date(2020, 1, 24)
# getSymbolData('INFY', startDate, endDate)
