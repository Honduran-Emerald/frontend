import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ButtonGradient } from '../common/ButtonGradient';
import { ButtonOutline } from '../common/ButtonOutline';
import { StatChips } from './StatChips';
import { LevelBar } from './LevelBar';
import { Image } from 'react-native';
import { userToggleFollow, userUpdateImage } from '../utils/requestHandler';
import { ImagePicker } from '../common/ImagePicker';
import { useState } from 'react';
import { useEffect } from 'react';
import { getImageAddress } from '../utils/imageHandler';
import { useNavigation } from '@react-navigation/native';
import { User } from '../types/general';

interface ProfileTopProps {
  ownProfile?: boolean,
  profileData: User
}
export const ProfileTop = ({ownProfile, profileData} : ProfileTopProps) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [image, setImage] = useState<string>(ownProfile ? getImageAddress(profileData.image, profileData.userName): "");
  const [base64, setBase64] = useState<string>();
  const [followingState, setFollowingState] = useState<boolean>(profileData.following);
  const navigation = useNavigation();

  useEffect(() => {
    base64 && userUpdateImage(base64)
  }, [base64])
  return(
    <View style={{marginBottom: 35}}>
      <View style={style.outerWrapper}>
        <View style={style.profileImage}>
          {
            ownProfile ? 
              <ImagePicker setBase64={setBase64} aspect={[4, 4]} image={image} setImage={setImage} style={style.profileImage} />
              : <Image source={{uri: getImageAddress(profileData.image, profileData.userName)}} style={style.profileImage} />
          }
        </View>
        <View style={style.buttonGroup}>
          <Text style={style.username}>{profileData.userName}</Text>
          {
            // only show edit button if own profile
            ownProfile ? 
              <ButtonOutline label='Edit Profile' onPress={() => {setEditing(true)}} /> : 
              (
                <>
                  {
                    // show unfollow or follow button according to if current user is following this profile or not
                    followingState ? 
                      <ButtonOutline label='Unfollow' onPress={() => {setFollowingState(false); userToggleFollow(profileData.userId)}} /> : 
                      <ButtonGradient label='Follow' onPress={() => {setFollowingState(true); userToggleFollow(profileData.userId)}}/>
                  }
                  {
                    // show message button if friends
                    profileData.follower && followingState && 
                      <ButtonGradient 
                        label='Message' 
                        style={{marginTop: 5}} 
                        onPress={() => {
                          navigation.navigate('ChatPersonal', {
                            userName: profileData.userName,
                            userImgSource: getImageAddress(profileData.image, profileData.userName),
                            userTargetId: profileData.userId
                          })
                        }} 
                      />
                  }
                </>
              )
          }
        </View>
      </View>
      <StatChips followers={profileData.followerCount} questsCreated={profileData.questCount} questsPlayed={profileData.trackerCount}/>
      <LevelBar level={profileData.level} xp={profileData.experience} />
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