import React from 'react';
import { PrototypeComponent } from '../types/quest';
import { ImageComponent } from './components/ImageComponent';
import { TextComponent } from './components/TextComponent';


export interface ComponentRendererProps {
  components: PrototypeComponent[]
}

export interface SingleComponentProps {
  data: PrototypeComponent
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ components }) => {


  return (
    <> 
      {components.map(component => {
        switch (component.type) {
          case 'text':
            return <TextComponent data={component}/>;
          case 'image':
            return <ImageComponent data={component}/>;
        }
      })}
    </>
    );
}