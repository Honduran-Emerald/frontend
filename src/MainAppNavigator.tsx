import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import { MaterialCommunityIcons }from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

import { MapNavigator } from './map/MapNavigator';
import {DiscoveryNavigator} from "./discovery/DiscoveryNavigator";

import { ModuleGraph } from './quest-editor/ModuleGraph';
import { QuestEditorNavigator } from './quest-editor/QuestEditorNavigator';
        
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { setToken, unsetToken } from './redux/authentication/authenticationSlice';
import { getUserSelfRequest, queryQuestsRequest } from './utils/requestHandler';
import { ScrollView } from 'react-native-gesture-handler';

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
      <Tab.Screen name="Home" component={DiscoveryNavigator}/>
      <Tab.Screen name="Questlog" component={QuestEditorNavigator} />
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
  
  const [t, st] = useState<any>(undefined);
  const [u, su] = useState<any>(undefined);

  const handleLogout = () => {
    deleteToken().then(() => {});
    dispatch(unsetToken())
  }

  return(
    <ScrollView style={styles.container}>
      <Text>{token}</Text>
      <Text> QUESTS </Text>
      <Text>{JSON.stringify(t)}</Text>
      <Text> USER </Text>
      <Text>{JSON.stringify(u)}</Text>
      
      <Button color={'#1D79AC'} title={'Logout'} onPress={handleLogout}/>
      <Button color={'#1D79AC'} title={'Qusts'} onPress={() => {
        queryQuestsRequest()
        .then(x => x.json())
        .then(x => st(x))
        .catch(x => console.log('hkkek'))
      }}/>
      <Button color={'#1D79AC'} title={'Get Self'} onPress={() => {
        getUserSelfRequest()
        .then(x => x.json())
        .then(x => su(x))
        .catch(x => console.log('joynere kek'))
      }}/>
      <Button color={'#1D79AC'} title={'Poison Token'} onPress={() => {
        dispatch(setToken('ABC'))
      }}/>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40
  },
});
