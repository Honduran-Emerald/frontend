import React from 'react';
import { StyleSheet, TouchableNativeFeedback, View, Text, TextInput, Vibration } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { GameplayPassphraseModule, GameplayQRModule, GameplayStoryModule } from '../../types/quest';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { ModuleRendererProps } from '../ModuleRenderer';
import { Colors } from '../../styles';

export const QRModule: React.FC<ModuleRendererProps<GameplayQRModule>> = ({ module, onPassphrase }) => {

  const [hasContinued, setHasContinued] = React.useState(!!module.memento);
  const [inputDisabled, setInputDisabled] = React.useState(false);
  const [incorrectCode, setIncorrectCode] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);
  const [scanned, setScanned] = React.useState<boolean>(false);

  const handleClick = (code: string) => {
    setInputDisabled(true);
    onPassphrase(code)
      .then(() => setHasContinued(true))
      .catch(() => {
        setIncorrectCode(true);
        Vibration.vibrate([0, 250])
        setValue('')
      })
      .then(() => setInputDisabled(false))
  }

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  return (
    <View>
      {
        !hasContinued &&
        <View style={styles.container}>
          <View style={{backgroundColor: Colors.primary, borderRadius: 10, overflow: 'hidden', width: '100%', height: 450, padding: 10, justifyContent: 'center'}}>
            {inputDisabled ? <ActivityIndicator size='small' color="#fff" /> : <View style={{borderRadius: 10}}>
              <BarCodeScanner 
                onBarCodeScanned={inputDisabled ? undefined : (e) => {
                  handleClick(e.data)
                  setScanned(true)
                }}
                barCodeTypes={BarCodeScanner.Constants.BarCodeType.qr}
                style={{width: '100%', height:  '100%'}}
                
              />
            </View>}
          </View> 
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 20,
  },
  choice: {
    //backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
    margin: 5,
  },
  text: {
    color: '#fff',
  },
  loading: {
    backgroundColor: '#777',
  },
  passphrase: {
    backgroundColor: Colors.gray,
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
    marginTop: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,

  }
});
