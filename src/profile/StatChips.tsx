import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip } from '../common/Chip';
import { Divider } from '../common/VerticalDivider';

interface StatChipsProps {
  followers: number,
  questsCreated: number,
  questsPlayed: number
}
export const StatChips = ({followers, questsCreated, questsPlayed} : StatChipsProps) => (
  <View style={style.chips}>
    <Chip value={followers.toString()} caption='Followers' />
    <Divider/>
    <Chip value={questsCreated.toString()} caption='Created' />
    <Divider/>
    <Chip value={questsPlayed.toString()} caption='Played' />
  </View>
)

const style = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 40,
  },
})