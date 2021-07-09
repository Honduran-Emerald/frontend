import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Dimensions, View } from 'react-native';
import { Button } from 'react-native-paper';
import { ModuleRenderer } from '../../gameplay/ModuleRenderer';
import { Colors } from '../../styles';
import { PrototypeComponent, PrototypeModule } from '../../types/prototypes';
import { GameplayComponent, GameplayModule } from '../../types/quest';

const displayWidth = Dimensions.get('screen').width

interface IPreviewModuleScreen {
  prototypeModule: PrototypeModule,
  saveModule: () => void
}


const toGameplayModule = (prototypeModule: PrototypeModule): GameplayModule => 
  ({...prototypeModule, components: prototypeModule.components.map(toGameplayComponent)})


const toGameplayComponent = (prototypeComponent: PrototypeComponent, idx: number): GameplayComponent => {
  switch (prototypeComponent.type) {
    case 'Text':
      return {...prototypeComponent, componentId: idx.toString(), componentType: prototypeComponent.type}
    case 'Image':
      return {...prototypeComponent, componentId: idx.toString(), componentType: prototypeComponent.type, imageId: ''} //todo do image id here
  }
}

export const PreviewModuleScreen: React.FC<IPreviewModuleScreen> = ({ prototypeModule, saveModule }) => (


  <View style={{paddingHorizontal: 20, paddingBottom: 40, width: displayWidth}} >
                    
    <ScrollView 
      style={{marginBottom: 20}}>

      <View style={{borderWidth: 1, borderRadius: 20, padding: 10, marginVertical: 20, backgroundColor: Colors.background, elevation: 3}}>
        <ModuleRenderer module={{ module: toGameplayModule(prototypeModule), memento: 0 }} onChoice={(choiceId) => 
          (new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(0);
            }, 1000)
          }))
          } onPassphrase={(choiceId) => 
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