import { createContext, useContext, useState, useEffect } from 'react';

const ModeContext = createContext();

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // 로컬 스토리지에서 저장된 모드 불러오기
    const savedMode = localStorage.getItem('timeshare_mode');
    return savedMode || null; // null이면 모드 선택 화면 표시
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('timeshare_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (mode) {
      localStorage.setItem('timeshare_mode', mode);
    }
  }, [mode]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('timeshare_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const switchMode = (newMode) => {
    setMode(newMode);
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
  };

  const value = {
    mode,
    switchMode,
    currentUser,
    updateUser,
    isYouthMode: mode === 'youth',
    isSeniorMode: mode === 'senior',
  };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
};
