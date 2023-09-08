import React, { ReactNode } from 'react';

type OverlayProps = {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const Overlay = ({ children, isOpen }: OverlayProps) => {
  return (
    <div className="overlay-item">
      <div className={`overlay-bg ${isOpen && 'is-open'}`}>
        {isOpen && <div className={`children ${isOpen && 'is-open'}`}>{children}</div>}
      </div>
    </div>
  );
};

export default Overlay;
