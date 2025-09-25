import React, { useEffect } from 'react';
import './sheet.css';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SheetHeaderProps {
  children: React.ReactNode;
}

interface SheetTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface SheetDescriptionProps {
  children: React.ReactNode;
}

const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="sheet-overlay" onClick={() => onOpenChange(false)}>
      <div className="sheet-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const SheetContent: React.FC<SheetContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`sheet-content-wrapper ${className}`}>
      {children}
    </div>
  );
};

const SheetHeader: React.FC<SheetHeaderProps> = ({ children }) => {
  return (
    <div className="sheet-header">
      {children}
    </div>
  );
};

const SheetTitle: React.FC<SheetTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`sheet-title ${className}`}>
      {children}
    </h2>
  );
};

const SheetDescription: React.FC<SheetDescriptionProps> = ({ children }) => {
  return (
    <p className="sheet-description">
      {children}
    </p>
  );
};

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription };
