import React from 'react';
import './separator.css';

interface SeparatorProps {
  className?: string;
}

const Separator: React.FC<SeparatorProps> = ({ className = '' }) => {
  return (
    <hr className={`separator ${className}`} />
  );
};

export { Separator };
