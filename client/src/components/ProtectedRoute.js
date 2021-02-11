import React from 'react';
import {Redirect, Route} from 'react-router-dom';

function ProtectedRoute({component: Component, user, ...rest}) {
  console.log('the component is', Component, rest);
  return (
    <Route
      //   {...rest}
      render={(props) => {
        return user.isAuthenticated ? (
          //   <Component {...props} />
          rest.children
        ) : (
          <Redirect to='/signin' />
        );
      }}
    />
  );
}

export default ProtectedRoute;
