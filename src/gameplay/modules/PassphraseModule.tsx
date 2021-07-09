import React from 'react';
import { StyleSheet, TouchableNativeFeedback, View, Text, TextInput } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { GameplayPassphraseModule, GameplayStoryModule } from '../../types/quest';

import { ModuleRendererProps } from '../ModuleRenderer';
import { Colors } from '../../styles';

export const PassphraseModule: React.FC<ModuleRendererProps<GameplayPassphraseModule>> = ({ module, onPassphrase }) => {

  const [hasContinued, setHasContinued] = React.useState(!!module.memento);
  const [inputDisabled, setInputDisabled] = React.useState(false);
  const [incorrectPassphrase, setIncorrectPassphrase] = React.useState(false);
  const [value, setValue] = React.useState('');

  const handleClick = (value: string) => {
    setInputDisabled(true);
    onPassphrase(value)
      .then(() => setHasContinued(true))
      .catch(() => {
        // TODO: Add handling of different rejections here
        setIncorrectPassphrase(true);
        setValue('')
      })
      .then(() => setInputDisabled(false))
  }

  return (
    <View>
      {
        !hasContinued &&
        <View style={styles.container}>
          <View style={[{backgroundColor: Colors.primaryLight}, inputDisabled && styles.loading, ]}>
          <TextInput 
            style={styles.passphrase} 
            placeholder={incorrectPassphrase ? 'Incorrect Passphrase' : 'Passphrase'} 
            value={value} 
            onChangeText={t => {setValue(t); setIncorrectPassphrase(false)}} 
            placeholderTextColor={incorrectPassphrase ? 'red' : '#777'}/>  
          <TouchableNativeFeedback onPress={() => inputDisabled ? {} : handleClick(value)}>

            <View style={styles.choice}>
              
              <Text style={styles.text}>{ inputDisabled ? <ActivityIndicator size='small' color="#fff" /> : 'Submit Passphrase'}</Text>
            </View>
          </TouchableNativeFeedback>
          </View>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 30,
  },
  choice: {
    //backgroundColor: Colors.primaryLight,
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
  },
  passphrase: {
    backgroundColor: Colors.gray,
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
    marginTop: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,

  }
});
