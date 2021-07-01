import React from 'react';
import {Button, Dimensions, FlatList, Image, StyleSheet, Text, View} from 'react-native';
import { Colors } from '../styles';
import {GameplayQuestHeader, QuestHeader} from '../types/quest';
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
    <View style={[styles.stats, {height: height, flexGrow: 1, alignItems: 'center'}]} >

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
        <View style={styles.location}>
          <Entypo name='location-pin' size={24} color='black' style={styles.icon}/>
          <Text>
            {quest?.locationName}
          </Text>
        </View>
        <View style={styles.time}>
          <Entypo name='stopwatch' size={24} color='black' style={styles.icon}/>
          <Text>
            {quest?.approximateTime}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>
        {quest?.description}
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
    borderTopWidth: 0,
    marginBottom: 30,
    elevation: 5,
    width: "100%",
  },
  image: {
    width: Dimensions.get('screen').width * 0.8,
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 15,
  },
  info: {
    width: Dimensions.get('screen').width * 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  location: {
    flexDirection: 'row',
    marginRight: "auto",
    maxWidth: '45%',
  },
  time: {
    flexDirection: 'row',
    marginRight: 3,
    maxWidth: '45%',
  },
  description: {
    textAlign: 'left',
    marginBottom: 15,
  },
  icon: {
    marginRight: 5,
    marginTop: -5,
  },
})
