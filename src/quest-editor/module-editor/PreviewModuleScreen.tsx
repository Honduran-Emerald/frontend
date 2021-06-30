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
  <View style={{padding: 20, paddingBottom: 40, width: displayWidth}} >
                    
    <ScrollView 
      style={{marginBottom: 20}}>

      <View style={{borderWidth: 1, borderRadius: 20, padding: 10, marginVertical: 20, backgroundColor: Colors.background, elevation: 3}}>
        {/* 
        //@ts-ignore */}
        <ModuleRenderer module={{ module: prototypeModule, memento: 0 }} onChoice={(choiceId) => 
          (new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(0);
            }, 1000)
          }))
          } index={0}/>
      </View>

      
    </ScrollView>
    <Button 
        mode='contained' 
        onPress={saveModule}
        theme={{colors: {primary: Colors.primary}}}>
        Save Module
    </Button>
  </View>
)