import React from 'react';
import {StyleSheet, TouchableNativeFeedback, View, Text, Dimensions, StatusBar} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal, Portal } from 'react-native-paper';

import { GameplayLocationModule } from '../../types/quest';
import { ModuleRendererProps } from '../ModuleRenderer';
import { Colors } from '../../styles';
import { useAppSelector } from '../../redux/hooks';

export const LocationModule: React.FC<ModuleRendererProps<GameplayLocationModule>> = ({ module, onChoice }) => {

  const location = useAppSelector((state) => state.location.location);

  const [hasContinued, setHasContinued] = React.useState(!!module.memento);
  const [locationReached, setLocationReached] = React.useState(false);
  const [inputDisabled, setInputDisabled] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const latitudeDelta = location ? Math.abs(module.module.locationModel.latitude - location.coords.latitude) * 1.5 : 0.2;
  const longitudeDelta = location ? Math.abs(module.module.locationModel.longitude - location.coords.longitude) : 0.2;
  const delta = Math.max(latitudeDelta, longitudeDelta);

  const deg2rad = (deg:number) => {
    return deg * (Math.PI/180);
  }

  const rad2deg = (rad:number) => {
    return rad * (180/Math.PI);
  }

  const getCenterPoint = () => {
    if(location) {
      const lat1 = deg2rad(module.module.locationModel.latitude + 0.05);
      const lat2 = deg2rad(location.coords.latitude - 0.05);
      const lon1 = deg2rad(module.module.locationModel.longitude);
      const lonDelta = deg2rad(location.coords.longitude - module.module.locationModel.longitude);
      const Bx = Math.cos(lat2) * Math.cos(lonDelta);
      const By = Math.cos(lat2) * Math.sin(lonDelta);
      const latCenter = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
      const lonCenter = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
      return { initialLat: rad2deg(latCenter), initialLon: rad2deg(lonCenter) };
    }
    return { initialLat: module.module.locationModel.latitude, initialLon: module.module.locationModel.longitude };
  }

  const { initialLat, initialLon } = getCenterPoint();

  const handleClick = () => {
    setInputDisabled(true);
    setHasContinued(true);
    onChoice(0).then(() => setInputDisabled(false));
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          onPress={() => showModal()}
          showsCompass={false}
          zoomEnabled={false}
          scrollEnabled={false}
          rotateEnabled={false}
          style={styles.map}
          showsPointsOfInterest={true}
          initialRegion={{
            latitude: initialLat,
            longitude: initialLon,
            latitudeDelta: delta,
            longitudeDelta: delta
          }}
        >
          {
            location &&
            <>
              <Marker rotation={0} coordinate={location.coords} flat tracksViewChanges={false}>
                <View>
                  <MaterialCommunityIcons name='account' size={30} color={Colors.primary}/>
                </View>
              </Marker>
              <Marker coordinate={module.module.locationModel} tracksViewChanges={false}>
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
      <Portal>
        <Modal visible={modalVisible} dismissable onDismiss={hideModal}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View style={styles.touchContainer}>
                <TouchableNativeFeedback style={styles.rounded} onPress={() => hideModal()}>
                  <View style={styles.backButton}>
                    <MaterialCommunityIcons name='arrow-left' size={24} color={Colors.black}/>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
            <MapView
              showsCompass={false}
              zoomEnabled={true}
              scrollEnabled={true}
              rotateEnabled={false}
              showsPointsOfInterest={true}
              style={styles.modalMap}
              initialRegion={{
                latitude: initialLat,
                longitude: initialLon,
                latitudeDelta: delta,
                longitudeDelta: delta
              }}
            >
              {
                location &&
                <>
                  <Marker rotation={0} coordinate={location.coords} flat tracksViewChanges={false}>
                    <View>
                      <MaterialCommunityIcons name='account' size={30} color={Colors.primary}/>
                    </View>
                  </Marker>
                  <Marker coordinate={module.module.locationModel} tracksViewChanges={false}>
                    <View>
                      <MaterialCommunityIcons name='map-marker-alert' size={40} color={Colors.primary}/>
                    </View>
                  </Marker>
                </>
              }
            </MapView>
          </View>
        </Modal>
      </Portal>
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
  modal: {
    backgroundColor: Colors.background,
    height: Dimensions.get('screen').height,
    marginTop: StatusBar.currentHeight,
  },
  modalMap: {
    width: '100%',
    height: '100%',
  },
  header: {
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    paddingTop: 29,
    paddingLeft: 4,
    paddingVertical: 5,
    borderColor: Colors.gray,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderRadius: 100,
    padding: 10,
  },
  touchContainer: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  rounded: {
    borderRadius: 100,
  },
});
