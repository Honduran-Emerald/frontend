import React, { useState, useEffect, useRef, Ref } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { Subscription } from '@unimodules/react-native-adapter';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
        setErrorMsg('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
      setLocation(location);
    })();
    
  }, []);

  // Subscribe to Location updates and write them to location-state
  useEffect(() => {
    (async () => {
      const LOCATION_SETTINGS = {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 0
      };
      
      const unsubscribe = await Location.watchPositionAsync(LOCATION_SETTINGS, (location : Location.LocationObject) => {
        setLocation(location);
      })
  
      setLocationSubscription(unsubscribe);
    })();

    return () => {
      locationSubscription?.remove();
    }
  }, [])

  // Subscribe to Magnetometer updates and write the current heading degree to heading-state
  useEffect(() => {
    const unsubscribeMagnetometer = () => {
      magnetometerSubscription?.remove();
      setMagnetometerSubscription(null)
    }
  
    const subscribeMagnetometer = async () => {
      setMagnetometerSubscription(Magnetometer.addListener((data) => {
        setHeading(magnetometerDegree(magnetometerAngle(data)));
      }))
    }

    const magnetometerDegree = (magnetometer : any) => {
      return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
    };

    const magnetometerAngle = (magnetometer : any) => {
      let angle = 0
      if (magnetometer) {
        let { x, y, z } = magnetometer;
  
        if (Math.atan2(y, x) >= 0) {
          angle = Math.atan2(y, x) * (180 / Math.PI);
        }
        else {
          angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
        }
      }
  
      return Math.round(angle);
    };

    
    subscribeMagnetometer();
    return () => {
      unsubscribeMagnetometer();
    }
  }, [])

  // Animate the camera to the current position set in location-state
  const animateCameraToLocation = () => {
    if(_map.current && location?.coords)
    _map.current.animateCamera({center: location.coords, zoom: 15})
  }

  if (errorMsg) {
    return (
    <View>
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
      <ZoomToLocationButton animateCameraToLocation={animateCameraToLocation}/>
    </View>
  );
};

const ZoomToLocationButton : React.FC<{animateCameraToLocation: Function}> = ({animateCameraToLocation}) => {
  return(
    <View style={styles.locationButton}>
      <TouchableOpacity onPress={() => {animateCameraToLocation()}}>
        <MaterialIcons name='my-location' size={30} color='#1D79AC'/>
      </TouchableOpacity>
    </View>
  );
};

const UserMarker : React.FC<{rotation: number | undefined | null, coordinate: {latitude: number, longitude: number}}> = ({rotation, coordinate}) => {
  return (
    <Marker anchor={{x: 0.5, y: 0.5}} rotation={rotation ? rotation : 0} coordinate={coordinate} flat>
      <View>
        <MaterialCommunityIcons name='navigation' size={30} color={'#1D79AC'}/>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  locationButton: {
    position: 'absolute',
    right: 10,
    bottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 100,
    padding: 12,
    elevation: 3
  }
});