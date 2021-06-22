import React from 'react';
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';

import { ModuleRendererProps } from '../ModuleRenderer';
import { styleGameplay } from '../styleGameplay';
import { Colors } from '../../styles';
import { PrototypeChoiceModule } from '../../types/quest';

export const ChoiceModule: React.FC<ModuleRendererProps<PrototypeChoiceModule>> = (props) => {

  const [hasChosen, setHasChosen] = React.useState(undefined);

  const handleClick = (choice: any, index: number) => {
    console.log('Pressed ' + (index));
    setHasChosen(choice);
  }

  return (
    <View>
      <Text style={styleGameplay.bubble}>{props.module.module.objective}</Text>
      {
        !hasChosen &&
        props.module.module.choices.map((choice: any, index: number) =>
          <TouchableNativeFeedback key={index+1} onPress={() => handleClick(choice, index)}>
            <View style={styles.choice}>
              <Text style={styles.text}>{choice.text}</Text>
            </View>
          </TouchableNativeFeedback>
        )
      }
      {
        hasChosen &&
        <View style={styles.chosen}>
          {
            // @ts-ignore
            <Text style={styles.text}>{hasChosen.text}</Text>
          }
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  choice: {
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
    margin: 5,
  },
  chosen: {
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
    margin: 5,
  },
  text: {
    color: '#fff',
  },
});
