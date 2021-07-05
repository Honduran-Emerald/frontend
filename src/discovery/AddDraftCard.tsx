import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { Colors } from '../styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../redux/hooks';

export const AddDraftCard: React.FC = () => {

  const navigation = useNavigation();
  const location = useAppSelector(state => state.location.location?.coords)

  return (location ?
    <Card 
      style={[styles.quest, {flexGrow: 1, backgroundColor: Colors.lightGray, minHeight: 150}]}
      onPress={() => navigation.navigate('QuestCreationScreen', {screen: 'QuestCreation', params: {latitude: location.latitude, longitude: location.longitude}})}
      >
      <View style={{width: '100%', flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'gray', marginBottom: 10}}>Add new Draft</Text>
        <MaterialCommunityIcons name='plus-circle-outline' size={40} color={'gray'}/>
      </View>
    </Card> : null
  )
}

const styles = StyleSheet.create({
  quest: {
      margin: 1,
      marginHorizontal: 7,
      width: 150,
      borderWidth: 1,
      borderColor: '#0000'
  },
  pic: {
      height: 80,
  },
  title: {
      fontSize: 12,
      lineHeight: 15,
  },
  content: {
      marginLeft: -10,
      marginTop: -5,
  },
  bLabel: {
      fontSize: 10,
      color: Colors.primary,
  },
});