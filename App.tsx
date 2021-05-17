import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/authentication/AuthNavigator';
import MainAppNavigator from './src/MainAppNavigator';
import { TokenContext } from './src/context/TokenContext';
import { LoadingScreen } from './src/common/LoadingScreen'
import { TokenManager } from './src/utils/TokenManager';


export default function App() {
  const [token, setToken] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const updateToken = (newToken: string) => {
    setToken(newToken);
  };

  useEffect(() => {
    TokenManager.getToken()
      .then(token => setToken(token))
      .then(() => setIsLoading(false));
  }, [])


  if(isLoading) {
    return <LoadingScreen/>
  }

  return (
    <TokenContext.Provider value={{tokenContext: token, setTokenContext: updateToken}}>
      <NavigationContainer>
        {token ? (
          <MainAppNavigator/>
        ) : (
          <AuthNavigator/>
        )}
      </NavigationContainer>
    </TokenContext.Provider>
  );
}
