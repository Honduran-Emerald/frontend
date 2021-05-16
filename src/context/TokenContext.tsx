import React, { createContext } from 'react';

export const TokenContext = createContext({
  token: '',
  updateToken: (newToken :string) => {},
});
