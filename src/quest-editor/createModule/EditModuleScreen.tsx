import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Dimensions } from 'react-native';
import { Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { addOrUpdateQuestModule } from '../../redux/editor/editorSlice';
import { useAppDispatch } from '../../redux/hooks';
import { PrototypeChoiceModule, PrototypeEndingModule, PrototypeModule, PrototypeStoryModule } from '../../types/quest';
import { InternalFullNode, InternalNode } from '../graph/linksParser';
import { CreateChoiceModule } from './CreateChoiceModule';
import { CreateEndModule } from './CreateEndModule';
import { IModuleBase } from './CreateModuleScreen';
import { CreateStoryModule } from './CreateStoryModule';
import { PreviewModuleScreen } from './PreviewModuleScreen';

const displayWidth = Dimensions.get('screen').width

export const EditModuleScreen = () => {

  const route = useRoute<RouteProp<{
    params: {
      node: InternalFullNode
    }
  }, 'params'>>();

  console.log(route.params)

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [previewModule, setPreviewModule] = useState<PrototypeModule | undefined>(undefined)
  const swiper = useRef<ScrollView | null>(null);

  const [defaultValues, setDefaultValues] = useState<PrototypeModule>();

  const saveModule = (finalModule: PrototypeModule) => {
    const baseModule = {

      //@ts-ignore
      id: route.params?.node.id,
    }
    setPreviewModule({...baseModule, ...finalModule})
  }

  const moduleMap: {[moduleName: string]: JSX.Element} = {
    'Story': <CreateStoryModule setFinalModule={saveModule} edit defaultValues={route.params.node.moduleObject as PrototypeStoryModule}/>,
    'Ending': <CreateEndModule setFinalModule={saveModule} edit defaultValues={route.params.node.moduleObject as PrototypeEndingModule}/>,
    'Choice': <CreateChoiceModule setFinalModule={saveModule} edit defaultValues={route.params.node.moduleObject as PrototypeChoiceModule}/>
  }

  
  useEffect(() => {
    swiper.current?.scrollTo({
        x: displayWidth,
    });
}, [previewModule])

  return (
    <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator
                ref={swiper}
            >
      <ScrollView style={{width: displayWidth, margin: 0, padding: 0}}>
        {(route.params.node.moduleObject.type in moduleMap && moduleMap[route.params.node.moduleObject.type])}
      </ScrollView>
      {previewModule && <PreviewModuleScreen prototypeModule={previewModule} saveModule={() => {
        dispatch(addOrUpdateQuestModule(previewModule))
        //@ts-ignore
        navigation.navigate('ModuleGraph')
      }} />}
    </ScrollView>
  )
}