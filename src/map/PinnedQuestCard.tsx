import React from 'react';
import {StatusBar, StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import {Avatar, Badge} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '../styles';
import { useAppSelector } from '../redux/hooks';

export default function PinnedQuestCard() {

  const pinnedQuest = useAppSelector((state) => state.quests.pinnedQuest);

  const [objectiveComplete, setObjectiveComplete] = React.useState(false);

  return (
    <View style={styles.outer}>
      {
        pinnedQuest &&
        <View style={styles.container}>
          <TouchableNativeFeedback useForeground={true} onPress={() => { setObjectiveComplete(!objectiveComplete) }}>
            <LinearGradient
              colors={[Colors.primaryLight, 'white']}
              start={{ x: 1, y: 1 }}
              end={{ x: objectiveComplete ? 0.2 : 0.6, y: objectiveComplete ? 0.2 : 0.6 }}
            >
              <View style={{flexDirection: 'row', alignItems: 'center',}}>
                <Avatar.Image style={styles.questAvatar} source={{uri: 'https://static.wikia.nocookie.net/jamesbond/images/9/90/M_%28Judi_Dench%29_-_Profile.jpg/revision/latest?cb=20130506215045'}}/>
                <Badge visible={objectiveComplete} size={18} theme={{colors: {notification: Colors.primaryLight}}} style={styles.badge}/>
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
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 100,
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
    top: 5,
    left: 52,
    borderWidth: 2.5,
    borderColor: Colors.background,
  },
});
