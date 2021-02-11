import React, {useEffect, useState} from 'react';
import {apiCall} from '../services/api';
import {useParams} from 'react-router-dom';
import {Line} from 'react-chartjs-2';

function PairDetails() {
  const {ystock, xstock} = useParams();
  const [res, setRes] = useState({zscoreNormal: [], zscoreRolling: []});
  const [loading, setLoading] = useState(true);
  var data = {
    labels: [...Array(res.zscoreNormal.length).keys()],
    datasets: [
      {
        label: 'Static Calculations',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: res?.zscoreNormal,
      },
    ],
  };
  var data2 = {
    labels: [...Array(res.zscoreRolling.length).keys()],
    datasets: [
      {
        label: 'Rolling calculations',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: res?.zscoreNormal,
      },
    ],
  };

  useEffect(() => {
    apiCall('get', `/api/pairdetails/${ystock}/${xstock}`).then((res) => {
      //   var toset = res.data.map((d) => d.normal);
      console.log('type of res is ', res);
      // console.log('type of res is ', res.xClose);
      // console.log('type of res is ', JSON.parse(res));
      setRes(res);
      console.log(res.zscoreNormal);
      setLoading(false);
    });
  }, [xstock, ystock]);

  return (
    <div>
      <h2>
        {ystock} and {xstock}
      </h2>
      <div className='my-5'>{loading ? 'Loading' : <Line data={data} />}</div>
      <div className='my-5'>{loading ? 'Loading' : <Line data={data2} />}</div>
    </div>
  );
}

export default PairDetails;
