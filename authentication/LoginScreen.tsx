import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { BACKENDIP, EMAILREGEX } from '../GLOBALCONFIG';
import { TokenContext } from '../context/TokenContext';

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export default function LoginScreen({ navigation }: any) {

  const {token , updateToken} = React.useContext(TokenContext);

  // TODO remove default mail and pw
  const [email, setEmail] = React.useState('test@test.de');
  const [password, setPassword] = React.useState('T3st*2');
  const [error, setError] = React.useState(false);
  const [errorEmail, setErrorEmail] = React.useState(false);
  const [errorPassword, setErrorPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('Email or password incorrect');
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  const updateEmail = (input: string) => {
    setEmail(input.replace(/\s/g, ""));
  };

  const updatePassword = (input: string) => {
    setPassword(input.replace(/\s/g, ""));
  };

  const resetError = () => {
    setError(false);
    setErrorEmail(false);
    setErrorPassword(false);
  }

  const handleLogin = () => {

    // prevent API call spamming
    setIsButtonDisabled(true);

    resetError();

    let invalidField = false;

    if(email.length === 0 || !EMAILREGEX.test(email)) {
      setErrorMessage('Enter a valid email');
      setError(true);
      setErrorEmail(true);
      setIsButtonDisabled(false);
      invalidField = true;
    } if(password.length === 0) {
      setErrorMessage(invalidField ? 'Enter your credentials' : 'Enter a password');
      setError(true);
      setErrorPassword(true);
      setIsButtonDisabled(false);
      invalidField = true;
    }

    if(!invalidField) {
      setErrorMessage('Email or password incorrect');
    } else {
      return;
    }

    let formData = new FormData();
    formData.append('Email', email);
    formData.append('Password', password);

    const requestOptions = {
      method: 'POST',
      body: formData,
    };

    fetch(`${BACKENDIP}/auth/login`, requestOptions)
      .then((res) =>
        res.text().then(data => {
          if (res.status !== 200) {
            setError(true);
            setErrorEmail(true);
            setErrorPassword(true);
          } else {
            // TODO remove alerts
            save('UserToken', data).then((() => alert('Saved login')), (() => alert('Can\'t save login on this device')));
            updateToken(data);
            navigation.navigate('MainApp');
          }
          setIsButtonDisabled(false);
        })
      )
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
        style={{...styles.input, borderColor: errorEmail ? '#d32f2f' : '#111111'}}
        onChangeText={(input) => updateEmail(input)}
        value={email}
        placeholder={'Email'}
        keyboardType={'email-address'}
        returnKeyType={'next'}
        autoCorrect={false}
      />
      <TextInput
        style={{...styles.input, borderColor: errorPassword ? '#d32f2f' : '#111111'}}
        onChangeText={(input) => updatePassword(input)}
        value={password}
        placeholder={'Password'}
        returnKeyType={'done'}
        autoCorrect={false}
        secureTextEntry={true}
        onSubmitEditing={handleLogin}
      />
      <View style={styles.forgotPW}>
        <Text onPress={handleForgotPW} style={{color: '#1D79AC'}}>Forgot Password?</Text>
      </View>
      <View style={styles.spacer}>
        {
          error &&
          <Text style={styles.errorText}>{errorMessage}</Text>
        }
        {
          !error &&
          <Text style={styles.hiddenText}>{errorMessage}</Text>
        }
      </View>
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button color={'#1D79AC'} disabled={isButtonDisabled} title={'Login'} onPress={handleLogin}/>
        </View>
        <View style={styles.button}>
          <Button color={'#41A8DF'} disabled={isButtonDisabled} title={'Create new account'} onPress={handleRegister}/>
        </View>
      </View>
      <StatusBar style={'auto'}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    marginTop: -10,
    width: '80%',
    alignItems: 'flex-end',
  },
  spacer: {
    margin: 14,
  },
  errorText: {
    marginTop: -10,
    color: '#d32f2f',
  },
  hiddenText: {
    marginTop: -10,
    opacity: 0,
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
