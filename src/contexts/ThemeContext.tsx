import React, { createContext, useContext, ReactNode } from 'react';
import { AppSettings } from '../types/common.types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

interface ThemeContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  toggleAnimations: () => void;
  toggleConnections: () => void;
  toggleGridSnap: () => void;
  toggleAutoSave: () => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  autoSave: true,
  showConnections: true,
  enableAnimations: true,
  gridSnap: false,
  theme: {
    mode: 'dark',
    primaryColor: '#64b5f6',
    secondaryColor: '#81c784',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    STORAGE_KEYS.SETTINGS,
    defaultSettings
  );

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const toggleAnimations = () => {
    setSettings(prev => ({ ...prev, enableAnimations: !prev.enableAnimations }));
  };

  const toggleConnections = () => {
    setSettings(prev => ({ ...prev, showConnections: !prev.showConnections }));
  };

  const toggleGridSnap = () => {
    setSettings(prev => ({ ...prev, gridSnap: !prev.gridSnap }));
  };

  const toggleAutoSave = () => {
    setSettings(prev => ({ ...prev, autoSave: !prev.autoSave }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const value: ThemeContextType = {
    settings,
    updateSettings,
    toggleAnimations,
    toggleConnections,
    toggleGridSnap,
    toggleAutoSave,
    resetSettings,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};