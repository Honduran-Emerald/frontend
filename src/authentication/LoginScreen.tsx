import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput as TextInputNative, ScrollView } from 'react-native';
import { sha512 } from 'js-sha512';
import i18n from 'i18n-js';

import { Colors, Containers } from '../styles';
import { EMAILREGEX } from '../../GLOBALCONFIG';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
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
    <ScrollView style={styles.container} contentContainerStyle={{alignItems: 'center',}}>
      <Image source={require('../../assets/splash.png')} style={{width: '100%', height: 450, marginTop: 125, marginBottom: -250}}/>
      <View>
        {
          tokenInvalid &&
          <Text style={styles.errorText}>{i18n.t('invalidSession')}</Text>
        }
      </View>
      <View style={styles.smallInputs}>
        <TextInputNative
          onChangeText={(input) => updateEmail(input)}
          value={email}
          placeholder={'Email'}
          keyboardType={'email-address'}
          returnKeyType={'next'}
          autoCorrect={false}
          style={{marginHorizontal: 5, flex: 1}}
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
          placeholder={'Password'}
          returnKeyType={'done'}
          autoCorrect={false}
          secureTextEntry={true}
          onSubmitEditing={handleLogin}
        />
      </View>
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
      {
        /*<View style={styles.forgotPW}>
          <Text onPress={handleForgotPW} style={{color: Colors.primary}}>{i18n.t('forgotPassword')}</Text>
        </View>*/
      }
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button color={Colors.primary} disabled={isButtonDisabled} title={i18n.t('loginButton')} onPress={handleLogin}/>
        </View>
        <View style={styles.button}>
          <Button color={Colors.primaryLight} disabled={isButtonDisabled} title={i18n.t('createAccountButton')} onPress={handleRegister}/>
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
  forgotPW: {
    marginTop: -5,
    margin: 10,
    width: '80%',
    alignItems: 'flex-end',
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
