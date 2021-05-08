import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function LoginScreen({ navigation }: any) {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(false);

  const handleLogin = () => {
    //TODO
    setError(true);
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
        style={{...styles.input, borderColor: error ? '#d32f2f' : '#111111'}}
        onChangeText={setEmail}
        value={email}
        placeholder={'Email'}
        returnKeyType={'next'}
        autoCorrect={false}
      />
      <TextInput
        style={{...styles.input, borderColor: error ? '#d32f2f' : '#111111'}}
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
          <Text style={styles.errorText}>Email or password incorrect</Text>
        }
        {
          !error &&
          <Text style={styles.hiddenText}>Email or password incorrect</Text>
        }
      </View>
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button color={'#1D79AC'} title={'Login'} onPress={handleLogin}/>
        </View>
        <View style={styles.button}>
          <Button color={'#41A8DF'} title={'Create new account'} onPress={handleRegister}/>
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
