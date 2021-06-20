import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ButtonGradient } from '../common/ButtonGradient';
import { ButtonOutline } from '../common/ButtonOutline';
import { StatChips } from './StatChips';
import { LevelBar } from './LevelBar';

interface ProfileTopProps {
  following?: boolean,
  ownProfile?: boolean,
  friends? : boolean,
  followers: number,
  username: string,
  questsCreated: number,
  questsPlayed: number,
  level: number,
  xp: number,
}
export const ProfileTop = ({following, ownProfile, friends, followers, username, questsCreated, questsPlayed, level, xp} : ProfileTopProps) => {
  return(
    <View>
      <View style={style.outerWrapper}>
        <View style={style.profileImage} />
        <View style={style.buttonGroup}>
          <Text style={style.username}>{username}</Text>
          {
            ownProfile ? 
              <ButtonOutline label='Edit Profile' onPress={() => {}} /> : 
              (
                <>
                  {following && <ButtonOutline label='Unfollow' onPress={() => {}} />}
                  {friends && <ButtonGradient label='Message' onPress={() => {}} />}
                </>
              )
          }
        </View>
      </View>
      <StatChips followers={followers} questsCreated={questsCreated} questsPlayed={questsPlayed}/>
      <LevelBar level={level} xp={xp} />
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