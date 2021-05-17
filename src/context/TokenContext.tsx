import React, { createContext } from 'react';

export const TokenContext = createContext({
  tokenContext: '',
  setTokenContext: (newToken :string) => {},
});
