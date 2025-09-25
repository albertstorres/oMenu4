import React from 'react';
import './input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input 
      className={`input ${className}`}
      {...props}
    />
  );
};

export { Input };
