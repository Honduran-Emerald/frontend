import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';

import { Colors } from '../styles';
import i18n from "i18n-js";
import { editorTranslations } from './translations';
import { useAppSelector } from '../redux/hooks';
import { getLocation } from '../utils/locationHandler';

export default function LocationPicker({ route }: any) {

  i18n.translations = editorTranslations;
  const navigation = useNavigation();
  const location = useAppSelector((state) => state.location.location);

  const [centerPosition, setCenterPosition] = React.useState<Region | undefined>(undefined);

  // Get Location Permission and set initial Location
  useEffect(() => {
    if(location) {
      setCenterPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025
      });
    } else {
      getLocation().catch(() => {});
    }
  }, [])

  const handleRegionChange = (region: Region) => {
    setCenterPosition(region)
  }

  const handleSelect = () => {
    if(centerPosition) {
      route.params.returnLocation({latitude: centerPosition.latitude, longitude: centerPosition.longitude});
      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      {
        centerPosition &&
        <>
          <MapView
            showsCompass={false}
            zoomEnabled={true}
            scrollEnabled={true}
            rotateEnabled={true}
            showsPointsOfInterest={true}
            onRegionChangeComplete={(region) => handleRegionChange(region)}
            style={styles.map}
            initialRegion={centerPosition}
          />
          <View style={styles.markerFixed}>
            <Image style={styles.marker} source={require('../../assets/map-marker.png')} />
          </View>
        </>
      }
      <Button color={Colors.primary} mode={'contained'} style={styles.button} onPress={() => handleSelect()}>{i18n.t('chooseLocation')}</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -45,
    position: 'absolute',
    top: '50%'
  },
  marker: {
    height: 48,
    width: 48
  },
  button: {
    width: '90%',
    position: 'absolute',
    bottom: 25,
  },
});
