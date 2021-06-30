import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Dimensions, View } from 'react-native';
import { Button } from 'react-native-paper';
import { ModuleRenderer } from '../../gameplay/ModuleRenderer';
import { Colors } from '../../styles';
import { PrototypeModule } from '../../types/prototypes';
import { GameplayModule } from '../../types/quest';

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
      <View style={{borderWidth: 1, borderRadius: 20, padding: 10, marginVertical: 10, backgroundColor: Colors.background, elevation: 3}}>
        <ModuleRenderer module={{ module: prototypeModule, memento: 0 }} onChoice={(choiceId) => 
          (new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(0);
            }, 1000)
          }))
          }/>
      </View>

      <Button 
        mode='contained' 
        onPress={saveModule}
        theme={{colors: {primary: Colors.primary}}}>
        Save Module
      </Button>
    </ScrollView>
  </View>
)