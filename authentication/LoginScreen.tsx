import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SecureStore from "expo-secure-store";

export const backendIP = 'https://emerald.astrogd.cloud'

const emailRegex = new RegExp('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])')

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

//TODO move to loading screen class to check cached token
async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

export default function LoginScreen({ navigation }: any) {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(false);
  const [errorEmail, setErrorEmail] = React.useState(false);
  const [errorPassword, setErrorPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('Email or password incorrect');
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);
  //TODO remove token hook, add prop again, remove rendering of token, how to retrieve token from response
  const [token, setToken] = React.useState('No token');


  const handleLogin = () => {

    setIsButtonDisabled(true);

    setError(false); setErrorEmail(false); setErrorPassword(false);

    if(email.length === 0 || !emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email');
      setError(true);
      setErrorEmail(true);
      setIsButtonDisabled(false);
      return;
    } else if(password.length === 0) {
      setErrorMessage('Please enter a password');
      setError(true);
      setErrorPassword(true);
      setIsButtonDisabled(false);
      return;
    } else {
      setErrorMessage('Email or password incorrect');
    }

    let formData = new FormData();
    formData.append('Email', email);
    formData.append('Password', password);

    const requestOptions = {
      method: 'POST',
      body: formData,
    };

    fetch(`${backendIP}/auth/login`, requestOptions)
      .then((res) =>
        res.json().then(data => {
          if (res.status !== 200) {
            setToken(`${res.status}`);
            setError(true);
            setErrorEmail(true);
            setErrorPassword(true);
          } else {
            save('UserToken', data);
            setToken(data);
          }
          setIsButtonDisabled(false);
        })
      )
  };

  const handleRegister = () => {
    navigation.navigate('Register');
    setError(false);
  };

  const handleForgotPW = () => {
    navigation.navigate('ForgotPW');
    setError(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>HONDURAN EMERALD</Text>
      <TextInput
        style={{...styles.input, borderColor: errorEmail ? '#d32f2f' : '#111111'}}
        onChangeText={setEmail}
        value={email}
        placeholder={'Email'}
        keyboardType={'email-address'}
        returnKeyType={'next'}
        autoCorrect={false}
      />
      <TextInput
        style={{...styles.input, borderColor: errorPassword ? '#d32f2f' : '#111111'}}
        onChangeText={setPassword}
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
      <Text>{token}</Text>
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
