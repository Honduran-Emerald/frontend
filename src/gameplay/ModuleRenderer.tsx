import React from 'react';
import { Text, View } from 'react-native';

import { GameplayModule } from '../types/quest';
import { ComponentRenderer } from './ComponentRenderer';
import { ChoiceModule } from './modules/ChoiceModule';
import { StoryModule } from './modules/StoryModule';
import { EndingModule } from './modules/EndingModule';
import { Colors } from '../styles';

export interface ModuleRendererProps<ModuleType extends GameplayModule> {
  module: {
    module: ModuleType,
    memento: any
  }
  index: number,
  onChoice: (choiceId: number) => void
}

export const ModuleRenderer: React.FC<ModuleRendererProps<GameplayModule>> = ({ module, index, onChoice }) => {

  return (
    <View style={{paddingHorizontal: 10}}>
      {
        index === 0 &&
        <View style={{backgroundColor: Colors.gray, borderRadius: 10, width: '70%', alignSelf: 'center', marginTop: 35, padding: 10}}>
          <Text style={{textAlign: 'center', color: Colors.black}}>
            {module.module.objective}
          </Text>
        </View>
      }
      <ComponentRenderer components={module.module.components}/>
      {
        (() => {
          switch (module.module.type) {
            case 'Story':
              return <StoryModule
                module={{
                  module: module.module,
                  memento: module.memento
                }}
                index={index}
                onChoice={onChoice}
              />;
            case 'Choice':
              return <ChoiceModule
                module={{
                  module: module.module,
                  memento: module.memento
                }}
                index={index}
                onChoice={onChoice}
              />;
            case 'Ending':
              return <EndingModule
                module={{
                  module: module.module,
                  memento: module.memento
                }}
                index={index}
                onChoice={onChoice}
              />;
          }
        })()
      }
    </View>
  );
}
