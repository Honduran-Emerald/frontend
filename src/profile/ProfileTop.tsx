import React from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback } from 'react-native';
import { Colors, Containers } from '../styles';
import { LinearGradient } from 'expo-linear-gradient';

export const ProfileTop = () => {
  return(
    <View>
      <View style={style.outerWrapper}>
        <View style={style.profileImage} />
        <View style={style.buttonGroup}>
          <Text style={style.username}>Username</Text>
          <TouchableNativeFeedback style={{elevation: 2}} onPress={() => {}}>
            <View style={style.follow}>
              <Text style={style.followText}>Unfollow</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback useForeground={true} onPress={() => {}}>
            <LinearGradient
              colors={['#1D79AC', '#40A9B8']}
              style={style.message}
            >
              <Text style={style.messageText}>
                Message
              </Text>
            </LinearGradient>
          </TouchableNativeFeedback>
        </View>
      </View>
      <View style={style.chips}>
        <Chip value='200' caption='Followers' />
        <Divider/>
        <Chip value='2020' caption='Created' />
        <Divider/>
        <Chip value='200' caption='Played' />
      </View>
    </View>
  );
}

const Chip = ({value, caption} : {value: string, caption: string}) => (
  <View style={Containers.center}>
    <Text style={{fontSize: 25, fontWeight: 'bold'}}>{value}</Text>
    <Text style={{lineHeight: 15}}>{caption}</Text>
  </View>
)

const Divider = () => (
  <View style={style.divider}/>
)

const style = StyleSheet.create({
  follow: {
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
    color: Colors.primary,
    borderWidth: 1.5,
    padding: 8,
    borderRadius: 5,
    textAlign: 'center',
    alignItems: 'center',
    marginBottom: 5,
    elevation: 5
  },
  followText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  message: {
    padding: 8,
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: 5,
    elevation: 5
  },
  messageText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  outerWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 40
  },
  username: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5
  },
  chips: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 40,
  },
  divider: {
    borderColor: '#000',
    borderRightWidth: 1.5,
    height: '80%',
  },
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: 'darkgreen'
  },
  buttonGroup: {
    justifyContent: 'center',
    minWidth: '40%',
  }
})