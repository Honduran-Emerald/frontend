import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { sha512 } from 'js-sha512';

import { BACKENDIP, EMAILREGEX } from '../../GLOBALCONFIG';
import { TokenContext } from '../context/TokenContext';

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

const colors = {
  primary: '#1D79AC',
  secondary: '#41A8DF',
  error: '#d32f2f',
  black: '#111111',
  white: '#fff',
}

const english = {
  forgotPassword: 'Forgot Password?',
  loginButton: 'Login',
  createAccountButton: 'Create new account',
  emailPlaceholder: 'Email',
  passwordPlaceholder: 'Password',
  errorEmailMessage: 'Enter a valid email',
  errorPasswordMessage: 'Enter a password',
  errorFetchMessage: 'Email or password incorrect',
}

export default function LoginScreen({ navigation }: any) {

  const {token , updateToken} = React.useContext(TokenContext);

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

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: sha512(password),
      }),
    };

    fetch(`${BACKENDIP}/auth/login`, requestOptions)
      .then((response) => {
        if(response.ok) {
          response.json().then((data) => {
            save('UserToken', data.token).then((() => {}), (() => {}));
            updateToken(data.token);
            navigation.navigate('MainApp');
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
      <Text style={styles.header}>HONDURAN EMERALD</Text>
      <TextInput
        style={{...styles.input, borderColor: errorEmail ? colors.error : colors.black}}
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
          <Text style={styles.errorText}>{english.errorEmailMessage}</Text>
        }
      </View>
      <TextInput
        style={{...styles.input, borderColor: errorPassword ? colors.error : colors.black}}
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
          <Text style={styles.errorText}>{english.errorPasswordMessage}</Text>
        }
      </View>
      <View>
        {
          errorFetch &&
          <Text style={styles.errorText}>{english.errorFetchMessage}</Text>
        }
      </View>
      <View style={styles.forgotPW}>
        <Text onPress={handleForgotPW} style={{color: colors.primary}}>{english.forgotPassword}</Text>
      </View>
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button color={colors.primary} disabled={isButtonDisabled} title={english.loginButton} onPress={handleLogin}/>
        </View>
        <View style={styles.button}>
          <Button color={colors.secondary} disabled={isButtonDisabled} title={english.createAccountButton} onPress={handleRegister}/>
        </View>
      </View>
      <StatusBar style={'auto'}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    color: colors.error,
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
