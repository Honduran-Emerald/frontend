import React from 'react';

import { GameplayComponent } from '../types/quest';
import { ImageComponent } from './components/ImageComponent';
import { TextComponent } from './components/TextComponent';


export interface ComponentRendererProps {
  components: GameplayComponent[]
}

export interface SingleComponentProps<ComponentType extends GameplayComponent> {
  data: ComponentType
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ components }) => {


  return (
    <>
      {
        //TODO remove placeholder image
      }
      <ImageComponent key={'abseie434'} data={{componentId: 'abseie434', componentType: 'Image', imageId: 'RABN90uqFCUHW8CH'}}/>
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
