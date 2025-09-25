import React from 'react';
import './badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  return (
    <span className={`badge badge--${variant} ${className}`}>
      {children}
    </span>
  );
};

export { Badge };
