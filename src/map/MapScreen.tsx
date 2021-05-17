import React, { useState, useEffect, useRef, Ref } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Subscription } from '@unimodules/react-native-adapter';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MagnetometerSubscription } from './MagnetometerSubscription';
import { Colors, Containers } from '../styles';
import { RoundIconButton } from '../common/RoundIconButton'
import { FAB } from 'react-native-paper';

export const MapScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [heading, setHeading] = useState<number>();
  const [magnetometerSubscription, setMagnetometerSubscription] = useState<Subscription | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription>();
  const _map : Ref<MapView> = useRef(null);


  // Get Location Permission and set initial Location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return Promise.reject(new Error("Permission to access location was denied"))
      }
  
      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
      setLocation(location);
    })()
    .then(async () => {
      const LOCATION_SETTINGS = {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 0
      };
      
      // subscribe to Location updates
      const unsubscribe = await Location.watchPositionAsync(LOCATION_SETTINGS, (location : Location.LocationObject) => {
        setLocation(location);
      })
      MagnetometerSubscription.subscribe(setMagnetometerSubscription, setHeading)
      
      setLocationSubscription(unsubscribe);
    })
    .catch((err : Error) => {setErrorMsg(err.message)});
    
    return () => {
      MagnetometerSubscription.unsubscribeAll();
    }
  }, [])

  // Hook to remove locationSubscription, I don't know how and why this works, pls don't touch
  useEffect(() => {
    return () => {
      locationSubscription?.remove();
    }
  }, [locationSubscription])

  // Animate the camera to the current position set in location-state
  const animateCameraToLocation = () => {
    if(_map.current && location?.coords)
    _map.current.animateCamera({center: location.coords, zoom: 15, heading:0})
  }

  if (errorMsg) {
    return (
    <View style={styles.container}>
      <Text>{errorMsg}</Text>
    </View>)
  }
  
  return(
    <View style={styles.container}>
      {(location != null && location.coords != null) &&
      (<MapView
        ref={_map}
        showsCompass={false}
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={true}
        style={styles.map}
        showsPointsOfInterest={false}
        initialRegion={{latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0461, longitudeDelta: 0.0210}}
      >
        <UserMarker rotation={heading} coordinate={location.coords}/>
      </MapView>
      )}
      <FAB 
        style={styles.locationButton}
        icon="crosshairs-gps"
        onPress={animateCameraToLocation}
        color={Colors.primary}
      />
    </View>
  );
};

const ZoomToLocationButton : React.FC<{animateCameraToLocation: Function}> = ({animateCameraToLocation}) => {
  return(
    <View style={styles.locationButton}>
      <TouchableOpacity onPress={() => {animateCameraToLocation()}}>
        <MaterialIcons name='my-location' size={30} color={Colors.primary}/>
      </TouchableOpacity>
    </View>
  );
};

const UserMarker : React.FC<{rotation: number | undefined | null, coordinate: {latitude: number, longitude: number}}> = ({rotation, coordinate}) => {
  return (
    <Marker anchor={{x: 0.5, y: 0.5}} rotation={rotation ? rotation : 0} coordinate={coordinate} flat>
      <View>
        <MaterialCommunityIcons name='navigation' size={30} color={Colors.primary}/>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Containers.center,
    backgroundColor: Colors.background,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  locationButton: {
    position: 'absolute',
    right: 10,
    bottom: 20,
    backgroundColor: Colors.background,
  }
});