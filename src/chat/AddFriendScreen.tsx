import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import lodash from 'lodash';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '../styles';
import { FriendItem, getUserSearch } from './FriendlistScreen';
import { User } from '../types/general';
import { queryUsersRequest, userToggleFollow } from '../utils/requestHandler';
import {useAppSelector} from "../redux/hooks";

export default function AddFriendScreen() {

  const currentUser: User | undefined = useAppSelector((state) => state.authentication.user);

  const [users, setUsers] = React.useState<User[]>([])
  const [searchInput, setSearchInput] = React.useState<string>('');
  const [inputUpdated, setInputUpdated] = React.useState<boolean>(true);

  React.useEffect(() => {
    getUsers().then(() => {})
  }, [])

  const updateSearch = (input: string) => {
    setSearchInput(input);
    setInputUpdated(true);
  }

  const getUsers = () => {
    return queryUsersRequest()
      .then((res) => res.json()
        .then((data) => {
          if(res.status === 200) {
            const filteredUsers = data.users.filter((user: User) => user.userId !== currentUser?.userId)
            filteredUsers.sort((a: User, b: User) => {
              const textA = a.userName.toUpperCase();
              const textB = b.userName.toUpperCase();
              return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            setUsers(filteredUsers);
          }
        })
      )
  }

  const followUser = (user: User) => {
    userToggleFollow(user.userId).then((res) => {
      if(res.status === 200) {
        console.log('Changed follow status with ' + user.userName);
        const index = users.indexOf(user);
        if(index !== -1) {
          const newUsers = lodash.cloneDeep(users);
          const following = user.following;
          newUsers[index] = {...user, following: !following};
          setUsers(newUsers);
        }
      }
    })
  }

  const searchUsers = () => {
    setInputUpdated(false);
    // TODO endpoint needed, normalization maybe
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchbar}>
        <Searchbar
          placeholder={'Search users'}
          onChangeText={(input) => updateSearch(input)}
          onSubmitEditing={() => searchUsers()}
          value={searchInput}
          theme={{colors: {primary: Colors.primary}}}
        />
      </View>
      <FlatList
        data={getUserSearch(users, searchInput)}
        keyExtractor={(item) => item.userId}
        renderItem={
          ({ item }) =>
            <FriendItem
              user={item}
              isFriend={false}
              hasFollowed={item.following}
              buttonAction={() => followUser(item)}
            />
        }
      />
      {
        users.length === 0 && inputUpdated &&
        <View style={styles.noFriends}>
          <MaterialCommunityIcons name='magnify' size={48} color={Colors.gray}/>
          <Text style={styles.info}>
            Search for other players and follow each other to become friends and chat!
          </Text>
        </View>
      }
      {
        users.length === 0 && searchInput !== '' && !inputUpdated &&
        <View style={styles.noFriends}>
          <MaterialCommunityIcons name='magnify' size={48} color={Colors.gray}/>
          <Text style={styles.info}>
            No users found
          </Text>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
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
    paddingBottom: 180,
  },
  info: {
    width: '70%',
    textAlign: 'center',
    color: Colors.gray,
    marginTop: 15,
  },
})
