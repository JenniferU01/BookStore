// src/context/AppContext.tsx
import React, { createContext, useContext, useState } from 'react';

type AppContextType = {
  isLogged: boolean;
  login: () => void;
  logout: () => void;
};

const AppContext = createContext<AppContextType>(null!);

export function AppProvider({ children }: any) {
  const [isLogged, setIsLogged] = useState(true); // login automático

  return (
    <AppContext.Provider
      value={{
        isLogged,
        login: () => setIsLogged(true),
        logout: () => setIsLogged(false),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
