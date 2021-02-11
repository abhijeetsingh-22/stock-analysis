import React, {useState, useEffect, useMemo} from 'react';
import {apiCall} from '../services/api';
import YahooFinance from '../services/decoder';

function useStockData() {
  const [data, setData] = useState([]);
  const [[sortColumn, sortDirection], setSort] = useState(['id', 'NONE']);
  const [filterList, setFilterList] = useState([]);
  const [prices, setPrices] = useState({});
  const [tradeToAdd, setTradeToAdd] = useState(0);
  const [filters, setFilters] = useState({pValue: {}, intercept: {}, stdError: {}});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  var yfin = useMemo(() => {
    console.log('creating yfin instance');
    return new YahooFinance([], setPrices);
  }, []);
  const sortedRows = useMemo(() => {
    let sortedRows = [...data];
    filterList.forEach((filter) => {
      sortedRows = sortedRows.filter((a) => {
        return filters[filter].value
          ? eval(a[filter] + filters[filter].type + filters[filter].value)
          : true;
      });
    });
    if (sortDirection === 'NONE') return sortedRows;
    switch (sortColumn) {
      case 'intercept':
      case 'stdError':
      case 'pValue':
        sortedRows = sortedRows.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : 1));
        break;
      default:
    }
    return sortDirection === 'DSC' ? sortedRows.reverse() : sortedRows;
  }, [data, sortDirection, sortColumn, filterList, filters]);
  useEffect(() => {
    setLoading(true);
    apiCall('get', '/api/getpairs').then((res) => {
      if (!res.error) {
        console.log('type of main data', typeof res);
        setData(res);
        var tickers = [];
        res.forEach((d) => {
          if (!tickers.includes(d.xStock)) tickers.push(d.xStock);
          if (!tickers.includes(d.yStock)) tickers.push(d.yStock);
        });

        yfin.addTicker(tickers, true);
        console.log('list of tickers to sub ', tickers);
        setLoading(false);
      }
      if (res.error) {
        setError(res.error);
        setLoading(false);
      }
      return () => yfin.close();
    });
  }, [yfin]);
  return [
    prices,
    sortedRows,
    sortDirection,
    sortColumn,
    setSort,
    tradeToAdd,
    setTradeToAdd,
    filterList,
    setFilterList,
    setFilters,
    loading,
    error,
  ];
}

export default useStockData;
