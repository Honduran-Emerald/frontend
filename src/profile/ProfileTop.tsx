import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ButtonGradient } from '../common/ButtonGradient';
import { ButtonOutline } from '../common/ButtonOutline';
import { StatChips } from './StatChips';
import { LevelBar } from './LevelBar';

export const ProfileTop = () => {
  return(
    <View>
      <View style={style.outerWrapper}>
        <View style={style.profileImage} />
        <View style={style.buttonGroup}>
          <Text style={style.username}>Username</Text>
          <ButtonOutline label='Unfollow' onPress={() => {}} />
          <ButtonGradient label='Message' onPress={() => {}} />
        </View>
      </View>
      <StatChips followers={200} questsCreated={2000} questsPlayed={100}/>
      <LevelBar level={2} xp={8000} />
    </View>
  );
}

const style = StyleSheet.create({
  outerWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 40
  },
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: 'darkgreen'
  },
  username: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5
  },
  buttonGroup: {
    justifyContent: 'center',
    minWidth: '40%',
  },
})