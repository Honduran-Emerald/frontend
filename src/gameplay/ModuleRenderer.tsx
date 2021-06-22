import React from 'react';
import { PrototypeModule } from '../types/quest';
import { ComponentRenderer } from './ComponentRenderer';
import { ChoiceModule } from './modules/ChoiceModule';
import { StoryModule } from './modules/StoryModule';
import { EndingModule } from './modules/EndingModule';
import { View } from 'react-native';

export interface ModuleRendererProps<ModuleType extends PrototypeModule> {
  module: {
    module: ModuleType,
    memento: any
  }
}

export const ModuleRenderer: React.FC<ModuleRendererProps<PrototypeModule>> = ({ module }) => {
  
  return (
    <View>
      <ComponentRenderer components={module.module.components}/>
      {
        (() => {
          switch (module.module.type) {
            case 'Story':
              return <StoryModule module={{
                module: module.module,
                memento: module.memento
              }} />;
            case 'Choice':
              return <ChoiceModule module={{
                module: module.module,
                memento: module.memento
              }} />;
            case 'Ending':
              return <EndingModule module={{
                module: module.module,
                memento: module.memento
              }} />;
          }
        })()
      }
    </View>
  );
}