import React, {useCallback} from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {useHistory} from 'react-router-dom';
import Filter from './Filter';
import AddTradeModal from './AddTradeModal';
import useStockData from '../hooks/useStockData';

const TableView = ({trades, setTrades, setUser}) => {
  const history = useHistory();
  const [
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
  ] = useStockData();

  const handleSort = useCallback(
    (e) => {
      var columnKey = e.target.getAttribute('name');
      var tosetDirection = 'NONE';

      switch (sortDirection) {
        case 'NONE':
          console.log('none to asc');
          tosetDirection = 'ASC';
          break;
        case 'ASC':
          console.log('asc to dsc');
          tosetDirection = 'DSC';
          break;
        case 'DSC':
          console.log('dsc to none');
          tosetDirection = 'NONE';
          break;
        default:
      }
      setSort([columnKey, tosetDirection]);
    },
    [sortDirection, setSort]
  );

  const sortIcon = (column) => {
    if (sortColumn === column && sortDirection != 'NONE')
      return sortDirection === 'ASC' ? (
        <i className='bi bi-caret-up-fill'></i>
      ) : (
        <i className='bi bi-caret-down-fill'></i>
      );
    else return null;
  };

  var rowsView = sortedRows.map((row, i) => {
    var stdError =
      (prices?.[row.yStock] - row.slope * prices?.[row.xStock] - row.intercept) /
      row.stdErrResid;
    // var stdErrorRolling = (
    //   (prices?.[row.yStock] - row.slope * prices?.[row.xStock] - row.intercept) /
    //   row.rollStdErrResid
    // ).toFixed(4);
    var highlight = '';
    if (isNaN(stdError)) stdError = row.stdError;
    if (stdError < -2.4) highlight = 'table-success';
    if (stdError > 2.4) highlight = 'table-danger';
    var xLtp = prices?.[row.xStock] || row.xLtp;
    var yLtp = prices?.[row.yStock] || row.yLtp;

    return (
      <tr
        className={highlight}
        data-id={i}
        // onClick={(e) => setTradeToAdd(e.currentTarget.getAttribute('data-id'))}
      >
        <td>
          <input
            type='radio'
            name='s'
            onChange={(e) =>
              setTradeToAdd(
                e.currentTarget.parentElement.parentElement.getAttribute('data-id')
              )
            }
          />
        </td>
        <td>{row.sector}</td>
        <td>{row.yStock}</td>
        <td>{row.xStock}</td>
        <td>{row.pValue.toFixed(6)}</td>
        {/* <td>{row.stdError}</td> */}
        <td>{stdError.toFixed(6)}</td>
        {/* <td>{stdErrorRolling}</td> */}
        <td>{row.slope.toFixed(4)}</td>
        <td>{row.intercept.toFixed(4)}</td>
        <td>{row.stdErrorResid.toFixed(4)}</td>
        {/* <td>{row.diff}</td> */}
        <td>{yLtp.toFixed(3)}</td>
        <td>{xLtp.toFixed(3)}</td>
        <td>
          <button
            onClick={() => history.push(`/pairdetails/${row.yStock}/${row.xStock}`)}
            className='btn btn-primary btn-sm'
          >
            More
          </button>
        </td>
      </tr>
    );
  });
  const handleFilterTypeChange = (e) => {
    var filtertoSet = e.target.getAttribute('data-filtertoset');
    console.log('setting up', filtertoSet);
    if (!filterList.includes(filtertoSet))
      setFilterList((prevState) => [...prevState, filtertoSet]);
    setFilters((prevState) => {
      var newState = {
        ...prevState,
      };
      newState[filtertoSet].type = e.target.value;
      return newState;
    });
  };
  const handleFilterValueChange = (e) => {
    var filtertoSet = e.target.getAttribute('data-filtertoset');
    setFilters((prevState) => {
      var newState = {...prevState};
      newState[filtertoSet].value = e.target.value;
      return newState;
    });
  };
  if (loading)
    return (
      <div class='d-flex justify-content-center'>
        <div class='spinner-border text-primary text-center' role='status'>
          <span class='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  if (error.message) {
    if (error.code === 401) {
      localStorage.removeItem('token');
      setUser({isAuthenticated: false});
    }
    return (
      <div class='d-flex justify-content-center'>
        <div class='alert alert-danger' role='alert'>
          No data available. Try again later
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className='d-flex justify-content-between'>
        <Filter
          handleFilterTypeChange={handleFilterTypeChange}
          handleFilterValueChange={handleFilterValueChange}
        />
        <AddTradeModal
          tradeDetails={sortedRows[tradeToAdd]}
          prices={prices}
          setTrades={setTrades}
        />
      </div>
      <table className='table  table-bordered table-striped table-hover'>
        <thead className='table-dark'>
          <tr>
            <th scope='col'></th>
            <th scope='col'>Sector </th>
            <th scope='col'>yStock</th>
            <th>xStock</th>
            <th onClick={handleSort} name='pValue' role='button'>
              p-value {sortIcon('pValue')}
            </th>
            <th onClick={handleSort} name='stdError' role='button'>
              std error {sortIcon('stdError')}
            </th>
            {/* <th>std err rolling</th> */}
            <th>slope</th>
            <th onClick={handleSort} name='intercept' role='button'>
              intercept {sortIcon('intercept')}
            </th>
            <th>std error of residue</th>
            <th>yLtp</th>
            <th>xLtp</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rowsView}</tbody>
      </table>
    </div>
  );
};

export default TableView;
