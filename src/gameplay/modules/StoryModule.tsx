import React from 'react';
import { StyleSheet, TouchableNativeFeedback, View, Text } from 'react-native';

import { GameplayStoryModule } from '../../types/quest';
import { ModuleRendererProps } from '../ModuleRenderer';
import { Colors } from '../../styles';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native-paper';

export const StoryModule: React.FC<ModuleRendererProps<GameplayStoryModule>> = ({ module, onChoice }) => {

  const [hasContinued, setHasContinued] = React.useState(!!module.memento);
  const [inputDisabled, setInputDisabled] = React.useState(false);

  const handleClick = () => {
    setInputDisabled(true);
    onChoice(0)
      .then(() => setHasContinued(true))
      .catch(() => {})
      .then(() => setInputDisabled(false))
  }

  return (
    <View>
      {
        !hasContinued &&
        <View style={styles.container}>
          <TouchableNativeFeedback onPress={() => inputDisabled ? {} : handleClick()}>
            <View style={[styles.choice, inputDisabled && styles.loading]}>
              <Text style={styles.text}>{ inputDisabled ? <ActivityIndicator size='small' color="#1D79AC" /> : 'Continue Story'}</Text>
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
  loading: {
    backgroundColor: '#777',
  }
});
