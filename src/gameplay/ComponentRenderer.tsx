import React from 'react';
import { Text } from 'react-native';
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
        switch (component.componentType) {
          case 'Text':
            return <TextComponent key={component.componentId} data={component}/>;
          case 'Image':
            return <ImageComponent key={component.componentId} data={component}/>;
        }
      })}
    </>
    );
}