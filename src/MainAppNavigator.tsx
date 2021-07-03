import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { Badge } from 'react-native-paper';

import { MapNavigator } from './map/MapNavigator';
import { DiscoveryNavigator } from "./discovery/DiscoveryNavigator";
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { logout, setToken } from './redux/authentication/authenticationSlice';
import { getUserSelfRequest, queryQuestsRequest } from './utils/requestHandler';
import { clearQuestState } from './redux/quests/questsSlice';
import { deleteItemLocally } from './utils/SecureStore';
import { Colors } from './styles';
import { ChatNavigator } from './chat/ChatNavigator';
import { removeData } from './utils/AsyncStore';
import { ProfileNavigator } from './profile/ProfileNavigator';
import { GameplayNavigator } from './gameplay/GameplayNavigator';
import { LocalUpdatedTrackerIds } from './utils/TaskManager';

const Tab = createBottomTabNavigator();

export default function MainAppNavigator() {
  const trackerWithUpdates = useAppSelector((state) => state.quests.trackerWithUpdates);

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
              return (
                <View>
                  <MaterialCommunityIcons name={iconName} size={size} color={focused ? Colors.primary : "grey"}/>
                  <Badge visible={trackerWithUpdates.length > 0} style={styles.badge} theme={{colors: {notification: Colors.primaryLight}}} size={13}/>
                </View>
              );
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
        activeTintColor: "#1D79AC",
        keyboardHidesTabBar: true
      }}
    >
      <Tab.Screen name="Home" component={DiscoveryNavigator}/>
      <Tab.Screen name="Questlog" component={GameplayNavigator}/>
      <Tab.Screen name="Map" component={MapNavigator}/>
      <Tab.Screen name="Chat" component={ChatNavigator}/>
      <Tab.Screen name="Profile" component={ProfileNavigator}/>
    </Tab.Navigator>
  );
}

const Dummy = () => {

  const token = useAppSelector((state) => state.authentication.token);
  const dispatch = useAppDispatch();

  const [t, st] = useState<any>(undefined);
  const [u, su] = useState<any>(undefined);

  const handleLogout = () => {
    deleteItemLocally('UserToken').then(() => {}, () => {});
    removeData('PinnedQuestTracker').then(() => {}, () => {});
    removeData(LocalUpdatedTrackerIds).then(() => {}, () => {});
    dispatch(logout())
    dispatch(clearQuestState())
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
  badge: {
    position: 'absolute',
    top: 0,
    right: -4,
    borderWidth: 2,
    borderColor: Colors.background,
  },
});
