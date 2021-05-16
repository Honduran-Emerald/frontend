import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { sha512 } from 'js-sha512';

import { BACKENDIP, EMAILREGEX } from '../GLOBALCONFIG';
import { TokenContext } from '../context/TokenContext';

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export default function RegisterScreen({ navigation }: any) {

  const {token , updateToken} = React.useContext(TokenContext);

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(false);
  const [errorName, setErrorName] = React.useState(false);
  const [errorEmail, setErrorEmail] = React.useState(false);
  const [errorPassword, setErrorPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('Username or email already used');
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  const updateUsername = (input: string) => {
    setUsername(input.replace(/\s/g, ""));
  };

  const updateEmail = (input: string) => {
    setEmail(input.replace(/\s/g, ""));
  };

  const updatePassword = (input: string) => {
    setPassword(input.replace(/\s/g, ""));
  };

  const handleRegister = () => {

    // prevent API call spamming
    setIsButtonDisabled(true);

    // reset error hooks
    setError(false);
    setErrorName(false);
    setErrorEmail(false);
    setErrorPassword(false);

    let invalidField = false;

    if(username.length === 0) {
      setErrorMessage('Please enter a username');
      setError(true);
      setErrorName(true);
      setIsButtonDisabled(false);
      invalidField = true;
    } if(email.length === 0 || !EMAILREGEX.test(email)) {
      setErrorMessage(invalidField ? 'Enter your new credentials' : 'Enter a valid email');
      setError(true);
      setErrorEmail(true);
      setIsButtonDisabled(false);
      invalidField = true;
    } if(password.length === 0) {
      setErrorMessage(invalidField ? 'Enter your new credentials' : 'Enter a password');
      setError(true);
      setErrorPassword(true);
      setIsButtonDisabled(false);
      invalidField = true;
    }

    if(!invalidField) {
      setErrorMessage('Username or email already used');
    } else {
      return;
    }

    let formData = new FormData();
    formData.append('Username', username);
    formData.append('Email', email);
    formData.append('Password', sha512(password));

    const requestOptions = {
      method: 'POST',
      body: formData,
    };

    fetch(`${BACKENDIP}/auth/create`, requestOptions)
      .then((res) =>
        res.text().then(data => {
          if (res.status !== 200) {
            setError(true);
            // TODO reenable feedback (needs .json())
            //data.Code === 'DuplicateUserName' ? setErrorName(true) : setErrorEmail(true);
            //setErrorMessage(data.Code === 'DuplicateUserName' ? 'Username already used' : 'Email already used');
          } else {
            save('UserToken', data).then((() => alert('Saved login')), (() => alert('Can\'t save login on this device')));
            updateToken(data);
            navigation.navigate('MainApp');
          }
          setIsButtonDisabled(false);
        })
      )
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>HONDURAN EMERALD</Text>
      <TextInput
        style={{...styles.input, borderColor: errorName ? '#d32f2f' : '#111111'}}
        onChangeText={(input) => updateUsername(input)}
        value={username}
        placeholder={'Username'}
        returnKeyType={'next'}
        autoCorrect={false}
      />
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
        onSubmitEditing={handleRegister}
      />
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
          <Button color={'#1D79AC'} disabled={isButtonDisabled} title={'Create account'} onPress={handleRegister}/>
        </View>
        <View style={styles.button}>
          <Button color={'#41A8DF'} disabled={isButtonDisabled} title={'Back'} onPress={() => {navigation.navigate('Login')}}/>
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
