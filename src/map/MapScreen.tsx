import React, {useState, useRef, Ref, useCallback} from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Subscription } from '@unimodules/react-native-adapter';
import { MagnetometerSubscription } from './MagnetometerSubscription';
import { Colors, Containers } from '../styles';
import { Button, Dialog, FAB, Paragraph, Portal } from 'react-native-paper';
import { useAppSelector } from '../redux/hooks';
import { useDispatch } from 'react-redux';
import { QuestMarker } from './QuestMarker';
import { useNavigation } from '@react-navigation/core';
import PinnedQuestCard from './PinnedQuestCard';
import { setLocation } from '../redux/location/locationSlice';
import { useFocusEffect } from '@react-navigation/native';
import { LevelLock } from '../common/LevelLock';

export const MapScreen = () => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [heading, setHeading] = useState<number>();
  const [, setMagnetometerSubscription] = useState<Subscription | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription>();
  const [indexPreviewQuest, setIndexPreviewQuest] = useState<Number>();
  const [showNoMoreQuestsDialog, setShowNoMoreQuestsDialog] = useState<boolean>(false);
  const _map : Ref<MapView> = useRef(null);

  const localQuests = useAppSelector((state) => state.quests.localQuests);
  const location = useAppSelector((state) => state.location.location);
  const dispatch = useDispatch();
  const user = useAppSelector(state => state.authentication.user)

  const trackedQuests = useAppSelector(state => state.quests.acceptedQuests);

  const navigation = useNavigation();

  // Get Location Permission and set initial Location
  useFocusEffect(
    useCallback(() => {
      (async () => {
        if(!location){
          let {status} = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            return Promise.reject(new Error("Permission to access location was denied"))
          }

          let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
          dispatch(setLocation(location));
        }
      })()
        .then(async () => {
          const LOCATION_SETTINGS = {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 3000,
            distanceInterval: 3,
          };

          // subscribe to Location updates
          const unsubscribe = await Location.watchPositionAsync(LOCATION_SETTINGS, (location : Location.LocationObject) => {
            dispatch(setLocation(location));
          })
          MagnetometerSubscription.subscribe(setMagnetometerSubscription, setHeading)

          setLocationSubscription(unsubscribe);
        })
        .catch((err : Error) => {setErrorMsg(err.message)});

      return () => {
        MagnetometerSubscription.unsubscribeAll();
      }
    }, [])
  )

  // Hook to remove locationSubscription, I don't know how and why this works, pls don't touch
  useFocusEffect(
    useCallback(() => {
      return () => {
        locationSubscription?.remove();
      }
    }, [locationSubscription])
  )

  // Animate the camera to the current position set in location-state
  const animateCameraToLocation = () => {
    if (_map.current && location?.coords)
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
        onPress={() => {setIndexPreviewQuest(undefined)}}
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
        {localQuests && localQuests.filter((quest) => !trackedQuests.find((tracker) => tracker.questId === quest.id)).map((quest, index) => (
          quest && quest.location &&
            <QuestMarker key={quest.id} quest={quest} showPreview={indexPreviewQuest === index} setShowPreview={() => setIndexPreviewQuest(index)}/>
        ))}
        {trackedQuests
          .filter((quest) => quest.trackerNode.module.type === 'Location')
          .map(quest => (
          //Ternary expression is here because ts doesn't want to understand that quest.trackerNode.module.type is a location module. Second option should never be called
          <Marker coordinate={quest.trackerNode.module.type === 'Location' ? quest.trackerNode.module.location : {latitude: 0, longitude: 0}} key={quest.trackerNode.module.id} tracksViewChanges={false} onPress={() => {
            navigation.navigate('Questlog', {
              screen: 'GameplayScreen',
              initial: false,
              params: {
                trackerId: quest.trackerId,
                tracker: quest,
              }
            })
          }}>
            <View>
              <MaterialCommunityIcons name='map-marker-question' size={40} color={Colors.purple}/>
            </View>
          </Marker>
        ))}
      </MapView>
      )}

      {location && location.coords && (
        <LevelLock permission={{
          type: 'quests',
          quests: user?.questCount
        }} alternative={
          <FAB
            style={{
              position: 'absolute',
              right: 10,
              bottom: 90,
              backgroundColor: Colors.gray
            }}
            onPress={() => setShowNoMoreQuestsDialog(true)}
            icon="plus"
            color={Colors.primary}
            />
          }
          >
          <FAB
            style={styles.createQuestButton}
            icon="plus"
            onPress={() => navigation.navigate('QuestCreationScreen', {screen: 'QuestCreation', params: {latitude: location?.coords.latitude, longitude: location?.coords.longitude}})}
            color={Colors.primary}
          />
        </LevelLock>
      )}

      <Portal><Dialog visible={showNoMoreQuestsDialog} onDismiss={() => setShowNoMoreQuestsDialog(false)} style={{borderRadius: 10}}>
        <Dialog.Title>Cannot create more quests</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Your level is too low. Increase your level to create more quests or delete a quest to make room for this one.</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button color={Colors.primary} onPress={() => setShowNoMoreQuestsDialog(false)}>OK</Button>
        </Dialog.Actions>
      </Dialog></Portal>

      <View style={styles.pinnedCard}>
        <PinnedQuestCard/>
      </View>
      <FAB
        style={styles.locationButton}
        icon="crosshairs-gps"
        onPress={animateCameraToLocation}
        color={Colors.primary}
      />
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
  createQuestButton: {
    position: 'absolute',
    right: 10,
    bottom: 90,
    backgroundColor: Colors.background
  },
  locationButton: {
    position: 'absolute',
    right: 10,
    bottom: 20,
    backgroundColor: Colors.background,
  },
  pinnedCard: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    alignItems: 'center',
  },
});
