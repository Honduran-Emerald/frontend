import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import { GameplayModule, QuestTracker } from '../types/quest';
import { ComponentRenderer } from './ComponentRenderer';
import { ChoiceModule } from './modules/ChoiceModule';
import { StoryModule } from './modules/StoryModule';
import { EndingModule } from './modules/EndingModule';
import { LocationModule } from './modules/LocationModule';
import { Colors } from '../styles';
import { RandomModule } from './modules/RandomModule';
import { PassphraseModule } from './modules/PassphraseModule';
import { QRModule } from './modules/QRModule';
import { useState } from 'react';

export interface ModuleRendererProps<ModuleType extends GameplayModule> {
  module: {
    module: ModuleType,
    memento: any
  }
  index?: number,
  onChoice: (choiceId: number | string) => Promise<any>,
  onPassphrase: (passphrase: number | string) => Promise<any>,
  tracker?: QuestTracker,
}

export interface ModuleRendererPropsLiveUpdate extends ModuleRendererProps<GameplayModule> {
  liveUpdate: boolean
}

export const ModuleRenderer: React.FC<ModuleRendererPropsLiveUpdate> = ({ module, index, onChoice, onPassphrase, tracker, liveUpdate }) => {

  const [shownAllComponents, setShownAllComponents] = useState<boolean>(false);


  console.log(module.memento)

  return (
    <View style={{paddingHorizontal: 10}}>
      {
        index === 0 && !tracker?.finished &&
        <View style={styles.newLine}>
            <View style={styles.newBox}>
                <Text style={{alignSelf: "center", color: "#f62d09"}}> New Objective </Text>
            </View>
        </View>
      }

      <View style={styles.objective}>
        <Text style={{textAlign: 'center', color: Colors.black}}>
          {module.module.objective}
        </Text>
      </View>

      <ComponentRenderer components={module.module.components} onFinishShowing={() => setShownAllComponents(true)} newRender={module.memento === null} liveUpdate={liveUpdate}/>

      {shownAllComponents &&
        (() => {
          switch (module.module.type) {
            case 'Story':
              return <StoryModule
                module={{
                  module: module.module,
                  memento: module.memento
                }}
                onChoice={onChoice}
                onPassphrase={onPassphrase}
              />;
            case 'Choice':
              return <ChoiceModule
                module={{
                  module: module.module,
                  memento: module.memento
                }}
                onChoice={onChoice}
                onPassphrase={onPassphrase}
              />;
            case 'Location':
              return <LocationModule
                module={{
                  module: module.module,
                  memento: module.memento
                }}
                onChoice={onChoice}
                onPassphrase={onPassphrase}
              />;
            case 'Ending':
              return <EndingModule
                module={{
                  module: module.module,
                  memento: module.memento
                }}
                onChoice={onChoice}
                onPassphrase={onPassphrase}
                tracker={tracker}
              />;
            case 'Random':
              return <RandomModule
                module={{
                  module: module.module,
                  memento: module.memento
                }}
                onChoice={onChoice}
                onPassphrase={onPassphrase}
                tracker={tracker}
              />
            case 'Passphrase':
              return <PassphraseModule
                module={{
                  module: module.module,
                  memento: module.memento
                }}
                onChoice={onChoice}
                onPassphrase={onPassphrase}
                tracker={tracker}
              />
            case 'QrCode':
              return <QRModule
                module={{
                  module: module.module,
                  memento: module.memento
                }}
                onChoice={onChoice}
                onPassphrase={onPassphrase}
                tracker={tracker}
              />
          }
        })()
      }
    </View>
  )
}

  const styles = StyleSheet.create({
    newLine: {
      backgroundColor: "#f62d09",
      borderRadius: 5,
      width: '100%',
      height: 3,
      alignSelf: 'center',
      marginTop: 35,
      justifyContent: "center",
    },
    newBox: {
      backgroundColor: Colors.lightGray,
      borderColor: "#f62d09",
      borderWidth: 1,
      borderRadius: 5,
      width: '50%',
      height: 25,
      alignSelf: 'center',
      justifyContent: "center"
    },
    objective: {
      backgroundColor: Colors.gray,
      borderRadius: 10,
      width: '70%',
      alignSelf: 'center',
      marginTop: 35,
      padding: 10
    },

  });
