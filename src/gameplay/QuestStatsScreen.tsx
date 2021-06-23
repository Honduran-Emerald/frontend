import React from 'react';
import { Button, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../styles';
import { QuestHeader } from '../types/quest';
import {playResetRequest} from "../utils/requestHandler";
import {useNavigation} from "@react-navigation/native";

interface QuestStateScreenProps {
  height: number,
  quest: QuestHeader | undefined,
  flatListRef: React.RefObject<FlatList<any>>,
  trackerId: string
}

const roundingRadius = 50;

export const QuestStatsScreen: React.FC<QuestStateScreenProps> = ({ height, quest, flatListRef, trackerId }) => {

  const navigation = useNavigation();

  const resetQuest = () => {
    /*playResetRequest(trackerId).then((res) => {
      if(res.status === 200) alert('Reload Questlog');
      else alert('Error ' + res.status);
    }).then(() => navigation.goBack())*/
    console.log(trackerId)
  }

  return (
    <View style={[styles.stats, {height: height + roundingRadius}]}>
      <Text style={{
        padding: 50
      }}>
        {JSON.stringify(quest)}
      </Text>
      <Text style={{
        padding: 50
      }}>
        Hier kommen Quest Details hin
      </Text>
      <Button onPress={() => resetQuest()} title='Reset this quest' />
      <Button onPress={() => {flatListRef.current?.scrollToOffset({
        offset: 0
      })}} title='Go to Bottom' />
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
    elevation: 5
  }
})
