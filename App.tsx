import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons }from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName : React.ComponentProps<typeof MaterialCommunityIcons>['name'] = "turtle";

            switch (route.name) {
              case "Home":
                iconName = "home";
                break;
              case "Questlog":
                iconName = "history";
                break;
              case "Map":
                iconName = "map-marker-outline";
                return (
                  <View style={{backgroundColor: "#1D79AC", borderRadius: 100, bottom: 10, padding: 5}}>
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
