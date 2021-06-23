import React from 'react';
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';

import { ModuleRendererProps } from '../ModuleRenderer';
import { Colors } from '../../styles';
import { GameplayChoiceModule } from '../../types/quest';
import { styleGameplay } from '../styleGameplay';

interface ChoiceType {
  text: string
}

export const ChoiceModule: React.FC<ModuleRendererProps<GameplayChoiceModule>> = ({ module, onChoice }) => {

  const choices: ChoiceType[] = module.module.choices

  const [hasChosen, setHasChosen] = React.useState(module.memento ? module.memento.choice : -1);
  const [inputDisabled, setInputDisabled] = React.useState(false);

  const handleClick = (index: number) => {
    setInputDisabled(true);
    setHasChosen(index);
    onChoice(index).then(() => setInputDisabled(false));
  }

  return (
    <View style={styles.container}>
      {
        hasChosen === -1 &&
        module.module.choices.map((choice: any, index: number) =>
          <TouchableNativeFeedback key={index+1} onPress={() => inputDisabled ? {} : handleClick(index)}>
            <View style={styles.choice}>
              <Text style={styles.text}>{choice.text}</Text>
            </View>
          </TouchableNativeFeedback>
        )
      }
      {
        hasChosen !== -1 &&
        <View style={[styles.chosen, styleGameplay.right]}>
          {
            <Text style={styles.text}>{choices[hasChosen].text}</Text>
          }
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },
  objective: {
    backgroundColor: Colors.primary,
    color: '#FFF',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    margin: 5,
  },
  choice: {
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
    margin: 5,
  },
  chosen: {
    maxWidth: '70%',
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    borderRadius: 50,
    padding: 15,
    margin: 5,
  },
  text: {
    color: '#fff',
  },
});
