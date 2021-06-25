import React from 'react';
import {RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Avatar, TouchableRipple} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../styles';
import { User } from '../types/general';
import { getImageAddress } from '../utils/requestHandler';
import {rounded} from "../styles/containers";

interface FriendItemProps {
  user: User,
  isFriend: boolean,
  hasFollowed: boolean,
  buttonAction: () => void
}

export default function FriendlistScreen() {

  const navigation = useNavigation();

  const friendsPlaceholder: User[] = [
    {
      userId: 'ds7ztd78s6fd5f6',
      userName: 'string',
      image: 'RABN90uqFCUHW8CH',
      level: 0,
      experience: 0,
      glory: 0,
      questCount: 0,
      trackerCount: 0
    },
    {
      userId: '98fdg87fd978f7',
      userName: 'Felex',
      image: '',
      level: 0,
      experience: 0,
      glory: 0,
      questCount: 0,
      trackerCount: 0
    },
    {
      userId: 'jv78ds678d6767d',
      userName: 'HK',
      image: 'RABN90uqFCUHW8CH',
      level: 0,
      experience: 0,
      glory: 0,
      questCount: 0,
      trackerCount: 0
    },
    {
      userId: 'd343adasdfdsjkhfj6',
      userName: 'vogel',
      image: '',
      level: 0,
      experience: 0,
      glory: 0,
      questCount: 0,
      trackerCount: 0
    },
  ]

  const [refreshing, setRefreshing] = React.useState(false);
  const [friends, setFriends] = React.useState<User[]>([]);

  React.useEffect(() => {
    // get friends data
    setFriends(friendsPlaceholder);
  }, [])

  const onRefresh = () => {
    setRefreshing(true);
    // get new friends data
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.touchContainer}>
          <TouchableRipple style={styles.rounded} onPress={() => navigation.navigate('ChatOverview')}>
            <View style={styles.backButton}>
              <MaterialCommunityIcons name='arrow-left' size={24} color={Colors.black}/>
            </View>
          </TouchableRipple>
        </View>
        <Text style={styles.headerText}>Friendlist</Text>
        <View style={[styles.touchContainer, styles.marginLeft, styles.addButton]}>
          <TouchableRipple style={styles.rounded} onPress={() => navigation.navigate('AddFriend')}>
            <View style={[styles.backButton]}>
              <MaterialCommunityIcons name='account-plus' size={30} color={Colors.primary}/>
            </View>
          </TouchableRipple>
        </View>
      </View>
      {
        friends.length > 0 &&
        <ScrollView
          style={{width: '100%'}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          {
            friends.map((user) =>
              <FriendItem key={user.userId} user={user} isFriend hasFollowed buttonAction={() => alert('Open chat with ' + user.userName)}/>
            )
          }
        </ScrollView>
      }
      {
        friends.length === 0 &&
        <View style={styles.noFriends}>
          <MaterialCommunityIcons name='magnify' size={48} color={Colors.gray}/>
          <Text style={styles.info}>
            Search for other players and follow each other to become friends and chat!
          </Text>
        </View>
      }
    </View>
  )
}

export function FriendItem({ user, isFriend, hasFollowed, buttonAction }: FriendItemProps) {

  return (
    <TouchableRipple onPress={() => alert('Open profile ' + user.userName)}>
      <View style={styles.friendContainer}>
        <Avatar.Image
          style={styles.avatar}
          size={50}
          theme={{colors: {primary: Colors.primary}}}
          source={{uri: getImageAddress(user.image, user.userName)}}
        />
        <Text style={styles.friendName}>{user.userName}</Text>
        <View style={[styles.touchContainer, styles.marginLeft]}>
          <TouchableRipple style={styles.rounded} onPress={buttonAction}>
            <View style={styles.friendChat}>
              <MaterialCommunityIcons
                name={isFriend ? 'message-text' : hasFollowed ? 'check' : 'account-plus'}
                size={30}
                color={!isFriend && hasFollowed ? 'green' : Colors.primary}
              />
            </View>
          </TouchableRipple>
        </View>
      </View>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 5,
    borderColor: Colors.gray,
  },
  headerText: {
    fontSize: 24,
  },
  backButton: {
    backgroundColor: 'transparent',
    ...rounded,
    padding: 10,
  },
  addButton: {
    marginRight: 20,
  },
  noFriends: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    width: '70%',
    textAlign: 'center',
    color: Colors.gray,
    marginTop: 15,
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: Colors.gray,
  },
  friendName: {
    fontSize: 18,
  },
  touchContainer: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  friendChat: {
    borderRadius: 100,
    backgroundColor: 'transparent',
    padding: 10,
  },
  avatar: {
    marginRight: 10,
  },
  rounded: {
    borderRadius: 100,
  },
  marginLeft: {
    marginLeft: 'auto',
  },
})