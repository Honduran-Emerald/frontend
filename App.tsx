import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Dummy} /> 
        <Tab.Screen name="Questlog" component={Dummy} />
        <Tab.Screen name="Map" component={Dummy}/>
        <Tab.Screen name="Chat" component={Dummy}/>
        <Tab.Screen name="Profile" component={Dummy} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const Dummy = () => {
  return(
    <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
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
