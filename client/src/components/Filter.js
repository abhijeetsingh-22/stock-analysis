import React from 'react';

function Filter({handleFilterTypeChange, handleFilterValueChange}) {
  return (
    <div>
      {' '}
      <button
        className='btn btn-outline-primary float-right'
        data-bs-toggle='collapse'
        data-bs-target='#filter'
      >
        <i className='bi bi-filter-circle-fill'></i>
      </button>
      <div className='collapse' id='filter'>
        <form>
          <div className='row mb-1'>
            <label htmlFor='inputadfvalue' className='col-sm-2 col-form-label'>
              p-value
            </label>
            <div className='col-sm-2'>
              <select
                id='inputState'
                className='form-select'
                // name='pValue'
                data-filtertoset='pValue'
                onChange={handleFilterTypeChange}
                defaultValue={0}
              >
                /<option>Choose...</option>
                <option>&lt;</option>
                <option>&gt;</option>
                <option>&lt;=</option>
                <option>&gt;=</option>
              </select>
            </div>
            <div className='col-sm-2'>
              <input
                type='text'
                className='form-control'
                id='inputadfvalue'
                data-filtertoset='pValue'
                onChange={handleFilterValueChange}
              />
            </div>
            <label htmlFor='inputadfvalue' className='col-sm-2 col-form-label '>
              Std Error
            </label>
            <div className='col-sm-2'>
              <select
                id='inputState'
                className='form-select'
                data-filtertoset='stdError'
                onChange={handleFilterTypeChange}
                defaultValue={0}
              >
                <option>Choose...</option>
                <option>&lt;</option>
                <option>&gt;</option>
                <option>&lt;=</option>
                <option>&gt;=</option>
              </select>
            </div>
            <div className='col-sm-2'>
              <input
                type='text'
                className='form-control'
                id='inputadfvalue'
                data-filtertoset='stdError'
                onChange={handleFilterValueChange}
              />
            </div>
          </div>
          {/* <div className='row mb-3'>
      <label for='inputPassword3' className='col-sm-2 col-form-label'>
        Password
      </label>
      <div className='col-sm-10'>
        <input type='password' className='form-control' id='inputPassword3' />
      </div>
    </div> */}
          {/* <fieldset className='row mb-3'>
      <legend className='col-form-label col-sm-2 pt-0'>Radios</legend>
      <div className='col-sm-10'>
        <div className='form-check'>
          <input
            className='form-check-input'
            type='radio'
            name='gridRadios'
            id='gridRadios1'
            value='option1'
            checked
          />
          <label className='form-check-label' for='gridRadios1'>
            First radio
          </label>
        </div>
        <div className='form-check'>
          <input
            className='form-check-input'
            type='radio'
            name='gridRadios'
            id='gridRadios2'
            value='option2'
          />
          <label className='form-check-label' for='gridRadios2'>
            Second radio
          </label>
        </div>
        <div className='form-check disabled'>
          <input
            className='form-check-input'
            type='radio'
            name='gridRadios'
            id='gridRadios3'
            value='option3'
            disabled
          />
          <label className='form-check-label' for='gridRadios3'>
            Third disabled radio
          </label>
        </div>
      </div>
    </fieldset> */}
          {/* <div className='row mb-3'>
      <div className='col-sm-10 offset-sm-2'>
        <div className='form-check'>
          <input className='form-check-input' type='checkbox' id='gridCheck1' />
          <label className='form-check-label' for='gridCheck1'>
            Example checkbox
          </label>
        </div>
      </div>
    </div> */}
        </form>
      </div>
    </div>
  );
}

export default Filter;
