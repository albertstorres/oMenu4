import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
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

interface SelectContextType {
  selectedValue: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleItemClick: (value: string) => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

const Select: React.FC<SelectProps> = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleItemClick = (itemValue: string) => {
    setSelectedValue(itemValue);
    onValueChange?.(itemValue);
    setIsOpen(false);
  };

  const contextValue: SelectContextType = {
    selectedValue,
    isOpen,
    setIsOpen,
    handleItemClick
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="select" ref={selectRef}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            if (child.type === SelectTrigger) {
              return React.cloneElement(child, { 
                onClick: () => setIsOpen(!isOpen),
                isOpen 
              } as any);
            }
            if (child.type === SelectContent) {
              // Só renderiza o conteúdo quando estiver aberto
              if (isOpen) {
                return child;
              }
              // Retorna null quando fechado para não renderizar
              return null;
            }
          }
          return child;
        })}
      </div>
    </SelectContext.Provider>
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

const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
  const context = useContext(SelectContext);
  if (!context) return null;

  return (
    <div className="select-content">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(child, { 
            onClick: () => context.handleItemClick(child.props.value),
            isSelected: child.props.value === context.selectedValue
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
  const context = useContext(SelectContext);
  const displayValue = context?.selectedValue || placeholder;
  
  return (
    <span className="select-value">
      {displayValue}
    </span>
  );
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
