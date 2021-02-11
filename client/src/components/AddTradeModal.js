import React, {useState, useEffect} from 'react';

function AddTradeModal({tradeDetails, prices, setTrades}) {
  // const [trades, setTrades] = usePositions();
  const [stockDetails, setStockDetails] = useState({
    xsymbol: '',
    xqty: 0,
    xtradePrice: 0,
    xtype: 0,
    ysymbol: '',
    yqty: 0,
    ytradePrice: 0,
    ytype: 0,
  });

  useEffect(() => {
    setStockDetails({
      xsymbol: tradeDetails?.xStock,
      xqty: 0,
      xtradePrice: 0,
      xtype: '1',
      ysymbol: tradeDetails?.yStock,
      yqty: 0,
      ytradePrice: 0,
      ytype: '1',
      slope: tradeDetails?.slope,
      intercept: tradeDetails?.intercept,
    });
  }, [tradeDetails]);
  useEffect(() => {
    setStockDetails((prevState) => {
      var xtradePrice = prices[tradeDetails?.xtradePrice]
        ? prices[tradeDetails.xtradePrice]
        : 0;
      var ytradePrice = prices[tradeDetails?.ytradePrice]
        ? prices[tradeDetails.ytradePrice]
        : 0;
      return {
        ...prevState,
        xtradePrice,

        ytradePrice,
      };
    });
  }, [tradeDetails, prices]);
  const handleChange = (e) => {
    console.log(e.target);
    if (e.target.getAttribute('id') === 'inputPrice1')
      setStockDetails((prevState) => ({
        ...prevState,
        ytradePrice: e.target.value,
      }));
    if (e.target.getAttribute('id') === 'inputPrice2')
      setStockDetails((prevState) => ({
        ...prevState,
        xtradePrice: e.target.value,
      }));
    if (e.target.getAttribute('id') === 'inputQty1')
      setStockDetails((prevState) => ({
        ...prevState,
        yqty: e.target.value,
      }));
    if (e.target.getAttribute('id') === 'inputQty2')
      setStockDetails((prevState) => ({
        ...prevState,
        xqty: e.target.value,
      }));
    if (e.target.getAttribute('id') === 'inputType1')
      setStockDetails((prevState) => ({
        ...prevState,
        ytype: e.target.value,
      }));
    if (e.target.getAttribute('id') === 'inputType2')
      setStockDetails((prevState) => ({
        ...prevState,
        xtype: e.target.value,
      }));
  };
  const handleSubmit = (e) => {
    setTrades((prevTrades) => {
      var newState = [...prevTrades, stockDetails];
      console.log('new trades positions', newState);
      return newState;
    });

    var button = document.getElementById('closeModal');
    button.click();
  };
  return (
    <div>
      <button
        type='button'
        className='btn btn-primary'
        data-bs-toggle='modal'
        data-bs-target='#addTradeModal'
      >
        Add Trade
      </button>

      <div
        className='modal fade'
        id='addTradeModal'
        tabindex=''
        aria-labelledby='exampleModalLabel'
        // aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>
                Add Trade
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              <div className='container-fluid'>
                <form>
                  <div className='row mb-3'>
                    <label className='col-sm-2 col-form-label'>
                      {tradeDetails?.yStock}
                    </label>
                    <div className='col-sm-2'>
                      <select
                        id='inputType1'
                        className='form-select'
                        onChange={handleChange}
                        defaultValue={0}
                      >
                        <option value={stockDetails.ytype}>Choose...</option>
                        <option>Buy</option>
                        <option>Sell</option>
                      </select>
                    </div>
                    <div className='col-sm-4'>
                      <input
                        type='text'
                        className='form-control'
                        id='inputQty1'
                        onChange={handleChange}
                        value={stockDetails.yqty}
                      />
                    </div>
                    <div className='col-sm-4'>
                      <input
                        type='text'
                        className='form-control'
                        id='inputPrice1'
                        onChange={handleChange}
                        value={stockDetails.ytradePrice}
                      />
                    </div>
                  </div>
                  <div className='row mb-3'>
                    <label for='inputEmail3' className='col-sm-2 col-form-label'>
                      {tradeDetails?.xStock}
                    </label>
                    <div className='col-sm-2'>
                      <select
                        id='inputType2'
                        className='form-select'
                        onChange={handleChange}
                        // defaultValue={0}
                        value={stockDetails.xtype}
                      >
                        <option>Choose...</option>
                        <option>Buy</option>
                        <option>Sell</option>
                      </select>
                    </div>
                    <div className='col-sm-4'>
                      <input
                        type='text'
                        className='form-control'
                        id='inputQty2'
                        onChange={handleChange}
                        value={stockDetails.xqty}
                      />
                    </div>
                    <div className='col-sm-4'>
                      <input
                        type='text'
                        className='form-control'
                        id='inputPrice2'
                        onChange={handleChange}
                        value={stockDetails.xtradePrice}
                      />
                    </div>
                  </div>
                </form>
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    data-bs-dismiss='modal'
                    id='closeModal'
                  >
                    Close
                  </button>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={handleSubmit}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTradeModal;
