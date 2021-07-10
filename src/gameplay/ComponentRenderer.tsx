import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import { GameplayComponent } from '../types/quest';
import { ImageComponent } from './components/ImageComponent';
import { TextComponent } from './components/TextComponent';

import * as Animatable from 'react-native-animatable';


export interface ComponentRendererProps {
  components: GameplayComponent[],
  onFinishShowing: () => void,
  newRender: boolean,
  liveUpdate: boolean,
}

export interface SingleComponentProps<ComponentType extends GameplayComponent> {
  data: ComponentType
}

const delay = 1000;

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ components, onFinishShowing, newRender, liveUpdate }) => {


  const [loadedComponents, setLoadedComponents] = useState<number>(0);

  useEffect(() => {

    if (!newRender || !liveUpdate) {
      setLoadedComponents(components.length);
      onFinishShowing()
      return;
    }

    const tempLoads = components.map((_,idx) =>  setTimeout(() => {
      setLoadedComponents(idx);
    }, delay * idx))
    tempLoads.push(setTimeout(() => {
      setLoadedComponents(components.length+5);
    }, delay * components.length))
    tempLoads.push(setTimeout(() => {
      onFinishShowing()
    }, delay * (components.length + 1)))

    return () => {
      tempLoads.forEach(load => clearTimeout(load))
    }

  }, [components, newRender])

  return (
    <>
      {
        //TODO remove placeholder image
      }
      {/* <ImageComponent key={'abseie434'} data={{componentId: 'abseie434', componentType: 'Image', imageId: 'RABN90uqFCUHW8CH'}}/> */}
      {components.slice(0, loadedComponents).map(component => 
      <Animatable.View
        animation={(newRender && liveUpdate) ? 'fadeInLeft' : ''}
        duration={700}
      >
        {component.componentType === 'Text' ? <TextComponent key={component.componentId} data={component}/>
        : component.componentType === 'Image' ? <ImageComponent key={component.componentId} data={component}/> 
        : null}
      </Animatable.View>)}
    </>
    );
}
