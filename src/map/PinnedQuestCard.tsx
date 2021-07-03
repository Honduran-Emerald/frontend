import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { Avatar, Badge } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/core';

import { Colors } from '../styles';
import { useAppSelector } from '../redux/hooks';
import { BACKENDIP } from '../../GLOBALCONFIG';

export default function PinnedQuestCard() {

  const navigation = useNavigation();

  const pinnedQuest = useAppSelector((state) => state.quests.pinnedQuest);
  const trackerWithUpdates = useAppSelector((state) => state.quests.trackerWithUpdates);
  const hasUpdate = pinnedQuest ? trackerWithUpdates.includes(pinnedQuest.trackerId) : false;

  const loadQuestObjectiveScreen = () => {
    navigation.navigate('Questlog', { screen: 'GameplayScreen', initial: false,  params: {
      trackerId: pinnedQuest?.trackerId,
      tracker: pinnedQuest,
    }});
  }

  return (
    <View style={styles.outer}>
      {
        pinnedQuest &&
        <View style={styles.container}>
          <TouchableNativeFeedback useForeground={true} onPress={() => loadQuestObjectiveScreen()}>
            <LinearGradient
              colors={[Colors.primaryLight, 'white']}
              start={{ x: 1, y: 1 }}
              end={{ x: hasUpdate ? 0.2 : 0.6, y: hasUpdate ? 0.2 : 0.6 }}
            >
              <View style={{flexDirection: 'row', alignItems: 'center',}}>
                {
                  pinnedQuest.agentProfileImageId &&
                  <Avatar.Image
                    style={styles.questAvatar}
                    theme={{colors: {primary: 'transparent'}}}
                    size={50}
                    source={{uri: `${BACKENDIP}/image/get/${pinnedQuest.agentProfileImageId}`}}
                  />
                }
                {
                  !pinnedQuest.agentProfileImageId &&
                  <Avatar.Image
                    style={styles.questAvatar}
                    theme={{colors: {primary: 'transparent'}}}
                    size={50}
                    source={require('../../assets/background.jpg')}
                  />
                }
                <Badge visible={hasUpdate} size={18} theme={{colors: {notification: Colors.primaryLight}}} style={styles.badge}/>
                <View style={{flexDirection: 'column', width: '100%'}}>
                  <Text style={styles.questName} numberOfLines={1}>
                    {pinnedQuest.questName}
                  </Text>
                  <Text style={styles.objective} numberOfLines={1}>
                    {pinnedQuest.objective}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableNativeFeedback>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: StatusBar.currentHeight,
    borderRadius: 100,
    elevation: 10,
    width: '95%',
    overflow: 'hidden',
  },
  questName: {
    fontSize: 18,
    paddingRight: 85,
  },
  objective: {
    fontSize: 15,
    paddingRight: 85,
  },
  questAvatar: {
    margin: 5,
  },
  badge: {
    position: 'absolute',
    top: 3,
    left: 40,
    borderWidth: 2.5,
    borderColor: Colors.background,
  },
});
