import { createContext } from 'react';

export const UserContext = createContext({
  currentUser: null,
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn) => {
    return !isLoggedIn
  },
});