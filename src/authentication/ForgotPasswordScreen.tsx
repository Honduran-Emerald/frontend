import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput as TextInputNative, Button, Image } from 'react-native';
import i18n from 'i18n-js';

import { Colors, Containers } from '../styles';
import { EMAILREGEX } from '../../GLOBALCONFIG';
import { authTranslations } from './translations';

export default function ForgotPasswordScreen({ navigation }: any) {

  i18n.translations = authTranslations;

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
      <Image source={require('../../assets/splash.png')} style={{width: '100%', height: 450, marginBottom: -250}}/>
      <Text style={styles.text}>{i18n.t('forgotPasswordText')}</Text>
      <View style={styles.smallInputs}>
        <TextInputNative
          onChangeText={(input) => updateEmail(input)}
          value={email}
          placeholder={'Email'}
          keyboardType={'email-address'}
          returnKeyType={'done'}
          autoCorrect={false}
          onSubmitEditing={handleEmailSubmit}
        />
      </View>
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
    width: '72%',
  },
  smallInputs: {
    ...Containers.rounded,
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 50,
    fontSize: 15,
    paddingLeft: 15,
    backgroundColor: Colors.lightGray,
    marginVertical: 10,
  },
  input: {
    height: 40,
    width: '80%',
    margin: 14,
    borderWidth: 2,
    paddingLeft: 6,
  },
  errorText: {
    marginTop: -5,
    margin: 10,
    color: Colors.error,
  },
  buttons: {
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 50,
  },
  button: {
    width: '50%',
    margin: 6,
  },
});
