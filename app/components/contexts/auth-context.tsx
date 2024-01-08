'use client';

import { createContext, useState } from "react";

type AuthContextType = {
  id: number|null,
  setUser: (userData: any) => void,
}

const INITIAL_STATE: AuthContextType = {
  id: null,
  setUser: () => {},
};

export const AuthContext = createContext<AuthContextType>(INITIAL_STATE);

const setUser = () => {};

const AuthContextProvider = ({ children }: {children: any}) => {
  const [{ id }, dispatch] = useState(INITIAL_STATE);

  const value = {
    id,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
