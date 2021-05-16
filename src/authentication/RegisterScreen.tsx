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
  createAccountButton: 'Create account',
  backButton: 'Back',
  usernamePlaceholder: 'Username',
  emailPlaceholder: 'Email',
  passwordPlaceholder: 'Password',
  password2Placeholder: 'Confirm password',
  errorNameMessage: 'Enter a username',
  errorEmailMessage: 'Enter a valid email',
  errorPasswordMessage: 'Enter a password',
  errorPasswordMessage2: 'Passwords don\'t match',
  errorFetchMessageName: 'Username already used',
  errorFetchMessageEmail: 'Email already used',
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
  const [errorFetchReasonName, setErrorFetchReasonName] = React.useState(false);
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
      invalidField = true;
    } if(email.length === 0 || !EMAILREGEX.test(email)) {
      setErrorEmail(true);
      invalidField = true;
    } if(password.length === 0) {
      setErrorPassword(true);
      invalidField = true;
    } if(password !== password2) {
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
        username: username,
        email: email,
        password: sha512(password),
      }),
    };

    fetch(`${BACKENDIP}/auth/create`, requestOptions)
      .then((response) => {
        if(response.ok) {
          response.json().then((data) => {
            save('UserToken', data.token).then((() => {}), (() => {}));
            updateToken(data.token);
            navigation.navigate('MainApp');
          })
        } else if(response.status === 400) {
          response.json().then((data) => {
            setErrorFetch(true);
            data.message.code === 'DuplicateUserName' ? setErrorFetchReasonName(true) : setErrorFetchReasonName(false);
          })
        } else {
          //TODO handle server error
          alert(`server error ${response.status}, contact nico kunz`)
        }
        setIsButtonDisabled(false);
      })

  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>HONDURAN EMERALD</Text>
      <TextInput
        style={{...styles.input, borderColor: errorName ? colors.error : colors.black}}
        onChangeText={(input) => updateUsername(input)}
        value={username}
        placeholder={english.usernamePlaceholder}
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
        style={{...styles.input, borderColor: errorEmail ? colors.error : colors.black}}
        onChangeText={(input) => updateEmail(input)}
        value={email}
        placeholder={english.emailPlaceholder}
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
        placeholder={english.passwordPlaceholder}
        returnKeyType={'done'}
        autoCorrect={false}
        secureTextEntry={true}
        onSubmitEditing={handleRegister}
      />
      <TextInput
        style={{...styles.confirmPassword, borderColor: errorPassword ? colors.error : colors.black}}
        onChangeText={(input) => updatePassword2(input)}
        value={password2}
        placeholder={english.password2Placeholder}
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
      <View>
        {
          errorFetch &&
          <Text style={styles.errorText}>{errorFetchReasonName ? english.errorFetchMessageName: english.errorFetchMessageEmail}</Text>
        }
      </View>
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button color={colors.primary} disabled={isButtonDisabled} title={english.createAccountButton} onPress={handleRegister}/>
        </View>
        <View style={styles.button}>
          <Button color={colors.secondary} disabled={isButtonDisabled} title={english.backButton} onPress={() => {navigation.navigate('Login')}}/>
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
  confirmPassword: {
    height: 40,
    width: '80%',
    margin: 14,
    marginTop: 0,
    borderWidth: 2,
    paddingLeft: 6,
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
