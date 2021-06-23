import React from 'react';
import { StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import { Text } from 'react-native';
import { GameplayStoryModule } from '../../types/quest';
import { ModuleRendererProps } from '../ModuleRenderer';
import {Colors} from "../../styles";

export const StoryModule: React.FC<ModuleRendererProps<GameplayStoryModule>> = ({ module, onChoice }) => {

  const [hasContinued, setHasContinued] = React.useState(!!module.memento);
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
              <Text style={styles.text}>Continue Story</Text>
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
