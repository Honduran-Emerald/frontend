import React from 'react';
import { PrototypeModule } from '../types/quest';
import { ComponentRenderer } from './ComponentRenderer';
import { ChoiceModule } from './modules/ChoiceModule';
import { StoryModule } from './modules/StoryModule';
import { EndingModule } from './modules/EndingModule';

export interface ModuleRendererProps {

  module: {
    module: PrototypeModule,
    memento: any
  }

}

export const ModuleRenderer: React.FC<ModuleRendererProps> = ({ module }) => {

  return (
    <>
      <ComponentRenderer components={module.module.components}/>
      {
        (() => {
          switch (module.module.type) {
            case 'Story':
              return <StoryModule module={module} />;
            case 'Choice':
              return <ChoiceModule module={module} />;
            case 'Ending':
              return <EndingModule module={module} />;
          }
        })()
      }
    </>
  );
}