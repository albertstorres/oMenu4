import React from 'react';
import './toaster.css';

interface ToasterProps {
  children?: React.ReactNode;
}

const Toaster: React.FC<ToasterProps> = ({ children }) => {
  return (
    <div className="toaster">
      {children}
    </div>
  );
};

export { Toaster };
