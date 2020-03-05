import PropTypes from 'prop-types';
import React, { createContext, useContext, useReducer } from 'react';

import reducer from './reducer';

const initialState = { };

export const StateContext = createContext();

export const StateProvider = ({ children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

StateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useStateValue = () => useContext(StateContext);
