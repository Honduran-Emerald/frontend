import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Dimensions, View } from 'react-native';
import { Button } from 'react-native-paper';
import { Colors } from '../../styles';
import { PrototypeModule } from '../../types/quest';

const displayWidth = Dimensions.get('screen').width

interface IPreviewModuleScreen {
  prototypeModule: PrototypeModule,
  saveModule: () => void
}

export const PreviewModuleScreen: React.FC<IPreviewModuleScreen> = ({ prototypeModule, saveModule }) => (
  <View style={{flex: 1, padding: 20, width: displayWidth}} >
                    
    <ScrollView 
      style={{height: '100%'}}
      contentContainerStyle={{justifyContent: 'space-between', }}>
      <Text>
        {JSON.stringify(prototypeModule)}
      </Text>

      <Button 
        mode='contained' 
        onPress={saveModule}
        theme={{colors: {primary: Colors.primary}}}>
        Save Module
      </Button>
    </ScrollView>
  </View>
)