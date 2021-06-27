import React from 'react';
import { StyleSheet, TouchableNativeFeedback, View, Text, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { GameplayLocationModule } from '../../types/quest';
import { ModuleRendererProps } from '../ModuleRenderer';
import { Colors } from '../../styles';
import { useAppSelector } from '../../redux/hooks';

export const LocationModule: React.FC<ModuleRendererProps<GameplayLocationModule>> = ({ module, onChoice }) => {

  const location = useAppSelector((state) => state.location.location);

  const [hasContinued, setHasContinued] = React.useState(!!module.memento);
  const [locationReached, setLocationReached] = React.useState(false);
  const [inputDisabled, setInputDisabled] = React.useState(false);

  const handleClick = () => {
    setInputDisabled(true);
    setHasContinued(true);
    onChoice(0).then(() => setInputDisabled(false));
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          showsCompass={false}
          zoomEnabled={true}
          scrollEnabled={true}
          rotateEnabled={false}
          style={styles.map}
          showsPointsOfInterest={true}
          initialRegion={{
            latitude: module.module.locationModel.latitude,
            longitude: module.module.locationModel.longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2
          }}
        >
          {
            location &&
            <>
              <Marker rotation={0} coordinate={location.coords} flat>
                <View>
                  <MaterialCommunityIcons name='account' size={30} color={Colors.primary}/>
                </View>
              </Marker>
              <Marker coordinate={module.module.locationModel}>
                <View>
                  <MaterialCommunityIcons name='map-marker-alert' size={40} color={Colors.primary}/>
                </View>
              </Marker>
            </>
          }
        </MapView>
      </View>
      {
        !hasContinued && locationReached &&
        <View>
          <TouchableNativeFeedback onPress={() => {}}>
            <View style={styles.continue}>
              <Text style={styles.text}>Continue Story</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  mapContainer: {
    width: '70%',
    borderRadius: 20,
    borderTopLeftRadius: 3,
    borderWidth: 1,
    borderColor: Colors.gray,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: Dimensions.get('window').height * 0.25,
  },
  continue: {
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
    margin: 5,
    marginTop: 10,
  },
  text: {
    color: '#fff',
  },
});
