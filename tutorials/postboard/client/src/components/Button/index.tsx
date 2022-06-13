import React, { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button = ({ children, className, onClick, disabled, ...props }: ButtonProps) => (
  <button className={`button btn btn-primary ${className}`} onClick={onClick} disabled={disabled} {...props}>
    {children}
  </button>
);

export default Button;
