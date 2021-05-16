import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import AuthNavigator from './src/authentication/AuthNavigator';
import MainAppNavigator from './src/MainAppNavigator';
import { TokenContext } from './src/context/TokenContext';

const Stack = createStackNavigator();

export default function App() {

  const [token, setToken] = React.useState('');
  const updateToken = (newToken: string) => {
    setToken(newToken);
  };


  return (
    <TokenContext.Provider value={{token, updateToken}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={() => ({headerShown: false})}>
          <Stack.Screen name='Loading' component={LoadingScreen}/>
          <Stack.Screen name='Authentication' component={AuthNavigator}/>
          <Stack.Screen name='MainApp' component={MainAppNavigator}/>
        </Stack.Navigator>
      </NavigationContainer>
    </TokenContext.Provider>
  );
}

async function getToken() {
  let result = await SecureStore.getItemAsync('UserToken');
  if (result) {
    return result;
  } else {
    return null;
  }
}

const LoadingScreen = ({ navigation }: any) => {

  const {token , updateToken} = React.useContext(TokenContext);

  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    //TODO validate token
    getToken().then((token => {token ? updateToken(token) : null; setIsLoaded(true)}), (() => {setIsLoaded(true)}));
  });

  React.useEffect(() => {
    if (isLoaded) {
      token === '' ? navigation.navigate('Authentication') : navigation.navigate('MainApp')
    }
  }, [isLoaded]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color='#1D79AC' />
      <Text>
        Getting things ready
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
