import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { addOrUpdateQuestModule } from '../../redux/editor/editorSlice';
import { useAppDispatch } from '../../redux/hooks';
import { InternalFullNode } from '../graph/utils/linksParser';
import { ChoiceModule } from './module-views/ChoiceModule';
import { EndingModule } from './module-views/EndingModule';
import { StoryModule } from './module-views/StoryModule';
import { PreviewModuleScreen } from './PreviewModuleScreen';
import { PrototypeChoiceModule, PrototypeComponent, PrototypeEndingModule, PrototypeLocationModule, PrototypeModule, PrototypePassphraseModule, PrototypeRandomModule, PrototypeStoryModule } from '../../types/prototypes';
import { LocationModule } from './module-views/LocationModule';
import { ComponentCreateScreen } from './ComponentCreateScreen';
import { RandomModule } from './module-views/RandomModule';
import { PassphraseModule } from './module-views/PassphraseModule';

const displayWidth = Dimensions.get('screen').width

export const EditModuleScreen = () => {

  const route = useRoute<RouteProp<{
    params: {
      node: InternalFullNode
    }
  }, 'params'>>();

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [previewModule, setPreviewModule] = useState<PrototypeModule | undefined>(undefined)
  const [components, setComponents] = useState<PrototypeComponent[]>(route.params.node.moduleObject.components)
  const swiper = useRef<ScrollView | null>(null);

  const saveModule = (finalModule: PrototypeModule) => {
    const baseModule = {
      id: route.params?.node.id,
    }
    setPreviewModule({...finalModule, ...baseModule, components: components})
  }

  const scrollToPreview = useCallback(() => {
    swiper.current?.scrollTo({
      x: 2 * displayWidth,
    })}, [swiper])

  const moduleMap: {[moduleName: string]: JSX.Element} = {
    'Story': <StoryModule setFinalModule={saveModule} edit defaultValues={route.params.node.moduleObject as PrototypeStoryModule} setComponents={setComponents} scrollToPreview={scrollToPreview} />,
    'Ending': <EndingModule setFinalModule={saveModule} edit defaultValues={route.params.node.moduleObject as PrototypeEndingModule} setComponents={setComponents} scrollToPreview={scrollToPreview} />,
    'Choice': <ChoiceModule setFinalModule={saveModule} edit defaultValues={route.params.node.moduleObject as PrototypeChoiceModule} setComponents={setComponents} scrollToPreview={scrollToPreview} />,
    'Location': <LocationModule setFinalModule={saveModule} edit defaultValues={route.params.node.moduleObject as PrototypeLocationModule} setComponents={setComponents} scrollToPreview={scrollToPreview} />,
    'Random': <RandomModule setFinalModule={saveModule} edit defaultValues={route.params.node.moduleObject as PrototypeRandomModule} setComponents={setComponents} scrollToPreview={scrollToPreview} />,
    'Passphrase': <PassphraseModule setFinalModule={saveModule} edit defaultValues={route.params.node.moduleObject as PrototypePassphraseModule} setComponents={setComponents} scrollToPreview={scrollToPreview} />,
  }

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator
      ref={swiper} >
      <ComponentCreateScreen 
          components={components}
          setComponents={setComponents}
          onConfirm={() => swiper.current?.scrollTo({x: displayWidth})}
        />
      <ScrollView style={{width: displayWidth, margin: 0, padding: 0}}>
        {(route.params.node.moduleObject.type in moduleMap && moduleMap[route.params.node.moduleObject.type])}
      </ScrollView>
      {previewModule && <PreviewModuleScreen prototypeModule={previewModule} saveModule={() => {
        dispatch(addOrUpdateQuestModule(previewModule))
        navigation.navigate('ModuleGraph')
      }} />}
    </ScrollView>
  )
}