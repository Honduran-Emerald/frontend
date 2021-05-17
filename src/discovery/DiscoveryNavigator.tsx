import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {DiscoveryScreen} from "./DiscoveryScreen";

const Stack = createStackNavigator();

export const DiscoveryNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={(route) => ({
                headerShown: false
            })}
        >
            <Stack.Screen name="DiscoveryScreen" component={DiscoveryScreen}/>
        </Stack.Navigator>
    )
}