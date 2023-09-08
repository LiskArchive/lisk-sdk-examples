import { AlertContext } from 'context/AlertContext';
import types from 'context/types';
import React, { useContext, useEffect } from 'react';

type AlertType = {
  message: string;
  type?: 'success' | 'danger';
};

const Alert = ({ message, type = 'success' }: AlertType) => {
  const { state, dispatch } = useContext(AlertContext);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (state.message) {
      timeout = setTimeout(() => dispatch({ type: types.REMOVE_ALERT, payload: {} }), 1500);
    }
    return () => clearTimeout(timeout);
  }, [state.message]);

  return (
    <div className="alert-item text-center">
      <div className={`alert alert-${type}`} role="alert">
        <div className="content">{message}</div>
      </div>
    </div>
  );
};

export default Alert;
