import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ButtonGradient } from '../common/ButtonGradient';
import { ButtonOutline } from '../common/ButtonOutline';
import { StatChips } from './StatChips';
import { LevelBar } from './LevelBar';
import { Image } from 'react-native';
import { setUsernameRequest, userToggleFollow, userUpdateImage } from '../utils/requestHandler';
import { ImagePicker } from '../common/ImagePicker';
import { useState } from 'react';
import { getImageAddress } from '../utils/imageHandler';
import { useNavigation } from '@react-navigation/native';
import { User } from '../types/general';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Containers } from '../styles';
import { TextInput } from 'react-native';
import { useRef } from 'react';

interface ProfileTopProps {
  ownProfile?: boolean,
  profileData: User,
  refresh: Function
}
export const ProfileTop = ({ ownProfile, profileData, refresh } : ProfileTopProps) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [imageAddress, setImageAddress] = useState<string>(getImageAddress(profileData.image, profileData.userName));
  const [base64, setBase64] = useState<string>();
  const [userName, setUsername] = useState<string>(profileData.userName);
  const [loading, setLoading] = useState<boolean>(false);
  const [followingState, setFollowingState] = useState<boolean>(profileData.following);
  const navigation = useNavigation();
  const _userNameInput = useRef<TextInput>(null);

  return(
    <View style={{marginBottom: 35}}>
      <View style={style.outerWrapper}>
        {
          editing ? 
            <>
              <View style={style.profileImage}>
                <ImagePicker setBase64={setBase64} aspect={[4, 4]} image={imageAddress} setImage={setImageAddress} style={[style.profileImage, {borderColor: Colors.primary, borderWidth: 2}]} />
              </View>
              <View style={style.buttonGroup}>
                <View style={{flexDirection: 'row', ...Containers.center}}>
                  <TextInput ref={_userNameInput} onEndEditing={value => setUsername(value.nativeEvent.text)} style={[style.username, {flex: 1}]}>{profileData.userName}</TextInput>
                  <MaterialCommunityIcons onPress={() => _userNameInput.current?.focus()} name='pencil' size={24} color={Colors.primary}/>
                </View>
                <ButtonOutline
                  loading={loading}
                  label='Save' 
                  onPress={() => {
                    if(userName.length < 1) {
                      alert('Username cannot be empty');
                      return;
                    }

                    if(base64 || userName !== profileData.userName) {
                      
                      setLoading(true);
                      let promises = [];
                      if(base64)
                        promises.push(userUpdateImage(base64));
                      if(userName !== profileData.userName)
                        promises.push(setUsernameRequest(userName));

                      Promise.all(promises).then(() => {
                        setLoading(false);
                        refresh();
                        setEditing(false);
                        setBase64(undefined);
                      });
                    } else {
                      setEditing(false);
                    }
                  }}
                />
              </View>
            </> :
            <>
              <View style={style.profileImage}>
                <Image source={{uri: imageAddress}} style={style.profileImage} />
              </View>
              <View style={style.buttonGroup}>
                <Text style={style.username}>{userName}</Text>
                {
                  // only show edit button if own profile
                  ownProfile ? 
                    <ButtonOutline label='Edit Profile' onPress={() => {setEditing(true)}} /> : 
                    (
                      <>
                        {
                          // show unfollow or follow button according to if current user is following this profile or not
                          followingState ? 
                            <ButtonOutline label='Unfollow' onPress={() => {setFollowingState(false); userToggleFollow(profileData.userId).then(() => refresh());}} /> : 
                            <ButtonGradient label='Follow' onPress={() => {setFollowingState(true); userToggleFollow(profileData.userId).then(() => refresh());}}/>
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
            </>
        }

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