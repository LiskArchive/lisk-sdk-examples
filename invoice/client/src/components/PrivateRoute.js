import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import { useStateValue } from '../state';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [{ account }] = useStateValue();

  return (<Route
    {...rest}
    render={props => (
    account
      ? <Component {...props} />
      : <Redirect to="/" />
  )}
  />);
};

PrivateRoute.propTypes = {
  component: PropTypes.shape({}).isRequired,
};

export default PrivateRoute;
