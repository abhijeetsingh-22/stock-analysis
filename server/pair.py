import statsmodels.api as sm
from statsmodels.tsa.stattools import adfuller
import pandas as pd
import numpy as np
import math
import datetime
import os
import shutil
from getData import getSymbolData
from pymongo import MongoClient
import pprint

MONGO_URI = 'mongodb+srv://master:asingh1999@cluster0.ekrao.mongodb.net/stockData?retryWrites=true&w=majority'
# socketio = SocketIO(app, cors_allowed_origins='*')
client = MongoClient(MONGO_URI)
db = client.stockData
pairs = db.pairData
pairDetails = db.pairDetails


def calculateStats(symbol1, symbol2):
    # plt.close("all")

    endDate = datetime.date.today()
    startDate = datetime.date(int(endDate.year)-1, int(endDate.month), 1)
    stockData1 = getSymbolData(symbol1, startDate, endDate)
    stockData2 = getSymbolData(symbol2, startDate, endDate)
    stock1Close = stockData1['Close'].to_numpy()
    stock2Close = stockData2['Close'].to_numpy()

    # stock 1 as independent(X) and stock 2 as dependent(Y)
    model1 = sm.OLS(endog=stock2Close, exog=sm.add_constant(stock1Close))
    # stock 2 as independent(X) and stock 1 as dependent(Y)
    model2 = sm.OLS(endog=stock1Close, exog=sm.add_constant(stock2Close))
    res1 = model1.fit()
    res2 = model2.fit()

    # Error Ratio= std error of intercept/ std error of residual
    errRatio1 = res1.bse[0]/(math.sqrt(res1.mse_resid))
    errRatio2 = res2.bse[0]/(math.sqrt(res2.mse_resid))

    if(errRatio1 < errRatio2):
        # Use stock1 as independent(X) and stock2 as dependent(Y)
        res = res1
        xStockData = stockData1
        yStockData = stockData2
        xStock = symbol1
        yStock = symbol2

    else:
        # Use stock2 as independent(X) and stock1 as dependent(Y)
        xStockData = stockData2
        yStockData = stockData1
        xStock = symbol2
        yStock = symbol1
        res = res2
    pValue = adfuller(x=res.resid)[1]
    stdErrResid = math.sqrt(res.mse_resid)
    stdErr = res.resid[-1]/stdErrResid
    intercept = res.params[0]
    slope = res.params[1]
    diff = res.resid[-1]

    resid_mavg1 = pd.DataFrame(res.resid).rolling(1).mean()
    resid_mavg20 = pd.DataFrame(res.resid).rolling(20).mean()
    resid_std20 = pd.DataFrame(res.resid).rolling(20).std()

    zscoreNormal = pd.DataFrame(res.resid)/stdErrResid
    zscoreRolling = (resid_mavg1-resid_mavg20)/resid_std20

    data = pd.DataFrame(
        columns=['xClose', 'yClose', 'zscoreNormal', 'zscoreRolling'])
    data = data.assign(xClose=xStockData['Close'])
    data = data.assign(yClose=yStockData['Close'])
    data = data.assign(zscoreNormal=zscoreNormal[0])
    data = data.assign(zscoreRolling=zscoreRolling[0])
    dbOutput = data.to_dict(orient='list')
    dbOutput['xStock'] = xStock
    dbOutput['yStock'] = yStock
    dbOutput['intercept'] = intercept
    dbOutput['slope'] = slope
    dbOutput['pValue'] = pValue
    dbOutput['updatedAt'] = str(
        datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S"))

    if(pValue < 0.06):
        pairDetails.insert_one(dbOutput)
        # directory = 'data/op'
        # if not os.path.exists(directory):
        #     os.makedirs(directory)
        # fileName = f'{directory}/{yStock}and{xStock}.csv'
    xLtp = xStockData['Close'].iloc[-1]
    yLtp = yStockData['Close'].iloc[-1]
    rollMean = pd.DataFrame(res.resid).tail(20).mean().iloc[-1]
    rollStdErrResid = pd.DataFrame(res.resid).tail(20).std().iloc[-1]
    return xStock, yStock, intercept, slope, pValue, stdErr, stdErrResid, diff, data['zscoreRolling'].iloc[-1], rollMean, rollStdErrResid, xLtp, yLtp

# print(res1.resid)
# print('stock1 as independent variable')
# print(f'slope {res1.params[1]} with std error {res1.bse[1]}')
# print(
#     f'intercept {res1.params[0]} with std error of intercept {res1.bse[0]}')
# print(f'Error Ratio =  {errRatio1}')
# print(f'the standard error is {math.sqrt(res1.mse_resid)}')
# # print(res1.summary())
# print('stock2 as independent variable')
# print(f'slope {res2.params[1]} with std error {res2.bse[1]}')
# print(
#     f'intercept {res2.params[0]} withstd error of intercept {res2.bse[0]}')
# print(f'Error Ratio =  {errRatio2}')
# print(f'the standard error is {math.sqrt(res2.mse_resid)}')

# print(res2.summary())
# print(res.summary())
# print(
#     f'value of intercept is {res.params[0]} with std error of {res.bse[0]}')
# print(
#     f'value of slope (m) is {res.params[1]} with std error of {res.bse[1]}')
# print('The residuals are')
# print(f'the standard error is {math.sqrt(res.mse_resid)}')
# print(res.resid)


def main():
    symbolList = {
        'AUTO': ['HEROMOTOCO',
                 'ESCORTS', 'MOTHERSUMI',
                 'EXIDEIND', 'BOSCHLTD', 'BAJAJ-AUTO',
                 'EICHERMOT',
                 'TVSMOTOR', 'M&M', 'ASHOKLEY', 'TATAMOTORS', 'TATAMTRDVR', 'MARUTI', 'AMARAJABAT'
                 ],
        'Banks-PSUs': ['CANBK', 'BANKBARODA', 'IDBI', 'PNB', 'SBIN', 'UNIONBANK', 'HDFCBANK', 'ICICIBANK', 'KOTAKBANK', 'INDUSINDBK', 'BANDHANBNK', 'IDFCFIRSTB', 'FEDERALBNK', 'RBLBANK', 'AXISBANK', ],
        'IT': ['INFY', 'TCS', 'WIPRO', 'NAUKRI', 'HCLTECH', 'TECHM', 'LTI', 'MPHASIS', 'MINDTREE', 'COFORGE'],
        'CHEMICALS': ['AARTIIND', 'PIDILITIND', 'TATACHEM', 'UPL'],
        'FMCG': ['HINDUNILVR', 'NESTLEIND', 'MARICO', 'GODREJCP', 'ITC', 'NESTLEIND', 'BRITANNIA', 'TATACONSUM', 'DABUR', 'COLPAL', 'JUBLFOOD', ],
        'MEDIA': ['ZEEL', 'SUNTV', 'TV18BRDCST', 'INOXLEISUR', 'DISHTV', 'TVTODAY', 'DBCORP', 'HATHWAY', 'PVR'],
        'REALITY': ['DLF', 'GODREJPROP', 'PHOENIXLTD', 'OBEROIRLTY', 'PRESTIGE', 'BRIGADE'],
        'STEEL': ['JSWSTEEL', 'TATASTEEL'],
        'PAINTS': ['ASIANPAINT', 'BERGEPAINT'],
        'CEMENT': ['ACC', 'AMBUJACEM', 'RAMCOCEM', 'SHREECEM', 'ULTRACEMCO'],
        'POWER': ['ADANIPOWER', ''],
        'PHARMA': ['APOLLOHOSP', 'TORNTPHARM', 'PEL', 'LUPIN', 'AUROPHARMA', 'LALPATHLAB', 'BIOCON', 'CADILAHC', 'CIPLA', 'DIVISLAB', 'DRREDDY', 'GLENMARK', 'SUNPHARMA'],
        'SERVICES': ['ADANIENT'],
        'INFRA': ['ADANIPORTS', 'GMRINFRA', 'LT', 'SIEMENS'],
        'TYRES': ['APOLLOTYRE', 'BALKRISIND'],
        'FINANCE': ['BAJFINANCE', 'RECLTD', 'SRTRANSFIN', 'PFC', 'MUTHOOTFIN', 'MFSL', 'MANAPPURAM', 'M&MFIN', 'BAJAJFINSV', 'CHOLAFIN', 'HDFCAMC', 'HDFC', 'ICICIPRULI', 'LICHSGFIN', 'L&TFH'],
        'ELECTRICALS': ['BEL', 'HAVELLS'],
        'REFINERIES': ['BPCL', 'PETRONET', 'ONGC', 'RELIANCE', 'GAIL', 'HINDPETRO', 'IBULHSGFIN', 'IOC', 'MGL'],
        'METALS': ['HINDALCO', 'JINDALSTEL', 'JSWSTEEL', 'SAIL', 'TATASTEEL'],
        'TELECOM': ['IDEA', 'INDUSTOWER'],
        'POWER': ['NTPC', 'POWERGRID', 'TATAPOWER', 'TORNTPOWER'],
        'TEXTILE': ['PAGEIND', 'GRASIM']
    }

    del_count = pairDetails.delete_many({})
    print(f'delete pairs data {del_count.deleted_count}')
    outputData = pd.DataFrame(columns=['sector', 'yStock', 'xStock',
                                       'intercept', 'slope', 'pValue', 'stdErr', 'stdErrRoll', 'rollStdErrResid', 'stdErrResid', 'diff', 'xLtp', 'yLtp'])

    # directory = 'data'
    # if not os.path.exists(directory):
    #     os.makedirs(directory)
    # filename = f'{directory}/pairResult.xlsx'
    for sector, symbols in symbolList.items():
        for i in range(len(symbols)):
            for j in range(i+1, len(symbols)):
                print(f'stock 1 {symbols[i]} and stock 2 {symbols[j]}')
                try:
                    xStock, yStock, intercept, slope, pValue, stdErr, stdErrResid, diff, zscoreRolling, rollMean, rollStdErrResid, xLtp, yLtp = calculateStats(
                        symbol1=symbols[i], symbol2=symbols[j])
                    result = {'sector': sector, 'xStock': xStock, 'yStock': yStock, 'intercept': intercept, 'slope': slope,
                              'pValue': pValue, 'stdError': stdErr, 'stdErrorRoll': zscoreRolling, 'stdErrorResid': stdErrResid,  'rollMean': rollMean, 'stdErrorResidRoll': rollStdErrResid, 'diff': diff, 'xLtp': xLtp, 'yLtp': yLtp}
                    if(pValue <= 0.06):
                        outputData = outputData.append(
                            result, ignore_index=True)
                except:
                    print('error occured')
                    continue
        #     print(symbol1)
        # for symbol2 in symbolList
    print(outputData.head(2))
    del_count_pair = pairs.delete_many({})
    print(f'deleted pairs {del_count_pair.deleted_count}')
    pairs.insert_many(outputData.to_dict(orient='records'))
    # outputData.to_excel(filename)
    # pairs.update_many(outputData.to_json(orient='records'))


main()
