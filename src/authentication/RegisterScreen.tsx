import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput as TextInputNative, ScrollView } from 'react-native';
import { sha512 } from 'js-sha512';
import i18n from 'i18n-js';

import { Colors, Containers } from '../styles';
import { EMAILREGEX } from '../../GLOBALCONFIG';
import { useAppDispatch } from '../redux/hooks';
import { setToken } from '../redux/authentication/authenticationSlice';
import { registerRequest } from '../utils/requestHandler';
import { saveItemLocally } from '../utils/SecureStore';
import { authTranslations } from './translations';


export default function RegisterScreen({ navigation }: any) {

  i18n.translations = authTranslations;

  const dispatch = useAppDispatch();

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

    registerRequest(username, email, sha512(password))
      .then((response) => {
        if(response.ok) {
          response.json().then((data) => {
            saveItemLocally('UserToken', data.token).then((() => {}), (() => {}));
            dispatch(setToken(data.token))
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
    <ScrollView style={styles.container} contentContainerStyle={{alignItems: 'center',}}>
      <Image source={require('../../assets/splash.png')} style={{width: '100%', height: 450, marginTop: 80, marginBottom: -250}}/>
      <View style={styles.smallInputs}>
        <TextInputNative
          style={{marginHorizontal: 5, flex: 1}}
          onChangeText={(input) => updateUsername(input)}
          value={username}
          placeholder={i18n.t('usernamePlaceholder')}
          returnKeyType={'next'}
          autoCorrect={false}
        />
      </View>
      <View>
        {
          errorName &&
          <Text style={styles.errorText}>{i18n.t('errorNameMessage')}</Text>
        }
      </View>
      <View style={styles.smallInputs}>
        <TextInputNative
          style={{marginHorizontal: 5, flex: 1}}
          onChangeText={(input) => updateEmail(input)}
          value={email}
          placeholder={i18n.t('emailPlaceholder')}
          keyboardType={'email-address'}
          returnKeyType={'next'}
          autoCorrect={false}
        />
      </View>
      <View>
        {
          errorEmail &&
          <Text style={styles.errorText}>{i18n.t('errorEmailMessage')}</Text>
        }
      </View>
      <View style={styles.smallInputs}>
        <TextInputNative
          style={{marginHorizontal: 5, flex: 1}}
          onChangeText={(input) => updatePassword(input)}
          value={password}
          placeholder={i18n.t('passwordPlaceholder')}
          returnKeyType={'done'}
          autoCorrect={false}
          secureTextEntry={true}
          onSubmitEditing={handleRegister}
        />
      </View>
      <View style={styles.smallInputs}>
        <TextInputNative
          style={{marginHorizontal: 5, flex: 1}}
          onChangeText={(input) => updatePassword2(input)}
          value={password2}
          placeholder={i18n.t('password2Placeholder')}
          returnKeyType={'done'}
          autoCorrect={false}
          secureTextEntry={true}
          onSubmitEditing={handleRegister}
        />
      </View>
      <View>
        {
          errorPassword &&
          <Text style={styles.errorText}>{password !== password2 ? i18n.t('errorPasswordMessage2') : i18n.t('errorPasswordMessage')}</Text>
        }
      </View>
      <View>
        {
          errorFetch &&
          <Text style={styles.errorText}>{errorFetchReasonName ? i18n.t('errorFetchMessageName'): i18n.t('errorFetchMessageEmail')}</Text>
        }
      </View>
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button color={Colors.primary} disabled={isButtonDisabled} title={i18n.t('createAccountConfirm')} onPress={handleRegister}/>
        </View>
        <View style={styles.button}>
          <Button color={Colors.primaryLight} disabled={isButtonDisabled} title={i18n.t('backButton')} onPress={() => {navigation.navigate('Login')}}/>
        </View>
      </View>
      <StatusBar style={'auto'}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    fontSize: 25,
    margin: 24,
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
  confirmPassword: {
    height: 40,
    width: '80%',
    margin: 14,
    marginTop: 0,
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
