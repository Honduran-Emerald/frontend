import React from 'react';
import { Text, View } from 'react-native';

import { GameplayModule, QuestTracker } from '../types/quest';
import { ComponentRenderer } from './ComponentRenderer';
import { ChoiceModule } from './modules/ChoiceModule';
import { StoryModule } from './modules/StoryModule';
import { EndingModule } from './modules/EndingModule';
import { LocationModule } from './modules/LocationModule';
import { Colors } from '../styles';
import { Location } from "../types/general";

export interface ModuleRendererProps<ModuleType extends GameplayModule> {
  module: {
    module: ModuleType,
    memento: any
  }
  index?: number,
  onChoice: (choiceId: number) => Promise<any>
  tracker?: QuestTracker,
  edit?: boolean
}

export const ModuleRenderer: React.FC<ModuleRendererProps<GameplayModule>> = ({ module, index, onChoice, tracker, edit }) => {

  return (
    <View style={{paddingHorizontal: 10}}>
      {
        index === 0 && !tracker?.finished &&
        <View style={{backgroundColor: Colors.gray, borderRadius: 10, width: '70%', alignSelf: 'center', marginTop: 35, padding: 10}}>
          <Text style={{textAlign: 'center', color: Colors.black}}>
            {module.module.objective}
          </Text>
        </View>
      }
      <ComponentRenderer components={module.module.components}/>

      {
        // TODO remove
        /*<LocationModule
          module={{
            module: {
              id: 32432534543632434,
              type: 'Location',
              objective: 'Go to Luisenplatz',
              components: [],
              locationModel: {
                latitude:  49.87283,
                longitude: 8.6512067,
              },
            },
            memento: module.memento
          }}
          onChoice={onChoice}
        />*/
      }

      {
        (() => {
          switch (module.module.type) {
            case 'Story':
              return <StoryModule
                module={{
                  module: module.module,
                  memento: module.memento
                }}
                onChoice={onChoice}
              />;
            case 'Choice':
              return <ChoiceModule
                module={{
                  module: module.module,
                  memento: module.memento
                }}
                onChoice={onChoice}
              />;
            case 'Location':
              return <LocationModule
                module={{
                  module: module.module,
                  memento: module.memento
                }}
                onChoice={onChoice}
              />;
            case 'Ending':
              return <EndingModule
                module={{
                  module: module.module,
                  memento: module.memento
                }}
                onChoice={onChoice}
                tracker={tracker}
              />;
          }
        })()
      }
    </View>
  );
}
