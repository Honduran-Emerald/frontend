import React from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Avatar, Searchbar} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../styles';
import { User } from '../types/general';
import { getImageAddress } from '../utils/imageHandler';
import { getUserFriends } from '../utils/requestHandler';
import {removeSpecialChars} from "../gameplay/QuestlogScreen";

interface FriendItemProps {
  user: User,
  isFriend: boolean,
  hasFollowed: boolean,
  buttonAction: () => void
}

export function getUserSearch(users: User[], searchInput: string) {
  if (!users) return [];
  if (searchInput) {
    let newUsers: User[] = [];
    const normalizedSearch = removeSpecialChars(searchInput);
    users.map((user) => {
      const normalizedUserName = removeSpecialChars(user.userName);
      if (normalizedUserName.includes(normalizedSearch)) {
        newUsers.push(user);
      }
    })
    return newUsers;
  }
  return users;
}

export default function FriendlistScreen() {

  const navigation = useNavigation();

  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [searchInput, setSearchInput] = React.useState<string>('');
  const [friends, setFriends] = React.useState<User[]>([]);

  React.useEffect(() => {
    // get friends data
    getFriends().then(() => {});
  }, [])

  const getFriends = () => {
    return getUserFriends()
      .then((res) => res.json()
        .then((data) => {
          if(res.status === 200) {
            setFriends(data.users);
          }
        })
      )
  }

  const onRefresh = () => {
    setRefreshing(true);
    getFriends().then(() => setRefreshing(false));
  }

  const openChat = (user: User) => {
    navigation.navigate('ChatPersonal', {
      userName: user.userName,
      userImgSource: getImageAddress(user.image, user.userName),
      userTargetId: user.userId
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.touchContainer}>
          <TouchableNativeFeedback style={styles.rounded} onPress={() => navigation.navigate('ChatOverview')}>
            <View style={styles.backButton}>
              <MaterialCommunityIcons name='arrow-left' size={24} color={Colors.black}/>
            </View>
          </TouchableNativeFeedback>
        </View>
        <Text style={styles.headerText}>Friendlist</Text>
        <View style={[styles.touchContainer, styles.marginLeft, styles.addButton]}>
          <TouchableNativeFeedback style={styles.rounded} onPress={() => navigation.navigate('AddFriend')}>
            <View style={[styles.backButton]}>
              <MaterialCommunityIcons name='account-plus' size={30} color={Colors.primary}/>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
      {
        friends.length > 0 &&
        <View style={styles.searchbar}>
          <Searchbar
            placeholder={'Search friends'}
            onChangeText={(input) => setSearchInput(input)}
            value={searchInput}
            theme={{colors: {primary: Colors.primary}}}
          />
        </View>
      }
      <FlatList
        data={getUserSearch(friends, searchInput)}
        keyExtractor={(item) => item.userId}
        renderItem={
          ({ item }) =>
            <FriendItem
              user={item}
              isFriend={true}
              hasFollowed={true}
              buttonAction={() => openChat(item)}
            />
        }
        ListHeaderComponent={() =>
          friends.length === 0 ?
            <View style={styles.noFriends}>
              <MaterialCommunityIcons name='magnify' size={48} color={Colors.gray}/>
              <Text style={styles.info}>
                Search for other players and follow each other to become friends and chat!
              </Text>
            </View>
            :
            null
        }
        onRefresh={() => onRefresh()}
        refreshing={refreshing}
        style={{height: '100%', width: '100%'}}
      />
    </View>
  )
}

export function FriendItem({ user, isFriend, hasFollowed, buttonAction }: FriendItemProps) {
  const navigation = useNavigation();

  return (
    <TouchableNativeFeedback onPress={() => navigation.navigate('UserProfile', {screen: 'Profile', params:{userId: user.userId}})}>
      <View style={styles.friendContainer}>
        <Avatar.Image
          style={styles.avatar}
          size={50}
          theme={{colors: {primary: Colors.primary}}}
          source={{uri: getImageAddress(user.image, user.userName)}}
        />
        <Text style={styles.friendName}>{user.userName}</Text>
        <View style={[styles.touchContainer, styles.marginLeft]}>
          <TouchableNativeFeedback style={styles.rounded} onPress={buttonAction}>
            <View style={styles.friendChat}>
              <MaterialCommunityIcons
                name={isFriend ? 'message-text' : hasFollowed ? 'check' : 'account-plus'}
                size={30}
                color={!isFriend && hasFollowed ? 'green' : Colors.primary}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </TouchableNativeFeedback>
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
    borderColor: Colors.gray,
  },
  headerText: {
    fontSize: 20,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderRadius: 100,
    padding: 10,
  },
  addButton: {
    marginRight: 20,
  },
  searchbar: {
    justifyContent: 'center',
    padding: 15,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderColor: Colors.gray,
  },
  noFriends: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 270,
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
