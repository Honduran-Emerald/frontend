import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ButtonGradient } from '../common/ButtonGradient';
import { ButtonOutline } from '../common/ButtonOutline';
import { StatChips } from './StatChips';
import { LevelBar } from './LevelBar';
import { Image } from 'react-native';
import { getImageAddress } from '../utils/requestHandler';
import { ImagePicker } from '../common/ImagePicker';
import { useState } from 'react';

interface ProfileTopProps {
  ownProfile?: boolean,
  following?: boolean,
  friends? : boolean,
  profileData: {
    username: string,
    profileImageId: string,
    followers: number,
    questsCreated: number,
    questsPlayed: number,
    level: number,
    xp: number,
  }
}
export const ProfileTop = ({following, ownProfile, friends, profileData} : ProfileTopProps) => {
  const [image, setImage] = useState<string>("");
  return(
    <View>
      <View style={style.outerWrapper}>
        <View style={style.profileImage}>
          {
            ownProfile ? 
              <ImagePicker aspect={[4, 4]} image={image} setImage={setImage} style={style.profileImage} />
              : <Image source={{uri: getImageAddress(profileData.profileImageId, profileData.username)}} style={style.profileImage} />
              
          }
        </View>
        <View style={style.buttonGroup}>
          <Text style={style.username}>{profileData.username}</Text>
          {
            ownProfile ? 
              <ButtonOutline label='Edit Profile' onPress={() => {}} /> : 
              (
                <>
                  {following ? <ButtonOutline label='Unfollow' onPress={() => {}} /> : <ButtonGradient label='Follow' onPress={() => {}}/>}
                  {friends && <ButtonGradient label='Message' onPress={() => {}} />}
                </>
              )
          }
        </View>
      </View>
      <StatChips followers={profileData.followers} questsCreated={profileData.questsCreated} questsPlayed={profileData.questsPlayed}/>
      <LevelBar level={profileData.level} xp={profileData.xp} />
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
    zIndex: 20
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