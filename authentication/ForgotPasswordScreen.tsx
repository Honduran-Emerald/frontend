import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function ForgotPasswordScreen({ navigation }: any) {

  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState(false);

  const handleEmailSubmit = () => {
    //TODO fetch to get password reset email
    setError(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>HONDURAN EMERALD</Text>
      <Text style={styles.text}>Enter the email address associated with your account to get instructions on how to reset the password.</Text>
      <TextInput
        style={{...styles.input, borderColor: error ? '#d32f2f' : '#111111'}}
        onChangeText={setEmail}
        value={email}
        placeholder={'Email'}
        returnKeyType={'done'}
        autoCorrect={false}
        onSubmitEditing={handleEmailSubmit}
      />
      <View style={styles.spacer}>
        {
          error &&
          <Text style={styles.errorText}>No existing account with that email found</Text>
        }
        {
          !error &&
          <Text style={styles.hiddenText}>No existing account with that email found</Text>
        }
      </View>
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button color={'#1D79AC'} title={'Send reset email'} onPress={handleEmailSubmit}/>
        </View>
        <View style={styles.button}>
          <Button color={'#41A8DF'} title={'Back'} onPress={() => {navigation.navigate('Login')}}/>
        </View>
      </View>
      <StatusBar style={'auto'}/>
    </View>
  )
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
  text: {
    fontSize: 15,
    width: '80%',
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
