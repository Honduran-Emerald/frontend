import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';

import { ModuleRendererProps } from '../ModuleRenderer';
import { Colors } from '../../styles';
import { GameplayChoiceModule } from '../../types/quest';
import { styleGameplay } from '../styleGameplay';
import { useState } from 'react';

interface ChoiceType {
  text: string
}

export const ChoiceModule: React.FC<ModuleRendererProps<GameplayChoiceModule>> = ({ module, onChoice }) => {

  const choices: ChoiceType[] = module.module.choices

  const [hasChosen, setHasChosen] = React.useState(module.memento ? module.memento.choice : -1);
  const [inputDisabled, setInputDisabled] = React.useState(false);
  const [loadingChoice, setLoadingChoice] = useState(-1);

  const handleClick = (index: number) => {
    setInputDisabled(true);
    setLoadingChoice(index);
    onChoice(index).then(() => {
      setHasChosen(index);
    }).catch(() => {
    }).then(() => {
      setInputDisabled(false);
      setLoadingChoice(-1);
    });
  }

  return (
    <View style={styles.container}>
      {
        hasChosen === -1 &&
        module.module.choices.map((choice: any, index: number) =>
          <TouchableNativeFeedback key={index+1} onPress={() => inputDisabled ? {} : handleClick(index)}>
            <View style={[styles.choice, inputDisabled && styles.selectedOption]}>
              <Text style={styles.text}>{loadingChoice === index ? <ActivityIndicator size="small" color="#fff" /> : choice.text}</Text>
            </View>
          </TouchableNativeFeedback>
        )
      }
      {
        hasChosen !== -1 &&
        <View style={[styles.chosen, styleGameplay.right]}>
          {
            <Text style={[styles.text]}>{choices[hasChosen].text}</Text>
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
    borderRadius: 30,
    padding: 10,
    paddingLeft: 15,
    margin: 5,
  },
  chosen: {
    maxWidth: '70%',
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    borderRadius: 30,
    padding: 15,
    margin: 5,
  },
  text: {
    color: '#fff',
  },
  selectedOption: {
    backgroundColor: '#777'
  }
});
