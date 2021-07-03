import React from 'react';
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { QuestHeader, QuestTracker } from '../types/quest';
import { styleGameplay } from './styleGameplay';

interface FinishMessageProps {
  quest: QuestHeader | undefined,
  tracker: QuestTracker | undefined,
  handleVote: (vote: 'None' | 'Up' | 'Down') => Promise<Response>,
}

export const FinishMessage: React.FC<FinishMessageProps> = ({ quest, tracker, handleVote }) => {

  const [votes, setVotes] = React.useState(quest ? quest.votes : 0);
  const [hasVoted, setHasVoted] = React.useState(tracker?.vote);
  const [inputDisabled, setInputDisabled] = React.useState(false);

  const creationDate = tracker ? new Date(Date.parse(tracker.creationTime)) : new Date();
  const finishingDate = tracker ? new Date(Date.parse(tracker.trackerNode.creationTime)) : new Date();
  const secondsElapsed = (finishingDate.getTime() - creationDate.getTime()) / 1000;
  const seconds = Math.floor(secondsElapsed % 60);
  const minutesElapsed = Math.floor(secondsElapsed / 60);
  const minutes = Math.floor(minutesElapsed % 60);
  const hoursElapsed = Math.floor(minutesElapsed / 60);
  const timeElapsed = `${hoursElapsed}h ${minutes}m ${seconds}s`

  const handleClick = (vote: 'None' | 'Up' | 'Down') => {
    const oldVote = tracker?.vote
    setInputDisabled(true);
    handleVote(vote).then((res) => {
      if(res.status === 200) setHasVoted(vote);
      if(res.status === 200) {
        if(oldVote !== 'None') {
          if(vote === 'Up' && oldVote === 'Down') {
            setVotes(votes + 2);
          }
          else if(vote === 'Down' && oldVote === 'Up') {
            setVotes(votes - 2);
          }
          else if(vote === 'None' && oldVote === 'Down') {
            setVotes(votes + 1);
          }
          else if(vote === 'None' && oldVote === 'Up') {
            setVotes(votes - 1);
          }
        } else
          vote === 'Up' ? setVotes(votes + 1) : setVotes(votes - 1);
      }
      setInputDisabled(false);
    });
  }

  return (
    <View style={[styleGameplay.bubble, styles.container]}>
      <Text style={styles.header}>
        Quest completed
      </Text>
      <View style={styles.voteAndTitle}>
        <View style={styles.votes}>
          <View style={styles.touchContainer}>
            <TouchableNativeFeedback style={styles.round} onPress={() => inputDisabled ? {} : handleClick(hasVoted === 'Up' ? 'None' : 'Up')}>
              <View style={styles.backButton}>
                <MaterialCommunityIcons name='chevron-up' size={36} color={hasVoted === 'Up' ? 'lime' : '#fff'}/>
              </View>
            </TouchableNativeFeedback>
          </View>
          <Text style={styles.voteNumber}>
            {votes}
          </Text>
          <View style={[styles.touchContainer]}>
            <TouchableNativeFeedback style={styles.round} onPress={() => inputDisabled ? {} : handleClick(hasVoted === 'Down' ? 'None' : 'Down')}>
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
      <View style={styles.divider}/>
      <Text style={styles.stats}>
        Total Experience: {tracker?.experienceCollected ? tracker.experienceCollected : 'Error'}
      </Text>
      <Text style={styles.stats}>
        Time elapsed: {timeElapsed}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop: 40,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  header: {
    color: '#fff',
    fontSize: 28,
    marginBottom: 10,
  },
  voteAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    color: '#fff',
    fontSize: 25,
    paddingRight: 15,
  },
  voteNumber: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  xp: {
    color: '#fff',
  },
  votes: {
    marginRight: 10,
    marginLeft: 10,
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
  divider: {
    width: '90%',
    marginVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#fff',
  },
  stats: {
    marginVertical: 10,
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  }
});
