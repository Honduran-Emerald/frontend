import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { QuestMeta } from '../types/quest';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../styles';


export const QuestMarker : React.FC<{quest: QuestMeta}> = ({quest}) => {
    const [showPreview, setShowPreview] = useState(false);
  
    return (
      <Marker key={quest.id} coordinate={{latitude: quest.location.longitude, longitude: quest.location.latitude}} onPress={() => setShowPreview(true)}>
        <View>
          {
            (showPreview) ? (
              <View style={{backgroundColor: Colors.background, maxWidth: "85%"}}>
                <Text>{quest.title}</Text>
                <Text>{quest.description}</Text>
              </View>
              ) :
              <MaterialCommunityIcons name='map-marker-alert' size={40} color={Colors.primary}/>
          }
        </View>
      </Marker>
    )
  };