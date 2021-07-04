import I18n from 'i18n-js';
import React from 'react';
import { Dimensions, TouchableHighlight, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, TextInput, Text, Divider, Subheading, Button } from 'react-native-paper';
import { Colors } from '../../styles';
import { PrototypeComponent } from '../../types/prototypes';
import { ComponentCreator } from './ComponentCreator';

const displayWidth = Dimensions.get('screen').width;

interface IModuleTypeChoice {
  components: PrototypeComponent[]
  setComponents: React.Dispatch<React.SetStateAction<PrototypeComponent[]>>,
  onConfirm: () => void,
}

export const ComponentCreateScreen: React.FC<IModuleTypeChoice> = ({ components, setComponents, onConfirm }) => (
  <ScrollView 
    style={{width: displayWidth}} 
    contentContainerStyle={{justifyContent: 'center', alignContent: 'center', marginVertical: 40}}>

    <View style={{paddingHorizontal: 20}}>

    <Subheading style={{paddingBottom:20}}>
      Choose text the user will receive when starting this module      
    </Subheading>

    <ComponentCreator 
      components={components}
      setComponents={setComponents}
    />

    <Button 
        theme={{colors: {primary: Colors.primary}}}
        mode='contained'
        style={{marginBottom: 20}}
        onPress={onConfirm}
        >
        {'Choose Module goal'}
    </Button>

    </View>
    
  </ScrollView>
)