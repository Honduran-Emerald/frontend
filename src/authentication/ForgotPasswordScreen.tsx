import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import i18n from 'i18n-js';
import './translations';

import { Colors } from '../styles';
import { EMAILREGEX } from '../../GLOBALCONFIG';

export default function ForgotPasswordScreen({ navigation }: any) {

  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState(false);
  const [errorFetch, setErrorFetch] = React.useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  const updateEmail = (input: string) => {
    setEmail(input.replace(/\s/g, ""));
    setError(false);
  };

  const handleEmailSubmit = () => {

    setIsButtonDisabled(true);

    setError(false);
    setErrorFetch(false);

    if(email.length === 0 || !EMAILREGEX.test(email)) {
      setError(true);
      setIsButtonDisabled(false);
      return;
    }

    //TODO fetch to get password reset email
    setError(true);
    setErrorFetch(true);

    setIsButtonDisabled(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t('appName')}</Text>
      <Text style={styles.text}>{i18n.t('forgotPasswordText')}</Text>
      <TextInput
        style={{...styles.input, borderColor: error ? Colors.error : Colors.black}}
        onChangeText={(input) => updateEmail(input)}
        value={email}
        placeholder={'Email'}
        keyboardType={'email-address'}
        returnKeyType={'done'}
        autoCorrect={false}
        onSubmitEditing={handleEmailSubmit}
      />
      <View>
        {
          error &&
          <Text style={styles.errorText}>{errorFetch ? i18n.t('errorFetchEmailForgotPW') : i18n.t('errorEmailMessage')}</Text>
        }
      </View>
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button color={Colors.primary} disabled={isButtonDisabled} title={i18n.t('sendResetEmail')} onPress={handleEmailSubmit}/>
        </View>
        <View style={styles.button}>
          <Button color={Colors.primaryLight} disabled={isButtonDisabled} title={i18n.t('backButton')} onPress={() => {navigation.navigate('Login')}}/>
        </View>
      </View>
      <StatusBar style={'auto'}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 25,
    margin: 24,
  },
  text: {
    fontSize: 15,
    width: '80%',
  },
  input: {
    height: 40,
    width: '80%',
    margin: 14,
    borderWidth: 2,
    paddingLeft: 6,
  },
  errorText: {
    marginTop: -12,
    color: Colors.error,
  },
  buttons: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    width: '50%',
    margin: 6,
  },
});
