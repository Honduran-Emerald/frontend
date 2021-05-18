import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import { MaterialCommunityIcons }from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

import { MapNavigator } from './map/MapNavigator';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { unsetToken } from './redux/authentication/authenticationSlice';

const Tab = createBottomTabNavigator();

export default function MainAppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName : React.ComponentProps<typeof MaterialCommunityIcons>['name'] = "turtle";

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Questlog":
              iconName = "book-open-variant";
              break;
            case "Map":
              iconName = "map-marker-outline";
              return (
                <View style={{backgroundColor: focused ? "#1D79AC" : "#41A8DF", borderRadius: 100, bottom: 10, padding: 5}}>
                  <MaterialCommunityIcons name={iconName} size={size + 20} color={"white"}/>
                </View>
              );
            case "Chat":
              iconName = "message-text-outline";
              break;
            case "Profile":
              iconName = "account-outline";
              break;
          }

          return <MaterialCommunityIcons name={iconName} size={size + 5} color={color} />;
        }
      })}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: "#1D79AC"
      }}
    >
      <Tab.Screen name="Home" component={Dummy}/>
      <Tab.Screen name="Questlog" component={Dummy} />
      <Tab.Screen name="Map" component={MapNavigator}/>
      <Tab.Screen name="Chat" component={Dummy}/>
      <Tab.Screen name="Profile" component={Dummy} />
    </Tab.Navigator>
  );
}

async function deleteToken() {
  await SecureStore.deleteItemAsync('UserToken');
}

const Dummy = () => {

  const token = useAppSelector((state) => state.authentication.token);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    deleteToken().then(() => {});
    dispatch(unsetToken())
  }

  return(
    <View style={styles.container}>
      <Text>{token}</Text>
      <Button color={'#1D79AC'} title={'Logout'} onPress={handleLogout}/>
      <StatusBar style="auto" />
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
