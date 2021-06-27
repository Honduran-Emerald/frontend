import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { sha512 } from 'js-sha512';
import i18n from 'i18n-js';

import { Colors } from '../styles';
import { EMAILREGEX } from '../../GLOBALCONFIG';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import { setToken } from '../redux/authentication/authenticationSlice';
import { loginRequest } from '../utils/requestHandler';
import { saveItemLocally } from '../utils/SecureStore';
import { authTranslations } from './translations';

export default function LoginScreen({ navigation }: any) {

  i18n.translations = authTranslations;

  const dispatch = useAppDispatch();
  const tokenInvalid = useAppSelector((state) => state.authentication.tokenInvalid);

  // TODO remove default mail and pw
  const [email, setEmail] = React.useState('t3st@test.de');
  const [password, setPassword] = React.useState('test');
  const [errorEmail, setErrorEmail] = React.useState(false);
  const [errorPassword, setErrorPassword] = React.useState(false);
  const [errorFetch, setErrorFetch] = React.useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  const updateEmail = (input: string) => {
    setEmail(input.replace(/\s/g, ""));
    setErrorEmail(false);
  };

  const updatePassword = (input: string) => {
    setPassword(input.replace(/\s/g, ""));
    setErrorPassword(false);
  };

  const resetError = () => {
    setErrorFetch(false);
    setErrorEmail(false);
    setErrorPassword(false);
  }

  const handleLogin = () => {

    // prevent API call spamming
    setIsButtonDisabled(true);

    resetError();

    let invalidField = false;

    if(email.length === 0 || !EMAILREGEX.test(email)) {
      setErrorEmail(true);
      invalidField = true;
    } if(password.length === 0) {
      setErrorPassword(true);
      invalidField = true;
    }

    if(invalidField) {
      setIsButtonDisabled(false);
      return;
    }

    loginRequest(email, sha512(password))
      .then((response) => {
        if(response.ok) {
          response.json().then((data) => {
            saveItemLocally('UserToken', data.token).then((() => {}), (() => {}));
            dispatch(setToken(data.token));
          })
        } else if(response.status === 400) {
          setErrorFetch(true);
        } else {
          //TODO handle server error
          alert(`server error ${response.status}, contact nico kunz`)
        }
        setIsButtonDisabled(false);
      })
  };

  const handleRegister = () => {
    navigation.navigate('Register');
    resetError();
  };

  const handleForgotPW = () => {
    navigation.navigate('ForgotPW');
    resetError();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t('appName')}</Text>
      <View>
        {
          tokenInvalid &&
          <Text style={styles.errorText}>{i18n.t('invalidSession')}</Text>
        }
      </View>
      <TextInput
        style={{...styles.input, borderColor: errorEmail ? Colors.error : Colors.black}}
        onChangeText={(input) => updateEmail(input)}
        value={email}
        placeholder={'Email'}
        keyboardType={'email-address'}
        returnKeyType={'next'}
        autoCorrect={false}
      />
      <View>
        {
          errorEmail &&
          <Text style={styles.errorText}>{i18n.t('errorEmailMessage')}</Text>
        }
      </View>
      <TextInput
        style={{...styles.input, borderColor: errorPassword ? Colors.error : Colors.black}}
        onChangeText={(input) => updatePassword(input)}
        value={password}
        placeholder={'Password'}
        returnKeyType={'done'}
        autoCorrect={false}
        secureTextEntry={true}
        onSubmitEditing={handleLogin}
      />
      <View>
        {
          errorPassword &&
          <Text style={styles.errorText}>{i18n.t('errorPasswordMessage')}</Text>
        }
      </View>
      <View>
        {
          errorFetch &&
          <Text style={styles.errorText}>{i18n.t('errorFetchMessage')}</Text>
        }
      </View>
      <View style={styles.forgotPW}>
        <Text onPress={handleForgotPW} style={{color: Colors.primary}}>{i18n.t('forgotPassword')}</Text>
      </View>
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button color={Colors.primary} disabled={isButtonDisabled} title={i18n.t('loginButton')} onPress={handleLogin}/>
        </View>
        <View style={styles.button}>
          <Button color={Colors.primaryLight} disabled={isButtonDisabled} title={i18n.t('createAccountButton')} onPress={handleRegister}/>
        </View>
      </View>
      <StatusBar style={'auto'}/>
    </View>
  );
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
  input: {
    height: 40,
    width: '80%',
    margin: 14,
    borderWidth: 2,
    paddingLeft: 6,
  },
  forgotPW: {
    marginTop: -5,
    width: '80%',
    alignItems: 'flex-end',
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
