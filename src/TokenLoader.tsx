import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './authentication/AuthNavigator';
import MainAppNavigator from './MainAppNavigator';
import { LoadingScreen } from './common/LoadingScreen'
import { TokenManager } from './utils/TokenManager';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { setToken } from './redux/authentication/authenticationSlice';

export const TokenLoader = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const token = useAppSelector((state) => state.authentication.token)
  const dispatch = useAppDispatch()

  useEffect(() => {
    TokenManager.getToken()
      .then(token => dispatch(setToken(token)))
      .then(() => setIsLoading(false));
  }, [])


  return (
      
    (isLoading) ? (<LoadingScreen/>) : (
        <NavigationContainer>
        {token ? (
            <MainAppNavigator/>
        ) : (
            <AuthNavigator/>
        )}
    </NavigationContainer>) 
    
  );
}
