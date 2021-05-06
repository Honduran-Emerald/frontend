import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function RegisterScreen({ navigation }: any) {

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(false);

  const handleRegister = () => {
    //TODO
    setError(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>HONDURAN EMERALD</Text>
      <TextInput
        style={{...styles.input, borderColor: error ? '#d32f2f' : '#111111'}}
        onChangeText={setUsername}
        value={username}
        placeholder={'Username'}
        returnKeyType={'next'}
        autoCorrect={false}
      />
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
        onSubmitEditing={handleRegister}
      />
      <View style={styles.spacer}>
        {
          error &&
          <Text style={styles.errorText}>Username or email already used</Text>
        }
        {
          !error &&
          <Text style={styles.hiddenText}>Username or email already used</Text>
        }
      </View>
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button color={'#1D79AC'} title={'Create account'} onPress={handleRegister}/>
        </View>
        <View style={styles.button}>
          <Button color={'#41A8DF'} title={'Back'} onPress={() => {navigation.navigate('Login')}}/>
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
