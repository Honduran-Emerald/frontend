import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
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
      <Image source={require('../../assets/Logo_Full_Black.png')} style={{height: 190, resizeMode: 'center', marginBottom: 10}}/>
      <Text style={style.text}>
        Hona makes use of positioning data to anchor quests in the real world. 
        You will need to allow both foreground and background location permissions for Hona to work.
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
    paddingHorizontal: 70,
  },
  text: {
    fontSize: 20,
    textAlign: 'center'
  },
  button: {
    marginTop: 40,
  },
});