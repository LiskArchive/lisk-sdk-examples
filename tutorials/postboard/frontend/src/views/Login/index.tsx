import { AuthContext } from 'context/AuthContext';
import types from 'context/types';
import React, { useContext, useState } from 'react';
import { CloseSvg } from '../../assets/icons';
import Button from '../../components/Button';
import Overlay from '../../components/Overlay';
import PassphraseInput from './PassphraseInput';

const Login = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const authContext = useContext(AuthContext);
  const closeModal = () => setIsOpen(false);
  const login = () => setIsOpen(true);
  const logout = () => authContext.dispatch({ type: types.LOG_OUT, payload: {} });

  const isAuthenticated = authContext.state.address;

  return (
    <div className="login">
      <Button onClick={isAuthenticated ? logout : login} className={isAuthenticated && 'outline'}>
        {isAuthenticated ? 'Logout' : 'Login'}
      </Button>
      <Overlay isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="login-overlay">
          <div className="float-right" onClick={closeModal}>
            <CloseSvg />
          </div>
          <div className="text-center">
            <h4>Login to Lisk Postboard</h4>
            <p>Enter your secret recovery phrase to sign in to your account.</p>
          </div>
          <PassphraseInput length={24} maxInputsLength={24} closeModal={closeModal} />
        </div>
      </Overlay>
    </div>
  );
};

export default Login;
