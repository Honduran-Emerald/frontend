import React, { useState } from 'react';
import { Dimensions, Text } from 'react-native';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { CreateStoryModule } from './CreateStoryModule';
import { CreateEndModule } from './CreateEndModule';
import { CreateChoiceModule } from './CreateChoiceModule';
import { PrototypeComponent, PrototypeModule, PrototypeModuleBase } from '../../types/quest';
import { useAppDispatch } from '../../redux/hooks';
import { useNavigation, useRoute } from '@react-navigation/core';
import { addOrUpdateQuestModule } from '../../redux/editor/editorSlice';
import StepIndicator from 'react-native-step-indicator';
import { View } from 'react-native';
import { Colors } from '../../styles';
import { useRef } from 'react';
import { useEffect } from 'react';
import { ModuleTypeChoice } from './ModuleTypeChoice';
import { PreviewModuleScreen } from './PreviewModuleScreen';

const displayWidth = Dimensions.get('screen').width


export interface ICreateModule<ModuleType extends PrototypeModuleBase> {
    setFinalModule: (finalModule: PrototypeModule) => void,
    edit?: boolean,
    defaultValues?: ModuleType
}

export interface IModuleBase {
    objective: string,
    type: string,
    components: PrototypeComponent[],
    choices?: {
        text: string,
        nextModuleId: number | null,
    }[],
    endingFactor?: number,
}

export const CreateModuleScreen = () => {
 
    const [chosenModuleType, setChosenModuleType] = useState('')
    const [finalModule, setFinalModule] = useState<PrototypeModule>();

    const route = useRoute();
    const navigation = useNavigation();

    const swiper = useRef<ScrollView | null>(null);

    const dispatch = useAppDispatch();

    const saveModule = (finalModule: PrototypeModule) => {

        const baseModule = {
            //@ts-ignore
            id: route.params?.moduleId,
        }

        setFinalModule({...finalModule, ...baseModule})
    }

    const modules = [
        'Location',
        'Choice',
        'Story',
        'Ending'
    ]

    const moduleMap: {[moduleName: string]: JSX.Element} = {
        'Story': <CreateStoryModule setFinalModule={saveModule}/>,
        'Ending': <CreateEndModule setFinalModule={saveModule}/>,
        'Choice': <CreateChoiceModule setFinalModule={saveModule}/>
    }

    useEffect(() => {
        swiper.current?.scrollTo({
            x: 2 * displayWidth,
        });
    }, [finalModule])

    useEffect(() => {
        swiper.current?.scrollTo({
            x: displayWidth,
        });
    }, [chosenModuleType])
      

    return (
        <View style={{margin: 0, borderColor: 'black', flexGrow: 1}}>
            {/*<StepIndicator 
                customStyles={customStyles} 
                labels={['Choose\nModule Type', 'Choose Module Properties', 'Create\nModule']}
                currentPosition={currentIndex}
            stepCount={3}/>*/}
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator
                ref={swiper}
            >
                <ModuleTypeChoice chosenModuleType={chosenModuleType} modules={modules} setChosenModuleType={setChosenModuleType} swiper={swiper}/>
                {chosenModuleType in moduleMap && 
                    <ScrollView style={{width: displayWidth, margin: 0, padding: 0}}>{moduleMap[chosenModuleType]}</ScrollView>
                }
                {finalModule && <PreviewModuleScreen prototypeModule={finalModule} saveModule={() => {

                    dispatch(addOrUpdateQuestModule(finalModule)) 
                    //@ts-ignore
                    route.params?.insertModuleId()
                    navigation.navigate('ModuleGraph')
                }}/>}
            </ScrollView>
        </View>
    )
}
