import React, { useState, useRef, useEffect } from 'react';
import './select.css';

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (itemValue: string) => {
    setSelectedValue(itemValue);
    onValueChange?.(itemValue);
    setIsOpen(false);
  };

  return (
    <div className="select" ref={selectRef}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SelectTrigger) {
            return React.cloneElement(child, { 
              onClick: () => setIsOpen(!isOpen),
              isOpen 
            } as any);
          }
          if (child.type === SelectContent && isOpen) {
            return React.cloneElement(child, { 
              onItemClick: handleItemClick,
              selectedValue 
            } as any);
          }
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger: React.FC<SelectTriggerProps & { onClick?: () => void; isOpen?: boolean }> = ({ 
  children, 
  className = '', 
  onClick,
  isOpen 
}) => {
  return (
    <button 
      className={`select-trigger ${isOpen ? 'select-trigger--open' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const SelectContent: React.FC<SelectContentProps & { onItemClick?: (value: string) => void; selectedValue?: string }> = ({ 
  children, 
  onItemClick,
  selectedValue 
}) => {
  return (
    <div className="select-content">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(child, { 
            onClick: () => onItemClick?.(child.props.value),
            isSelected: child.props.value === selectedValue
          } as any);
        }
        return child;
      })}
    </div>
  );
};

const SelectItem: React.FC<SelectItemProps & { onClick?: () => void; isSelected?: boolean }> = ({ 
  children, 
  onClick,
  isSelected 
}) => {
  return (
    <button 
      className={`select-item ${isSelected ? 'select-item--selected' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  return (
    <span className="select-value">
      {placeholder}
    </span>
  );
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
