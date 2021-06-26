import React from 'react';
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { QuestHeader, QuestTracker } from '../types/quest';
import { styleGameplay } from './styleGameplay';

interface FinishMessageProps {
  quest: QuestHeader | undefined,
  tracker: QuestTracker | undefined,
  handleVote: (vote: 'None' | 'Up' | 'Down') => Promise<void>,
}

export const FinishMessage: React.FC<FinishMessageProps> = ({ quest, tracker, handleVote }) => {

  const [hasVoted, setHasVoted] = React.useState(tracker?.vote);
  const [inputDisabled, setInputDisabled] = React.useState(false);

  const handleClick = (vote: 'None' | 'Up' | 'Down') => {
    setInputDisabled(true);
    handleVote(vote).then(() => {
      setHasVoted(vote);
      setInputDisabled(false);
    });
  }

  return (
    <View style={[styleGameplay.bubble, styles.container]}>
      <View style={styles.header}>
        <View style={styles.votes}>
          <View style={styles.touchContainer}>
            <TouchableNativeFeedback style={styles.round} onPress={() => inputDisabled ? {} : handleClick('Up')}>
              <View style={styles.backButton}>
                <MaterialCommunityIcons name='chevron-up' size={36} color={hasVoted === 'Up' ? 'lime' : '#fff'}/>
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={[styles.touchContainer]}>
            <TouchableNativeFeedback style={styles.round} onPress={() => inputDisabled ? {} : handleClick('Down')}>
              <View style={[styles.backButton]}>
                <MaterialCommunityIcons name='chevron-down' size={36} color={hasVoted === 'Down' ? 'red' : '#fff'}/>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
        <View>
          <Text style={styles.title}>
            {quest?.title}
          </Text>
        </View>
      </View>
      <View>
        <Text style={styles.xp}>
          Total XP: 5600
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop: 40,
    width: '80%',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 25,
  },
  xp: {
    color: '#fff',
  },
  votes: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  touchContainer: {
    borderRadius: 100,
    overflow: 'hidden',
    margin: -5,
  },
  backButton: {
    borderRadius: 100,
    padding: 10,
  },
  round: {
    borderRadius: 100,
  },
});
