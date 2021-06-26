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
      <View style={styles.header}>
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
