import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
  fontSize: number;
  highContrast: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  toggleHighContrast: () => void;
  toggleScreenReader: () => void;
  toggleKeyboardNavigation: () => void;
  announceToScreenReader: (message: string) => void;
}

interface AccessibilityProviderProps {
  children: ReactNode;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [fontSize, setFontSize] = useState<number>(16);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [screenReader, setScreenReader] = useState<boolean>(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState<boolean>(false);

  useEffect(() => {
    // Carregar configurações salvas
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setFontSize(settings.fontSize || 16);
      setHighContrast(settings.highContrast || false);
      setScreenReader(settings.screenReader || false);
      setKeyboardNavigation(settings.keyboardNavigation || false);
    }
  }, []);

  useEffect(() => {
    // Salvar configurações
    const settings = {
      fontSize,
      highContrast,
      screenReader,
      keyboardNavigation
    };
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));

    // Aplicar configurações no documento
    document.documentElement.style.fontSize = `${fontSize}px`;
    
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (keyboardNavigation) {
      document.documentElement.classList.add('keyboard-navigation');
    } else {
      document.documentElement.classList.remove('keyboard-navigation');
    }
  }, [fontSize, highContrast, screenReader, keyboardNavigation]);

  const increaseFontSize = (): void => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = (): void => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const resetFontSize = (): void => {
    setFontSize(16);
  };

  const toggleHighContrast = (): void => {
    setHighContrast(prev => !prev);
  };

  const toggleScreenReader = (): void => {
    setScreenReader(prev => !prev);
  };

  const toggleKeyboardNavigation = (): void => {
    setKeyboardNavigation(prev => !prev);
  };

  const announceToScreenReader = (message: string): void => {
    if (screenReader) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  };

  const value: AccessibilityContextType = {
    fontSize,
    highContrast,
    screenReader,
    keyboardNavigation,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleHighContrast,
    toggleScreenReader,
    toggleKeyboardNavigation,
    announceToScreenReader
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
