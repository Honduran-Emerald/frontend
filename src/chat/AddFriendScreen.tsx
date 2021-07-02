import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../styles';
import { FriendItem } from './FriendlistScreen';

export default function AddFriendScreen() {

  const navigation = useNavigation();

  const [searchInput, setSearchInput] = React.useState('');
  const [hasFollowed, setHasFollowed] = React.useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchbar}>
        <Searchbar
          placeholder={'Search users'}
          onChangeText={(input) => setSearchInput(input)}
          onSubmitEditing={() => alert('search for ' + searchInput)}
          value={searchInput}
          theme={{colors: {primary: Colors.primary}}}
        />
      </View>
      <FriendItem
        user={{userId: 'ds7ztd78s6fd5f6', userName: 'string', image: 'RABN90uqFCUHW8CH', level: 0, experience: 0, glory: 0, questCount: 0, trackerCount: 0}}
        isFriend={false}
        hasFollowed={hasFollowed}
        buttonAction={() => setHasFollowed(!hasFollowed)}
      />
    </ScrollView>
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
})
