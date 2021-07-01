import React, { useState, useEffect, useRef } from 'react';
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
import { PrototypeChoiceModule, PrototypeEndingModule, PrototypeLocationModule, PrototypeModule, PrototypeStoryModule } from '../../types/prototypes';
import { LocationModule } from './module-views/LocationModule';

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
  const swiper = useRef<ScrollView | null>(null);

  const saveModule = (finalModule: PrototypeModule) => {
    const baseModule = {
      id: route.params?.node.id,
    }
    setPreviewModule({...finalModule, ...baseModule})
  }

  const moduleMap: {[moduleName: string]: JSX.Element} = {
    'Story': <StoryModule setFinalModule={saveModule} edit defaultValues={route.params.node.moduleObject as PrototypeStoryModule}/>,
    'Ending': <EndingModule setFinalModule={saveModule} edit defaultValues={route.params.node.moduleObject as PrototypeEndingModule}/>,
    'Choice': <ChoiceModule setFinalModule={saveModule} edit defaultValues={route.params.node.moduleObject as PrototypeChoiceModule}/>,
    'Location': <LocationModule setFinalModule={saveModule} edit defaultValues={route.params.node.moduleObject as PrototypeLocationModule} />
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
      ref={swiper} >
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