import React from 'react';
import { Button, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../styles';
import { QuestHeader } from '../types/quest';

interface QuestStateScreenProps {
  height: number,
  quest: QuestHeader | undefined,
  flatListRef: React.RefObject<FlatList<any>>
}

const roundingRadius = 50;

export const QuestStatsScreen: React.FC<QuestStateScreenProps> = ({ height, quest, flatListRef }) => {

  return (
    <View style={[styles.stats, {height: height + roundingRadius}]}>
      <Text style={{
        padding: 50
      }}
      ellipsizeMode={'tail'}
      numberOfLines={15}>
        {JSON.stringify(quest)}
      </Text>
      <Text style={{
        padding: 50
      }}>
        Hier kommen Quest Details hin
      </Text>
      <View style={{position: 'absolute', bottom: 100, width: '100%'}}>
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
    elevation: 5
  }
})