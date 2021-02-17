import { createContext } from 'react';

export const UserContext = createContext({
  "uid":"uid unknown",
  "username":"username unknown",
  "password":"password unknown",
  "boards": []
});