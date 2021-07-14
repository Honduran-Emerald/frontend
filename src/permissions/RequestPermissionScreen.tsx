import React from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import * as Location from "expo-location";
import { useEffect } from 'react';
import { Colors, Containers } from '../styles';
import { Text } from 'react-native';


export const RequestPermissionScreen = ({setPermissionsGranted} : {setPermissionsGranted: (value: boolean) => void}) => {
  const [isGranted, setIsGranted] = React.useState<{backgroundLocation: boolean, foregroundLocation: boolean}>({backgroundLocation: false, foregroundLocation: false});
  useEffect(() => {
    if(Object.values(isGranted).every(item => item)) {
      setPermissionsGranted(true);
    }
  }, [isGranted]);

  return (
    <View style={style.container}>
      <Image source={require('../../assets/Logo_Full_Black.png')} style={{height: 190, resizeMode: 'center', marginBottom: 30}}/>
      <Text style={style.text}>
        To use this app, you need to allow access to location services.
        You can also allow access to background location to increase accuracy and performance of the app.
      </Text>
      <Button mode={'contained'} theme={{colors: {primary: Colors.primary}}} style={style.button} onPress={() => {
        (async () => {
          const statusForeground = await Location.requestForegroundPermissionsAsync();
          const statusBackground = await Location.requestBackgroundPermissionsAsync();

          setIsGranted({backgroundLocation: statusBackground.status === 'granted', foregroundLocation: statusForeground.status === 'granted'});
        })();
        console.log('test');
      }}>
        Grant Permission
      </Button>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    ...Containers.center,
    height: '100%',
    paddingHorizontal: 60,
  },
  text: {
    fontSize: 20,
    textAlign: 'center'
  },
  button: {
    marginTop: 20,
  },
});