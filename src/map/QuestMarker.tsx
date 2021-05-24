import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { QuestMeta } from '../types/quest';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Containers } from '../styles';
import { Avatar } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface QuestMarkerProps {
  quest: QuestMeta;
  showPreview: Boolean;
  setShowPreview: () => void;
}

export const QuestMarker : React.FC<QuestMarkerProps> = ({quest, showPreview, setShowPreview}) => {
  return (
    <Marker 
      key={quest.id} 
      coordinate={{latitude: quest.location.latitude, longitude: quest.location.longitude}} 
      onPress={() => {!showPreview ? setShowPreview() : console.log(quest.id)}}
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
                  <Text style={styles.votes}>{quest.ownerId.substr(0, 10)}</Text>
                  <Avatar.Image source={{uri: "https://cdn.discordapp.com/avatars/204349580475760640/e80fb00612d26169ba7145a630ca1f38.png?size=256"}} size={30} />
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