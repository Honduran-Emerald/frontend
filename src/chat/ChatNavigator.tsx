import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatOverview } from './overview/ChatOverview';
import FriendlistScreen from './FriendlistScreen';
import AddFriendScreen from './AddFriendScreen';

export const ChatNavigator: React.FC = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
          name='ChatOverview'
          component={ChatOverview}
          options={{
            title: 'Chat',
            headerTitle: 'Chat'
          }}/>
      <Stack.Screen name={'Friendlist'} component={FriendlistScreen} options={{headerShown: false}}/>
      <Stack.Screen name={'AddFriend'} component={AddFriendScreen} options={{headerTitle: 'Follow new users'}}/>
    </Stack.Navigator>
  )
}
