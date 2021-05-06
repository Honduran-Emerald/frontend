import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

export const MapScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  return(
    <View style={styles.container}>
      {(location != null && location.coords != null) ?
      <MapView
        zoomEnabled={false}
        scrollEnabled={true}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        showsPointsOfInterest={false}
        // @ts-ignore
        region={{...location.coords, latitudeDelta: 0.0461, longitudeDelta: 0.0210}}
      />
      : <MapView style={styles.map} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});