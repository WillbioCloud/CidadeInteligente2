import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextType {
  isProfileVisible: boolean;
  isNotificationsVisible: boolean;
  showProfile: () => void;
  hideProfile: () => void;
  showNotifications: () => void;
  hideNotifications: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModals = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModals must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isProfileVisible, setProfileVisible] = useState(false);
  const [isNotificationsVisible, setNotificationsVisible] = useState(false);

  const value = {
    isProfileVisible,
    isNotificationsVisible,
    showProfile: () => setProfileVisible(true),
    hideProfile: () => setProfileVisible(false),
    showNotifications: () => setNotificationsVisible(true),
    hideNotifications: () => setNotificationsVisible(false),
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};