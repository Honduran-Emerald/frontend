import 'react-native-gesture-handler';

import React from 'react';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';
import { TokenLoader } from './src/TokenLoader';

export default function App() {

  return (
    <Provider store={store}>
      <TokenLoader />
    </Provider>
  );
}
