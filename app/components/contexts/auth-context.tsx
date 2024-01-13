'use client';

import { createContext, ReactNode, useReducer } from "react";
import { User } from "@/gql/graphql";
import { createAction } from "@/lib/utils";

type AuthContextType = {
  user: User | null,
  setUser: (userData: User|null) => void,
}

const INITIAL_STATE: AuthContextType = {
  user: null,
  setUser: () => {},
};

export const AuthContext = createContext<AuthContextType>(INITIAL_STATE);

// enum AuthActionTypes {
//   SET_USER = 'SET_USER',
// }

const AUTH_ACTION_TYPES = {
  SET_USER: 'SET_USER',
} as const;

type ObjectValues<T> = T[keyof T];

type AuthActionTypes = ObjectValues<typeof AUTH_ACTION_TYPES>;

const authReducer = (state: AuthContextType, action: Action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const AuthContextProvider = ({ children }: {children: ReactNode}) => {
  const [{ user }, dispatch] = useReducer(authReducer, INITIAL_STATE);
  const storeUser = (userData: User) => {
    dispatch(createAction(AUTH_ACTION_TYPES.SET_USER, userData));
  }

  const value = {
    user,
    setUser: storeUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
