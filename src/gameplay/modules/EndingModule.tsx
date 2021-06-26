import React from 'react';
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';

import { GameplayEndingModule } from '../../types/quest';
import { ModuleRendererProps } from '../ModuleRenderer';
import { Colors } from '../../styles';
import { useAppSelector } from '../../redux/hooks';

export const EndingModule: React.FC<ModuleRendererProps<GameplayEndingModule>> = ({ onChoice, trackerId }) => {

  const acceptedQuests = useAppSelector(state => state.quests.acceptedQuests);

  const [hasContinued, setHasContinued] = React.useState(acceptedQuests.find(tracker => tracker.trackerId === trackerId)?.finished);
  const [inputDisabled, setInputDisabled] = React.useState(false);

  const handleClick = () => {
    setInputDisabled(true);
    setHasContinued(true);
    onChoice(0).then(() => setInputDisabled(false));
  }

  return (
    <View>
      {
        !hasContinued &&
        <View style={styles.container}>
          <TouchableNativeFeedback onPress={() => inputDisabled ? {} : handleClick()}>
            <View style={styles.choice}>
              <Text style={styles.text}>Finish Story</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },
  choice: {
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
    margin: 5,
  },
  text: {
    color: '#fff',
  },
});
