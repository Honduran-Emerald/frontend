import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatOverview } from './overview/ChatOverview';
import FriendlistScreen from './FriendlistScreen';
import AddFriendScreen from './AddFriendScreen';
import {StatusBar as StatusBar2} from "react-native";

export const ChatNavigator: React.FC = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
          name='ChatOverview'
          component={ChatOverview}
          options={{
            title: 'Chat',
            headerTitle: 'Chat',
            headerStyle: {borderTopColor: "#f2f2f2", borderTopWidth: StatusBar2.currentHeight}
          }}/>
      <Stack.Screen name={'Friendlist'} component={FriendlistScreen} options={{headerShown: false}}/>
      <Stack.Screen name={'AddFriend'} component={AddFriendScreen} options={{headerTitle: 'Follow new users'}}/>
    </Stack.Navigator>
  )
}
