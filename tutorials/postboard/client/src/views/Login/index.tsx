import React, { useState } from 'react';
import { CloseSvg } from '../../assets/icons';
import Button from '../../components/Button';
import Overlay from '../../components/Overlay';
import PassphraseInput from './PassphraseInput';

const Login = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="login">
      <Button onClick={() => setIsOpen(true)}>Login</Button>
      <Overlay isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="login-overlay">
          <div className="float-right" onClick={closeModal}>
            <CloseSvg />
          </div>
          <div className="text-center">
            <h4>Login to Lisk Postboard</h4>
            <p>Enter your secret recovery phrase to sign in to your account.</p>
          </div>
          <PassphraseInput length={12} maxInputsLength={24} closeModal={closeModal} />
        </div>
      </Overlay>
    </div>
  );
};

export default Login;
