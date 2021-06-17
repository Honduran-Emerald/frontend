import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {DiscoveryScreen} from "./DiscoveryScreen";
import QuestDetailScreen from '../common/QuestDetailScreen';

const Stack = createStackNavigator();

export const DiscoveryNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={(route) => ({
                headerShown: false
            })}
        >
          <Stack.Screen name="DiscoveryScreen" component={DiscoveryScreen}/>
          <Stack.Screen name='QuestDetail' component={QuestDetailScreen}/>
        </Stack.Navigator>
    )
}
