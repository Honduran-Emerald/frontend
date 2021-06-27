import React from 'react';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { TokenLoader } from './src/TokenLoader';

export default function App() {

  return (
    <Provider store={store}>
      <PaperProvider>
        <TokenLoader />
      </PaperProvider>
    </Provider>
  );
}
