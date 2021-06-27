import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { QuestHeader } from '../types/quest';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Containers } from '../styles';
import { Avatar } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { getImageAddress } from '../utils/imageHandler';

interface QuestMarkerProps {
  quest: QuestHeader;
  showPreview: Boolean;
  setShowPreview: () => void;
}

export const QuestMarker : React.FC<QuestMarkerProps> = ({quest, showPreview, setShowPreview}) => {
  const navigation = useNavigation()

  return (
    <Marker
      key={quest.id}
      coordinate={{latitude: quest.location.latitude, longitude: quest.location.longitude}}
      onPress={() => {!showPreview ? setShowPreview() : navigation.navigate('QuestDetail', {quest: quest})}}
    >
      {
        (showPreview) ? (
          <TouchableWithoutFeedback onPress={() => {console.log(quest.id)}}>
            <View style={styles.preview}>
              <View>
                <Text style={styles.title}>{quest.title}</Text>
                <Text>{quest.description}</Text>
              </View>
              <View style={styles.bottom}>
                <Text>Votes: {quest.votes}</Text>
                <View style={[styles.creator]}>
                  <Text style={styles.votes} numberOfLines={1}>{quest.ownerName.length > 15 ? quest.ownerName.substr(0, 15) + '...' : quest.ownerName}</Text>
                  <Avatar.Image
                    size={30}
                    theme={{colors: {primary: Colors.primary}}}
                    source={{uri: getImageAddress(quest.ownerImageId, quest.ownerName)}}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          ) : (
            <View>
              <MaterialCommunityIcons name='map-marker-alert' size={40} color={Colors.primary}/>
            </View>
          )
      }
    </Marker>
  )
};

const styles = StyleSheet.create({
  preview: {
    ...Containers.rounded,
    backgroundColor: Colors.background,
    minWidth: '85%',
    maxWidth: '85%',
    padding: 10,
    marginBottom: 50
  },
  title: {
    fontWeight: 'bold',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  creator: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  votes: {
    marginRight: 8
  }
})
