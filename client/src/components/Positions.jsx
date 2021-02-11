import React from 'react';
import useStockData from '../hooks/useStockData';

function Positions({trades}) {
  const [prices] = useStockData();

  console.log('rendering positions with', trades);
  var isActiveTrades = !!(trades.length > 0);
  var tradesView = trades.map((trade) => {
    var xLtp = prices[trade.xStock];
    var yLtp = prices[trade.yStock];
    var yPnL = ((yLtp - trade.yTradePrice) * trade.yQty).toFixed(2);
    var xPnL = ((xLtp - trade.xTradePrice) * trade.xQty).toFixed(2);
    var netPnL = 0;
    if (!(isNaN(xPnL) && isNaN(yPnL))) {
      netPnL = +xPnL + +yPnL;
    } else {
      xPnL = 0;
      yPnL = 0;
    }

    return (
      <>
        <tr>
          <td>{trade.yStock}</td>
          <td rowSpan='2'>hi</td>
          <td>{trade.yQty}</td>
          <td>{trade.yTradePrice}</td>
          <td>{yLtp}</td>
          <td>{yPnL}</td>
        </tr>
        <tr>
          <td>{trade.xStock}</td>
          <td>{trade.xQty}</td>
          <td>{trade.xTradePrice}</td>
          <td>{xLtp}</td>
          <td>{xPnL}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td className={`${netPnL > 0 ? 'table-success' : 'table-danger'}`}>{netPnL}</td>
        </tr>
      </>
    );
  });
  return (
    <div className='my-3'>
      <h3>Positions</h3>
      <hr></hr>
      {!isActiveTrades ? (
        'No active trades'
      ) : (
        <table class='table'>
          <thead class='table-dark'>
            <tr>
              <th>Instrument</th>
              <th>Std Error</th>
              <th>Qty.</th>
              <th>Avg</th>
              <th>LTP</th>
              <th>P&amp;L</th>
            </tr>
          </thead>
          <tbody>{tradesView}</tbody>
        </table>
      )}
    </div>
  );
}

export default Positions;
