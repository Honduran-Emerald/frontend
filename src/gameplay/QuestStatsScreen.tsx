import React from 'react';
import {Button, Dimensions, FlatList, Image, StyleSheet, Text, View} from 'react-native';
import { Colors } from '../styles';
import { GameplayQuestHeader, QuestHeader } from '../types/quest';
import {playResetRequest} from "../utils/requestHandler";
import {useNavigation} from "@react-navigation/native";
import {BACKENDIP} from "../../GLOBALCONFIG";
import {Entypo} from "@expo/vector-icons";

interface QuestStateScreenProps {
  height: number,
  quest: GameplayQuestHeader | undefined,
  flatListRef: React.RefObject<FlatList<any>>,
  trackerId: string
}

const roundingRadius = 50;

export const QuestStatsScreen: React.FC<QuestStateScreenProps> = ({ height, quest, flatListRef, trackerId }) => {

  const navigation = useNavigation();

  const resetQuest = () => {
    playResetRequest(trackerId).then((res) => {
      if(res.status === 200) alert('Reload Questlog');
      else alert('Error ' + res.status);
    }).then(() => navigation.goBack())
  }

  /*
  <Text style={{
        padding: 50
      }}
      ellipsizeMode={'tail'}
      numberOfLines={15}>
        {JSON.stringify(quest)}
      </Text>
   */

  return (
    <View style={[styles.stats, {height: height + roundingRadius, flexGrow: 1, alignItems: 'center'}]} >

      <Text>
        <View>
          {
            quest?.imageId &&
            <Image style={styles.image} source={{uri: `${BACKENDIP}/image/get/${quest.imageId}`}}/>
          }
          {
            !quest?.imageId &&
            <Image style={styles.image} source={require('../../assets/background.jpg')}/>
          }
        </View>
        <View style={styles.info}>
          <Entypo name='location-pin' size={24} color='black'/>
          <Text style={styles.location}>
            {quest?.locationName}
          </Text>
          <Entypo name='stopwatch' size={24} color='black'/>
          <Text style={styles.time}>
            {quest?.approximateTime}
          </Text>
        </View>
        <Text style={styles.description}>
          {quest?.description}
        </Text>
      </Text>
      <View style={{position: 'absolute', bottom: 100, width: '100%'}}>
      <Button onPress={() => resetQuest()} title='Reset this quest' />
      <Button onPress={() => {flatListRef.current?.scrollToOffset({
        offset: 0
      })}} title='Go to Bottom' />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  stats: {
    backgroundColor: Colors.background,
    padding: 0,
    margin: 0,
    borderBottomRightRadius: roundingRadius,
    borderBottomLeftRadius: roundingRadius,
    borderTopWidth: 0,
    marginBottom: Dimensions.get('screen').height/2,
    elevation: 5,
    width: "100%",
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 20,
    marginBottom: 15,
  },
  info: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  location: {
    fontSize: 15,
    marginRight: 'auto',
    maxWidth: '45%',
  },
  time: {
    fontSize: 15,
    marginLeft: 3,
    maxWidth: '45%',
  },
  description: {
    textAlign: 'left',
    marginBottom: 15,
  },
})
