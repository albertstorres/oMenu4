import React from 'react';
import './label.css';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ children, className = '', ...props }) => {
  return (
    <label 
      className={`label ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export { Label };
