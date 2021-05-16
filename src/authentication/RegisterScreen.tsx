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

const english = {
  errorNameMessage: 'Enter a username',
  errorEmailMessage: 'Enter a valid email',
  errorPasswordMessage: 'Enter a password',
  errorPasswordMessage2: 'Passwords don\'t match',
  errorFetchMessage: 'Username or email already used'
}

export default function RegisterScreen({ navigation }: any) {

  const {token , updateToken} = React.useContext(TokenContext);

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [errorName, setErrorName] = React.useState(false);
  const [errorEmail, setErrorEmail] = React.useState(false);
  const [errorPassword, setErrorPassword] = React.useState(false);
  const [errorFetch, setErrorFetch] = React.useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  const updateUsername = (input: string) => {
    setUsername(input.replace(/\s/g, ""));
    setErrorName(false);
  };

  const updateEmail = (input: string) => {
    setEmail(input.replace(/\s/g, ""));
    setErrorEmail(false);
  };

  const updatePassword = (input: string) => {
    setPassword(input.replace(/\s/g, ""));
    setErrorPassword(false);
  };

  const updatePassword2 = (input: string) => {
    setPassword2(input.replace(/\s/g, ""));
    setErrorPassword(false);
  };

  const handleRegister = () => {

    // prevent API call spamming
    setIsButtonDisabled(true);

    // reset error hooks
    setErrorName(false);
    setErrorEmail(false);
    setErrorPassword(false);
    setErrorFetch(false);

    let invalidField = false;

    if(username.length === 0) {
      setErrorName(true);
      setIsButtonDisabled(false);
      invalidField = true;
    } if(email.length === 0 || !EMAILREGEX.test(email)) {
      setErrorEmail(true);
      setIsButtonDisabled(false);
      invalidField = true;
    } if(password.length === 0) {
      setErrorPassword(true);
      setIsButtonDisabled(false);
      invalidField = true;
    } if(password !== password2) {
      setErrorPassword(true);
      setIsButtonDisabled(false);
      invalidField = true;
    }

    if(invalidField) {
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
            setErrorFetch(true);
            // TODO reenable feedback (needs .json())
            //data.Code === 'DuplicateUserName' ? setErrorName(true) : setErrorEmail(true);
            //setErrorMessage(data.Code === 'DuplicateUserName' ? 'Username already used' : 'Email already used');
          } else {
            save('UserToken', data).then((() => {}), (() => {}));
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
      <View>
        {
          errorName &&
          <Text style={styles.errorText}>{english.errorNameMessage}</Text>
        }
      </View>
      <TextInput
        style={{...styles.input, borderColor: errorEmail ? '#d32f2f' : '#111111'}}
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
        style={{...styles.input, borderColor: errorPassword ? '#d32f2f' : '#111111'}}
        onChangeText={(input) => updatePassword(input)}
        value={password}
        placeholder={'Password'}
        returnKeyType={'done'}
        autoCorrect={false}
        secureTextEntry={true}
        onSubmitEditing={handleRegister}
      />
      <TextInput
        style={{...styles.input, borderColor: errorPassword ? '#d32f2f' : '#111111'}}
        onChangeText={(input) => updatePassword2(input)}
        value={password2}
        placeholder={'Confirm password'}
        returnKeyType={'done'}
        autoCorrect={false}
        secureTextEntry={true}
        onSubmitEditing={handleRegister}
      />
      <View>
        {
          errorPassword &&
          <Text style={styles.errorText}>{password !== password2 ? english.errorPasswordMessage2 : english.errorPasswordMessage}</Text>
        }
      </View>
      <View style={styles.spacer}>
        {
          errorFetch &&
          <Text style={styles.errorText}>{english.errorFetchMessage}</Text>
        }
        {
          !errorFetch &&
          <Text style={styles.hiddenText}>{english.errorFetchMessage}</Text>
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
