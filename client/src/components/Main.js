import React, {useState} from 'react';
import Positions from './Positions';
import Table from './Table';
import {Route, Switch} from 'react-router-dom';
import PairDetails from './PairDetails';
import AuthForm from './AuthForm';
import ProtectedRoute from './ProtectedRoute';

const Main = ({user, setUser}) => {
  const [trades, setTrades] = useState([]);

  return (
    <div>
      <Switch>
        <Route
          exact
          path='/signin'
          render={(props) => {
            return <AuthForm user={user} setUser={setUser} />;
          }}
        />

        <ProtectedRoute user={user} exact path='/'>
          <>
            <Positions trades={trades} />

            <Table trades={trades} setTrades={setTrades} setUser={setUser} />
          </>
        </ProtectedRoute>
        <Route exact path='/pairdetails/:ystock/:xstock' component={PairDetails} />
      </Switch>
    </div>
  );
};

export default Main;
