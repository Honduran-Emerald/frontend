import React from 'react';
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import _ from 'lodash';

import { QuestHeader, QuestTracker } from '../types/quest';
import { styleGameplay } from './styleGameplay';
import { updateAcceptedQuest } from '../redux/quests/questsSlice';
import { useAppDispatch } from '../redux/hooks';

interface FinishMessageProps {
  quest: QuestHeader | undefined,
  tracker: QuestTracker | undefined,
  handleVote: (vote: 'None' | 'Up' | 'Down') => Promise<Response>,
}

export const FinishMessage: React.FC<FinishMessageProps> = ({ quest, tracker, handleVote }) => {

  const [votes, setVotes] = React.useState(quest ? quest.votes : 0);
  const [hasVoted, setHasVoted] = React.useState(tracker?.vote);
  const [inputDisabled, setInputDisabled] = React.useState(false);

  const dispatch = useAppDispatch();

  const creationDate = tracker ? new Date(Date.parse(tracker.creationTime)) : new Date();
  const currentDate = new Date();
  const secondsElapsed = (currentDate.getTime() - creationDate.getTime()) / 1000;
  const seconds = Math.floor(secondsElapsed % 60);
  const minutesElapsed = Math.floor(secondsElapsed / 60);
  const minutes = Math.floor(minutesElapsed % 60);
  const hoursElapsed = Math.floor(minutesElapsed / 60);
  //const timeElapsed = new Date(secondsElapsed * 1000).toISOString().substr(11,8);
  const timeElapsed = `${hoursElapsed}h ${minutes}m ${seconds}s`

  const handleClick = (vote: 'None' | 'Up' | 'Down') => {
    setInputDisabled(true);
    handleVote(vote).then((res) => {
      console.log(JSON.stringify(res));
      setInputDisabled(false);
      let newTracker = _.cloneDeep(tracker);
      if(newTracker) {
        newTracker.vote = vote;
        dispatch(updateAcceptedQuest(newTracker));
      }
      if(res.status === 200) setHasVoted(vote);
      if(res.status === 200) vote === 'Up' ? setVotes(votes + 1) : setVotes(votes - 1);
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
            <TouchableNativeFeedback style={styles.round} onPress={() => inputDisabled ? {} : handleClick('Up')}>
              <View style={styles.backButton}>
                <MaterialCommunityIcons name='chevron-up' size={36} color={hasVoted === 'Up' ? 'lime' : '#fff'}/>
              </View>
            </TouchableNativeFeedback>
          </View>
          <Text style={styles.voteNumber}>
            {votes}
          </Text>
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
      <View style={styles.divider}/>
      <Text style={styles.stats}>
        Total Experience: 11400
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
